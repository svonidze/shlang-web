import { ParsingOption } from './../model/parsing-option';
import { Component, OnInit, NgZone, Input } from '@angular/core';

import { IParsingResult } from './../model/parsing-result';
import { InputService } from './../services/input.service';
import { UserWordLocalStorageService } from './../services/user-word-local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { encode, decode } from '@angular/router/src/url_tree';
import { HtmlParser } from './html-parser';
import { LoggerService } from '../logging/logger.service';
import { Url } from 'url';
// https://stackoverflow.com/questions/18936774/javascript-equivalent-to-c-sharp-linq-select
/*
arrayFilter() -> Where()
arrayFirst() -> First()
arrayForEach() -> (no direct equivalent)
arrayGetDistictValues() -> Distinct()
arrayIndexOf() -> IndexOf()
arrayMap() -> Select()
arrayPushAll() -> (no direct equivalent)
arrayRemoveItem() -> (no direct equivalent)
compareArrays() -> (no direct equivalent)

group -> reduce https://stackoverflow.com/questions/45334848/javascript-equivalent-to-c-sharp-linq-groupby
*/

@Component({
    selector: 'app-input',
    templateUrl: './../templates/input.html',
    styleUrls: ['./../input.component.css'],
    providers: [InputService, UserWordLocalStorageService]
})
export class InputComponent implements OnInit {
    @Input() public input: string;
    parsingOption: ParsingOption;
    parsedPageUrl: string;

    public parsingResults: IParsingResult[];

    constructor(private zone: NgZone,
        private route: ActivatedRoute,
        private service: InputService,
        private userWordService: UserWordLocalStorageService,
        private htmlParser: HtmlParser,
        private log: LoggerService) {
        this.parsingOption = new ParsingOption();
        this.parsingOption.ignoreOneLetterWords = true;
    }

    ngOnInit(): void {
        this.log.info('ngOnInit');
        this.route.queryParams.subscribe(queryParams => {
            this.log.info('subscribe', queryParams);

            const text = queryParams.text;
            const pageUrl = queryParams.pageUrl;

            if (!text && !pageUrl) {
                this.log.warn('Neither text nor pageUrl were passed', queryParams);
            } else {
                this.tryToParse(text, pageUrl);
            }
        });
    }

    parseInput() {
        let text = this.input.trim();
        let url: string;

        const regex = /\s/;
        if (text.startsWith('http') && !regex.test(text)) {
            url = text;
            text = undefined;
        } else {
            url = undefined;
        }

        this.tryToParse(text, url);
    }

    private tryToParse(text: string, url: string) {
        text = decodeURI(text);
        url = decodeURI(url);

        this.zone.run(() => this.parsedPageUrl = url);

        if (text !== 'undefined') {
            this.log.info('going to parse text', text);
            this.zone.run(
                () => {
                    this.input = text;
                    this.parseText(text);
                });
        } else if (url !== 'undefined') {
            const request = new XMLHttpRequest();
            request.open('GET', url);
            request.onreadystatechange = (event) => {
                this.log.info(event);
                if (request.readyState === 4 && request.status === 200) {
                    text = this.htmlParser.extractText(request.responseText);

                    this.zone.run(
                        () => {
                            this.input = text;
                            this.parseText(text);
                        });
                } else {
                    this.log.warn('could not download the page content', request.readyState, request.status, request);
                }
            };

            request.send(null);
            this.log.info('request sent');
        }

    }

    private parseText(text: string) {
        this.parsingResults = this.service.parse(text, this.parsingOption);

        this.parsingResults.forEach(parsingResult => {
            if (this.userWordService.exist(parsingResult)) {
                const userWord = this.userWordService.get(parsingResult);

                parsingResult.toLearn = !userWord.repeatNextTimes || userWord.repeatNextTimes <= 0;
                parsingResult.repeatNextTimes = userWord.repeatNextTimes;

            }
        });
    }

    fetchLearnedWords() {
        return this.fetchWords(true);
    }

    fetchToLearnWords() {
        return this.fetchWords(false);
    }

    fetchWords(toLearn: boolean) {
        if (!this.parsingResults) {
            return this.parsingResults;
        }

        return this.parsingResults.filter(item => item.toLearn === toLearn);
    }
}

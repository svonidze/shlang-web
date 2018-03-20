import { ParsingOption } from './../model/parsing-option';
import { Component, OnInit, NgZone, Input } from '@angular/core';

import { IParsingResult } from './../model/parsing-result';
import { InputService } from './../services/input.service';
import { UserWordLocalStorageService } from './../services/user-word-local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { encode, decode } from '@angular/router/src/url_tree';
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
    providers: [InputService, UserWordLocalStorageService]
})
export class InputComponent implements OnInit {
    @Input() public input: string;
    parsingOption: ParsingOption;
    public parsingResults: IParsingResult[];


    constructor(private zone: NgZone,
        private route: ActivatedRoute,
        private service: InputService,
        private userWordService: UserWordLocalStorageService) {
        this.parsingOption = new ParsingOption();
        this.parsingOption.ignoreOneLetterWords = true;
    }

    ngOnInit(): void {
        console.log('ngOnInit');
        this.route.queryParams.subscribe(queryParams => {
            console.log('subscribe', queryParams);
            let text = queryParams.text;
            let pageUrl = queryParams.pageUrl;
            if (text) {
                text = decodeURI(text);
                console.log('subscribe', text);
                this.input = text;
                this.parse();
            } else if (pageUrl) {
                pageUrl = decodeURI(pageUrl);
                console.log('url passed, no idea what to do', pageUrl);
            }
        });
    }

    parse() {
        this.zone.run(
            () => {
                this.parsingResults = this.service.parse(this.input, this.parsingOption);
                this.parsingResults.forEach(word =>
                    word.known = this.userWordService.exist(word));
            });
    }

    fetchKnownWords() {
        return this.fetchWords(true);
    }

    fetchUnknownWords() {
        return this.fetchWords(false);
    }

    fetchWords(known: boolean) {
        if (!this.parsingResults) {
            return this.parsingResults;
        }

        return this.parsingResults.filter(item => item.known === known);
    }
}

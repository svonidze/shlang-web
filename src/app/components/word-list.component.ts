import { IWord } from './../model/word';
import { IParsingResult } from './../model/parsing-result';
import { Component, Injectable, Input, NgZone } from '@angular/core';
import { isUndefined, isNull } from 'util';
import { UserWordLocalStorageService } from './../services/user-word-local-storage.service';

@Injectable()
@Component({
    selector: 'app-word-list',
    templateUrl: '../templates/word-list.html',
    providers: [UserWordLocalStorageService]
})
export class WordListComponent {
    @Input() words: IParsingResult[];
    @Input() title: string;
    @Input('collapsedByDefault')
    set collapsedByDefault(value: boolean) {
        if (isNull(this.collapsed)) {
            this.collapsed = value;
        }
    }

    collapsed: boolean = null;

    constructor(
        private zone: NgZone,
        private wordStorage: UserWordLocalStorageService) { }

    onToLearn(word: IParsingResult) {
        if (word.toLearn) {
            if (word.repeatNextTimes > 0) {
                word.repeatNextTimes--;
            }

            this.wordStorage.add(word);
        } else {
            word.repeatNextTimes = 0;
            this.wordStorage.remove(word);
        }
    }

    toggle() {
        this.collapsed = !this.collapsed;
    }

    onKey(e: KeyboardEvent, word: IParsingResult) {
        if (!e.ctrlKey) {
            return;
        }

        if (e.keyCode === 13) { // Enter
            this.zone.run(
                () => {
                    word.editable = !word.editable;
                });
        }
        if (e.keyCode === 38) { // up arrow
            this.zone.run(
                () => {
                    if (!word.repeatNextTimes) {
                        word.repeatNextTimes = 0;
                    }
                    word.repeatNextTimes += 5;
                    word.toLearn = true;
                    this.onToLearn(word);

                    console.log(word);
                });
        }

        console.log(e);
    }

}

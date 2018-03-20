import { IWord } from './../model/word';
import { IParsingResult } from './../model/parsing-result';
import { Component, Injectable, Input } from '@angular/core';
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

    constructor(private wordStorage: UserWordLocalStorageService) { }

    itemMarkedAsKnown(item: IParsingResult) {
        if (item.known) {
            this.wordStorage.add(item);
        } else {
            this.wordStorage.remove(item);
        }
    }

    toggle() {
        this.collapsed = !this.collapsed;
    }

}

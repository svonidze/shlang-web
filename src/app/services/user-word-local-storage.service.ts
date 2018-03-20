import { IWord } from './../model/word';

export class UserWordLocalStorageService {
    exist(word: IWord): boolean {
        return localStorage.getItem(word.value) !== null;
    }

    add(word: IWord): void {
        if (!this.exist(word)) {
            localStorage.setItem(word.value, '');
        }
    }

    remove(word: IWord): void {
        if (this.exist(word)) {
            localStorage.removeItem(word.value);
        }
    }
}

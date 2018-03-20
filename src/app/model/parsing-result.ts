import { IWord } from './word';

export interface IParsingResult extends IWord {
    count: number;
    known: boolean;
}

export class ParsingResult implements IParsingResult {
    value: string;
    count: number;
    known: boolean;
    languageCode: string;

    constructor(value: string, count: number, known: boolean = false) {
        this.value = value;
        this.count = count;
        this.known = known;
    }

}

import { IUserWord } from './word';

export interface IParsingResult extends IUserWord {
    count: number;
    known: boolean;
    editable: boolean;
}

export class ParsingResult implements IParsingResult {
    editable: boolean;
    value: string;
    count: number;
    known: boolean;
    repeatNextTimes: number;

    constructor(value: string, count: number, known: boolean = false) {
        this.value = value;
        this.count = count;
        this.known = known;
    }

}

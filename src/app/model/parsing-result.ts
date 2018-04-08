import { IUserWord } from './word';

export interface IParsingResult extends IUserWord {
    count: number;
    toLearn: boolean;
    editable: boolean;
}

export class ParsingResult implements IParsingResult {
    editable: boolean;
    value: string;
    count: number;
    toLearn: boolean;
    repeatNextTimes: number;

    constructor(value: string, count: number, toLearn: boolean = false) {
        this.value = value;
        this.count = count;
        this.toLearn = toLearn;
    }

}

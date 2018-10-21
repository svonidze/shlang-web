import { IUserWord } from "./Word";

export interface IParsingContext {
    url?: string;
    text?: string;
}

export interface IParsingResult extends IParsingContext {
    words: IParsedWord[];
}

export interface IParsedWord extends IUserWord {
    count: number;
    toLearn: boolean;
    editable: boolean;
}

export class ParsedWord implements IParsedWord {
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
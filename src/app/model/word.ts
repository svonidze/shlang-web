export interface IWord {
    value: string;
}

export interface IUserWord extends IWord {
    repeatNextTimes?: number;
}

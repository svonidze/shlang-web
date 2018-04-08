export interface IWord {
    value: string;
}

export interface IUserWord extends IWord, IUserWordSetting {
}

export class UserWord implements IUserWord {
    constructor(value: string) {
        this.value = value;
    }

    value: string;
    repeatNextTimes: number;
}


export interface IUserWordSetting {
    repeatNextTimes: number;
}

export class UserWordSetting implements IUserWordSetting {
    repeatNextTimes: number;
}

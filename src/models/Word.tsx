export interface IWord {
  value: string;
}

export interface IUserWordSetting {
  repeatNextTimes: number;
}

export interface IUserWord extends IWord, IUserWordSetting {
}
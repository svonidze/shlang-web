import { IUserWord } from './Word';

export interface IUserConfiguration {
    preferedLangTo: string;
}

export class UserConfiguration implements IUserConfiguration {
    preferedLangTo: string;
    userWords: IUserWord[];
}

export interface ITranslationOption {
    langFrom?: string;
    langTo: string;
}
export interface ITranslation{
    originalWord: string;
    translatedWord?: string | undefined;
}

// cant use
// extends Map<string, ITranslation> 
// due to https://github.com/Microsoft/TypeScript/issues/11304
export class Translations {
    map: Map<string, ITranslation & ITranslationOption>;

    constructor(array?: Translations | undefined | null) {
        this.map = new Map<string, ITranslation & ITranslationOption>();
        array && array.map.forEach((v, k) => this.map.set(k, v));
    }

    get(key: string): ITranslation & ITranslationOption | undefined {
        return this.map.get(key);
    }

    has(key: string): boolean {
        return this.map.has(key);
    }

    set(key: string, value: ITranslation & ITranslationOption): this {
        this.map.set(key, value);
        return this;
    }

    delete(key: string): boolean {
        return this.map.delete(key);
    }
}

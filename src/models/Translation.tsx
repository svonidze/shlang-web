import { string } from "prop-types";

export interface ITranslation {
    originalWord: string;
    translatedWord: string;

    langFrom: string;
    langTo: string;
}

// cant use
// extends Map<string, ITranslation> 
// due to https://github.com/Microsoft/TypeScript/issues/11304
export class Translations {
    map: Map<string, ITranslation>;

    constructor(array?: Translations | undefined | null) {
        this.map = new Map<string, ITranslation>();
        array && array.map.forEach((v, k) => this.map.set(k, v));
    }

    get(key: string): ITranslation | undefined {
        return this.map.get(key);
    }

    has(key: string): boolean {
        return this.map.has(key);
    }

    set(key: string, value: ITranslation): this {
        this.map.set(key, value);
        return this;
    }

    delete(key: string): boolean {
        return this.map.delete(key);
    }
}

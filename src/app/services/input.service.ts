import { ParsingOption } from './../model/parsing-option';
import { Injectable } from '@angular/core';

import { IParsingResult } from './../model/parsing-result';
import { ParsingResult } from './../model/parsing-result';
import { UnicodeAllLeters, SpecialNonLetterChars } from './../data/unicode-char-sets';

@Injectable()
export class InputService {
    parse(input: string, parsingOption: ParsingOption): IParsingResult[] {
        const result: IParsingResult[] = [];

        if (input.startsWith('http')) {
            console.log('url detected');
            // todo make it downloading? or redicrecting to readable view
            return result;
        }
        const minWordLenght = parsingOption.ignoreOneLetterWords ? 1 : 0;

        // See https://github.com/wooorm/franc/ for language detection
        const splitRegex = new RegExp('[^' + UnicodeAllLeters + SpecialNonLetterChars + ']+');

        const groups = input.split(splitRegex)
            .filter(i => i.length > minWordLenght)
            .reduce(
                (accumulator, current) => {
                    current = current.toLowerCase();
                    isNaN(accumulator[current]) ? accumulator[current] = 1 : accumulator[current]++;
                    return accumulator;
                }, {});
        Object.keys(groups).forEach(word =>
            result.push(new ParsingResult(word, groups[word]))
        );

        return result.sort((a, b) => b.count - a.count);
    }
}

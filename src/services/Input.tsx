import { IParsingOption } from '../models/ParsingOption'
import { IParsedWord, ParsedWord, IParsingResult } from '../models/ParsingResult'
import { UnicodeAllLeters } from '../constants/CharSets';
import { ConsoleLoggerService } from './ConsoleLogger';
import { extractTextFromHtml } from "./HtmlParser";

const log: ConsoleLoggerService = new ConsoleLoggerService();

export function parseInput(input: string, parsingOption: IParsingOption): IParsingResult | undefined {
    input = input.trim();
    if (input.length == 0) {
        log.warn('input is blank.');
        return undefined;
    }
    try {
        input = decodeURI(input);    
    } catch (error) {
        log.error('An error happened during decoding the input', error, input);
    }

    const noWhitespaceIn = (text: string) => !/\s/.test(text);
    if (input.startsWith('http') && noWhitespaceIn(input)) {
        let text = downloadUrlContentFrom(input);
        return {
            url: input,
            text: text,
            words: parseText(text, parsingOption)
        }
    }

    log.info('going to parse text', input);

    return {
        text: input,
        words: parseText(input, parsingOption)
    }
}

function downloadUrlContentFrom(url: string): string | undefined {
    // TODO make the request async. look for libs like fetch or ky
    const request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.onerror = e => {
        log.error(`XMLHttpRequest failed`, e);
    };
    // TODO this may fail due to CORS. No 'access-control-allow-origin' header is present on the requested resource
    request.send(undefined);
    if (request.status === 200) {
        return extractTextFromHtml(request.responseText);
    }

    log.error(`${url} could not be downloaded`, request);
    return undefined;
}

function parseText(input: string | undefined, parsingOption: IParsingOption): IParsedWord[] {
    const result: IParsedWord[] = [];

    if (!input) {
        console.warn('parseText', 'input was empty', input);
        return result;
    }

    const minWordLenght = parsingOption.ignoreOneLetterWords ? 1 : 0;

    // See https://github.com/wooorm/franc/ for language detection
    const splitRegex = new RegExp('[^' + UnicodeAllLeters + ']+'); // + SpecialNonLetterChars

    const groups = input.split(splitRegex)
        .filter(i => i.length > minWordLenght)
        .reduce(
            (accumulator, current) => {
                current = current.toLowerCase();
                isNaN(accumulator[current]) ? accumulator[current] = 1 : accumulator[current]++;
                return accumulator;
            }, {});
    Object.keys(groups).forEach(word =>
        result.push(new ParsedWord(word, groups[word])
        )
    );

    return result;
}
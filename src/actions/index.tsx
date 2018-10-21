import * as constants from '../constants'
import { IParsedWord } from '../models/ParsingResult';

export interface MarkWordToLearn {
    type: constants.TOGGLE_WORD_TO_LEARN,
    word: IParsedWord
}

export interface PressKeyOnWord {
    type: constants.PRESS_KEY_ON_WORD,
    word: IParsedWord,
    event: React.KeyboardEvent
}

export interface ParseText {
    type: constants.PARSE_TEXT,
    text: string
}

export type WordAction = MarkWordToLearn | PressKeyOnWord | ParseText;
export type WordsAction = ParseText;

export function togglekWordToLearn(word: IParsedWord): MarkWordToLearn {
    return {
        type: constants.TOGGLE_WORD_TO_LEARN,
        word: word
    }
}

export function pressKeyOnWord(word: IParsedWord, event: React.KeyboardEvent): PressKeyOnWord {
    return {
        type: constants.PRESS_KEY_ON_WORD,
        word: word,
        event: event
    }
}

export function parseText(text: string): ParseText {
    return {
        type: constants.PARSE_TEXT,
        text: text
    }
}
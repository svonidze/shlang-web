import * as constants from '../constants'
import { IParsedWord } from '../models/ParsingResult';
import { ITranslation } from 'src/models/Translation';

export interface MarkWordToLearn {
    type: constants.TOGGLE_WORD_TO_LEARN,
    word: IParsedWord
}

export interface MarkWordToRepeat {
    type: constants.MARK_WORD_TO_REPEAT,
    word: IParsedWord
}

export interface MarkWordAsIncorect {
    type: constants.MARK_WORD_AS_INCORECT,
    word: IParsedWord
}

export interface PressKeyOnWord {
    type: constants.PRESS_KEY_ON_WORD,
    word: IParsedWord,
    event: React.KeyboardEvent
}

export interface SetTranslationToWord {
    type: constants.SET_TRANSLATION_TO_WORD,
    translation: ITranslation;
}

export interface ParseText {
    type: constants.PARSE_TEXT,
    text: string
}

export interface StartWordDiscovery {
    type: constants.START_WORD_DISCOVERY,
}

export interface StopWordDiscovery {
    type: constants.STOP_WORD_DISCOVERY,
}

export interface DiscoverNextWord {
    type: constants.DISCOVER_NEXT_WORD,
    nextIndex: number
}

export type WordAction = 
      MarkWordToLearn 
    | MarkWordToRepeat
    | MarkWordAsIncorect
    | SetTranslationToWord
    | PressKeyOnWord 
    | ParseText 
    | StartWordDiscovery 
    | StopWordDiscovery 
    | DiscoverNextWord;
export type WordsAction = ParseText;

export function toggleWordToLearn(word: IParsedWord): MarkWordToLearn {
    return {
        type: constants.TOGGLE_WORD_TO_LEARN,
        word: word
    }
}

export function markWordToRepeat(word: IParsedWord): MarkWordToRepeat {
    return {
        type: constants.MARK_WORD_TO_REPEAT,
        word: word
    }
}

export function markWordAsIncorect(word: IParsedWord): MarkWordAsIncorect {
    return {
        type: constants.MARK_WORD_AS_INCORECT,
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

export function setTranslationToWord(translation: ITranslation): SetTranslationToWord {
    return {
        type: constants.SET_TRANSLATION_TO_WORD,
        translation: translation
    }
}

export function parseText(text: string): ParseText {
    return {
        type: constants.PARSE_TEXT,
        text: text
    }
}

export function startWordDiscovery(): StartWordDiscovery {
    return {
        type: constants.START_WORD_DISCOVERY,
    }
}

export function stopWordDiscovery(): StopWordDiscovery {
    return {
        type: constants.STOP_WORD_DISCOVERY,
    }
}

export function discoverNextWord(nextIndex: number): DiscoverNextWord {
    return {
        type: constants.DISCOVER_NEXT_WORD,
        nextIndex: nextIndex
    }
}

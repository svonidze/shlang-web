export const APPLICATION_NAME = 'shlang';

// This const/type pattern allows us to use TypeScript's string literal types in an easily accessible and refactorable way.
export const TOGGLE_WORD_TO_LEARN = 'TOGGLE_WORD_TO_LEARN';
export type TOGGLE_WORD_TO_LEARN = typeof TOGGLE_WORD_TO_LEARN;

export const MARK_WORD_TO_REPEAT = 'MARK_WORD_TO_REPEAT';
export type MARK_WORD_TO_REPEAT = typeof MARK_WORD_TO_REPEAT;

export const MARK_WORD_AS_INCORECT = 'MARK_WORD_AS_INCORECT';
export type MARK_WORD_AS_INCORECT = typeof MARK_WORD_AS_INCORECT;

export const SET_TRANSLATION_TO_WORD = 'SET_TRANSLATION_TO_WORD';
export type SET_TRANSLATION_TO_WORD = typeof SET_TRANSLATION_TO_WORD;

export const PRESS_KEY_ON_WORD = 'PRESS_KEY_ON_WORD';
export type PRESS_KEY_ON_WORD = typeof PRESS_KEY_ON_WORD;

export const PARSE_TEXT = 'PARSE_TEXT';
export type PARSE_TEXT = typeof PARSE_TEXT;

export const START_WORD_DISCOVERY = 'START_WORD_DISCOVERY';
export type START_WORD_DISCOVERY = typeof START_WORD_DISCOVERY;

export const STOP_WORD_DISCOVERY = 'STOP_WORD_DISCOVERY';
export type STOP_WORD_DISCOVERY = typeof STOP_WORD_DISCOVERY;

export const DISCOVER_NEXT_WORD = 'DISCOVER_NEXT_WORD';
export type DISCOVER_NEXT_WORD = typeof DISCOVER_NEXT_WORD;


export const BACKUP_FILE = {
    MIME_type: 'application/json;charset=utf-8;',
    name: 'shlang-user-data-backup.json'
}
export const APPLICATION_NAME = 'shlang';

// This const/type pattern allows us to use TypeScript's string literal types in an easily accessible and refactorable way.
export const TOGGLE_WORD_TO_LEARN = 'TOGGLE_WORD_TO_LEARN';
export type TOGGLE_WORD_TO_LEARN = typeof TOGGLE_WORD_TO_LEARN;

export const PRESS_KEY_ON_WORD = 'PRESS_KEY_ON_WORD';
export type PRESS_KEY_ON_WORD = typeof PRESS_KEY_ON_WORD;

export const PARSE_TEXT = 'PARSE_TEXT';
export type PARSE_TEXT = typeof PARSE_TEXT;

export const BACKUP_FILE = {
    MIME_type: 'application/json;charset=utf-8;',
    name: 'shlang-user-data-backup.json'
}
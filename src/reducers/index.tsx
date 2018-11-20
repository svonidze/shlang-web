import { Key } from 'ts-keycode-enum';

import { IState } from '../components/Board';
import { WordAction } from '../actions';
import { TOGGLE_WORD_TO_LEARN, PRESS_KEY_ON_WORD, PARSE_TEXT, START_WORD_DISCOVERY, STOP_WORD_DISCOVERY, DISCOVER_NEXT_WORD } from '../constants/index';
import { parseInput } from '../services/Input'
import { VocabularyLocalStorage } from '../services/VocabularyLocalStorage';
import { IParsedWord } from '../models/ParsingResult';

export function word(state: IState, action: WordAction): IState {
    console.info('reducer word', action, state);
    const wordStorage = new VocabularyLocalStorage();

    switch (action.type) {
        case TOGGLE_WORD_TO_LEARN: {
            return toggleWordToLearn(action.word, wordStorage, state);
        }
        case PARSE_TEXT: {
            const parsingResult = parseInput(action.text, { ignoreOneLetterWords: true });

            if (!parsingResult) {
                return state;
            }

            parsingResult.words.forEach(word => {
                if (wordStorage.exist(word)) {
                    const userWord = wordStorage.get(word);

                    word.toLearn = (userWord.repeatNextTimes || 0) > 0;
                    word.repeatNextTimes = userWord.repeatNextTimes;
                }
                else {
                    word.toLearn = true;
                }
            });
            return parsingResult;
        }
        case PRESS_KEY_ON_WORD: {
            const event = action.event;
            if (!event.ctrlKey) {
                return state;
            }

            let word = { ...action.word };
            const keyCode: Key = event.keyCode;
            switch (keyCode) {
                case Key.Enter: {
                    word.editable = !word.editable;
                    let words = replaceOldWithNewWord(state.words, word);
                    return { ...state, words: words };
                }
                case Key.Numpad8:
                case Key.UpArrow: {
                    word.toLearn = false;

                    if (!word.repeatNextTimes) {
                        word.repeatNextTimes = 0;
                    }
                    word.repeatNextTimes += 5;
                    wordStorage.addOrUpdate(word);

                    let words = replaceOldWithNewWord(state.words, word);
                    return { ...state, words: words };
                }
                case Key.Numpad2:
                case Key.DownArrow: {
                    return toggleWordToLearn(action.word, wordStorage, state);
                }
                case Key.Numpad6:
                case Key.RightArrow: {
                    return discoverNextWord(state.currentWordIndex! + 1);
                }
                case Key.Numpad4:
                case Key.LeftArrow: {
                    return discoverNextWord(state.currentWordIndex! - 1);
                }
                default: {
                    console.warn(`Key ${keyCode} not supported`);
                }
            }
            return state;
        }
        case START_WORD_DISCOVERY: {
            return { ...state, wordDiscoveryRunning: true, currentWordIndex: 0 };
        }
        case STOP_WORD_DISCOVERY: {
            return { ...state, wordDiscoveryRunning: false };
        }
        case DISCOVER_NEXT_WORD: {
            return discoverNextWord(action.nextIndex);
        }
        default: {
            console.warn('Action is not handled', action, state);
            return state;
        }
    }

    function discoverNextWord(nextIndex: number) {
        if (nextIndex >= state.words.length || nextIndex < 0) {
            console.warn(`trying to move out of words range ${state.words.length}`, nextIndex);
            return state;
        }
        return {
            ...state,
            currentWordIndex: nextIndex,
        };
    }
}

function toggleWordToLearn(sourceWord: IParsedWord, wordStorage: VocabularyLocalStorage, state: IState) {
    let word = { ...sourceWord };
    if (word.toLearn) {
        if (word.repeatNextTimes > 0) {
            word.repeatNextTimes--;
        }
    }
    word.toLearn = !word.toLearn;
    wordStorage.addOrUpdate(word);
    let words = replaceOldWithNewWord(state.words, word);
    return { ...state, words: words };
}

function replaceOldWithNewWord(source: IParsedWord[], word: IParsedWord) {
    let words = source.filter(w => w.value !== word.value);
    words.push(word);
    return words;
}

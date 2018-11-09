import { IState } from '../components/Board';
import { WordAction } from '../actions';
import { TOGGLE_WORD_TO_LEARN, PRESS_KEY_ON_WORD, PARSE_TEXT } from '../constants/index';
import { parseInput } from '../services/Input'
import { VocabularyLocalStorage } from '../services/VocabularyLocalStorage';
import { IParsedWord } from '../models/ParsingResult';

export function word(state: IState, action: WordAction): IState {
    console.info('reducer word', action, state);
    const wordStorage = new VocabularyLocalStorage();

    switch (action.type) {
        case TOGGLE_WORD_TO_LEARN: {
            let word = { ...action.word };
            if (word.toLearn) {
                if (word.repeatNextTimes > 0) {
                    word.repeatNextTimes--;
                }
            }
            word.toLearn = !word.toLearn;
            wordStorage.addOrUpdate(word);
            let words = replaceOldWithNewWord(state.words, word);
            return { words: words };
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
            {
                const event = action.event;
                if (!event.ctrlKey) {
                    return state;
                }

                let word = { ...action.word };
                // Enter
                if (event.keyCode === 13) {
                    word.editable = !word.editable;
                    let words = replaceOldWithNewWord(state.words, word);
                    return { words: words };
                }
                // up arrow
                if (event.keyCode === 38) {
                    word.toLearn = false;

                    if (!word.repeatNextTimes) {
                        word.repeatNextTimes = 0;
                    }
                    word.repeatNextTimes += 5;
                    wordStorage.addOrUpdate(word);

                    let words = replaceOldWithNewWord(state.words, word);
                    return { words: words };
                }
            }
            return state;
        }
        default:
            {
                console.warn('Action is not supported', action, state);
                return state;
            }
    }
}

function replaceOldWithNewWord(source: IParsedWord[], word: IParsedWord) {
    let words = source.filter(w => w.value !== word.value);
    words.push(word);
    return words;
}

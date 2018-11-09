import { ConsoleLoggerService as LoggerService } from './ConsoleLogger';
import { TransactionSummary } from '../models/TransactionSummary';
import { IUserWord, IWord } from '../models/Word';
import { ChangeType } from '../models/ChangeType';
import { LocalStorageWrapper } from './LocalStorageWrapper';

type ChangeExecutionCallback = (word: IUserWord) => ChangeType;

export class VocabularyLocalStorage {
    private storage = new LocalStorageWrapper('word');
    private log: LoggerService
    constructor() {
        this.log = new LoggerService();
    }

    exist(word: IWord): boolean {
        const exist = this.storage.getItem(word.value) !== null;
        // this.log.info('word "', word.value, '" exists?', exist);
        return exist;
    }

    addOrUpdate(word: IUserWord): TransactionSummary {
        this.log.info('addOrUpdate', word);
        return this.executeChange([word], w => this.upsert(w));
    }

    set(word: IUserWord): void {
        // TODO use casting
        // const setting = word as UserWordSetting;
        // if (setting instanceof UserWordSetting) {
        //     this.log.info('myObject *is* an instance of Type!', setting);
        //   } else {
        //     this.log.info('Oops! myObject is not an instance of Type...');
        //   }
        let json: string = '';
        if (word.repeatNextTimes && word.repeatNextTimes > 0) {
            json = JSON.stringify({ repeatNextTimes: word.repeatNextTimes });
        }
        this.log.info('set', json);
        this.storage.setItem(word.value, json);
    }

    get(word: IWord): IUserWord {
        this.log.info('get');

        const json = this.storage.getItem(word.value);

        if (json && json !== 'undefined') {
            const userWord = JSON.parse(json) as IUserWord;
            userWord.value = word.value;
            return userWord;
        } else {
            return { value: word.value, repeatNextTimes: 0 };
        }
    }

    remove(word: IUserWord): TransactionSummary {
        this.log.info('remove', word);
        return this.executeChange([word], w => {
            if (this.exist(w)) {
                this.storage.removeItem(w.value);
                return ChangeType.Deleted;
            }
            return ChangeType.Undefined;
        });
    }

    getAll(): IUserWord[] {
        this.log.info('getAll');

        const words: IUserWord[] = [];
        this.storage.keys().map(key => {
            const word: IUserWord = JSON.parse(this.storage.getItem(key) || '{}');
            word.value = key;
            return words.push(word);
        });
        return words;
    }

    addAll(words: IUserWord[]): TransactionSummary {
        this.log.info('addAll', words);

        return this.executeChange(words, w => this.upsert(w));
    }

    private upsert(word: IUserWord): ChangeType {
        const changeType = this.exist(word)
            ? ChangeType.Updated
            : ChangeType.Created;

        this.set(word);
        return changeType;
    }

    private executeChange(items: IUserWord[], func: ChangeExecutionCallback) {
        const transaction = new TransactionSummary();
        transaction.changes = [];
        if (!items) {
            return transaction;
        }

        const changeTypes: ChangeType[] = [];
        try {
            items.forEach(item => {
                const changeType = func(item);
                changeTypes.push(changeType);
            });

            transaction.success = true;
        } catch (e) {
            transaction.success = false;
            transaction.error = e;
            throw e;
        }

        changeTypes.reduce(
            (accumulator, current: ChangeType) => {
                const trans = accumulator.transaction;
                if (isNaN(accumulator[current])) {
                    accumulator[current] = 1;
                    trans.changes.push({
                        type: 'Word',
                        changeType: current,
                        count: 1
                    });
                } else {
                    accumulator[current]++;
                    const change = trans.changes
                        .filter(c => c.changeType === current)[0];
                    change.count++;
                }
                return accumulator;
            }, { transaction });

        return transaction;
    }
}

import { ChangeSummary } from './../model/change-summary';
import { TransactionSummary } from './../model/transaction-summary';
import { IWord, IUserWord } from './../model/word';
import { ChangeType } from '../model/change-type';

type ChangeExecutionCallback = (word: IWord) => ChangeType;

export class UserWordLocalStorageService {
    exist(word: IWord): boolean {
        return localStorage.getItem(word.value) !== null;
    }

    add(word: IWord): TransactionSummary {
        return this.executeChange([word], w => this.tryAdd(w));
    }

    remove(word: IWord): TransactionSummary {
        return this.executeChange([word], w => {
            if (this.exist(w)) {
                localStorage.removeItem(w.value);
                return ChangeType.Deleted;
            }
            return ChangeType.Undefined;
        });
    }

    getAll(): IUserWord[] {
        const words: IUserWord[] = [];
        Object.keys(localStorage).map(key => words.push({ value: key }));
        return words;
    }

    addAll(words: IWord[]): TransactionSummary {
        return this.executeChange(words, w => this.tryAdd(w));
    }

    private tryAdd(word: IWord): ChangeType {
        if (!this.exist(word)) {
            localStorage.setItem(word.value, '');
            return ChangeType.Created;
        }

        // TODO implement updating value
        return ChangeType.Unchanged;
    }

    private executeChange(items: IWord[], func: ChangeExecutionCallback) {
        const transaction = new TransactionSummary();
        transaction.changes = [];

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

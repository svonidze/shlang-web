import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { GoogleTranslateApi } from 'src/services/GoogleTranslate/GoogleTranslateApi';
import { setTranslationToWord } from '.';
import { AnyAction } from 'redux';
import { Languages } from 'src/constants/Languages';

export function translateWord(
        word: string, 
        langFrom: string | undefined, 
        langTo: string): ThunkAction<Promise<void>, {}, {}, AnyAction> {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {

        const translater = new GoogleTranslateApi();

        return translater.translate(word, { to: langTo, from: langFrom || Languages.auto })
            .then((res: any) => {
                dispatch(setTranslationToWord({
                    originalWord: word,
                    translatedWord: res.text,
                    langFrom: res.from.language.iso,
                    langTo: langTo
                }));
                console.log(res.text, res.from.language.iso, res);
            }).catch((err: any) => {
                console.error(err);
            });

    }
}
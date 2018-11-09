import * as React from "react";
import { IParsedWord } from 'src/models/ParsingResult';
import { IActionProps, Word } from "./Word";

export interface IProps {
    nextWord: IParsedWord | undefined;
    currentWord: IParsedWord;
    prevWord: IParsedWord | undefined;
    totalWordNumber: number;

    onNextWord: () => void;
    onPrevWord: () => void;

    onToggleWordToLearn: () => void;
    onMarkWordToRepeat: () => void;
    onMarkWordAsIncorect: () => void;

    onExit: () => void;
}

export function WordDiscovery(props: IProps & IActionProps) {
    const { prevWord, currentWord, nextWord } = props;
    
    return <div className="center">
        <div>
            <button className="right" onClick={() => { props.onExit(); }}>Exit</button>
            <div className="center" >
                <button className="center" onClick={props.onMarkWordAsIncorect}>Mark as Incorect</button>
                <button className="center" onClick={props.onMarkWordToRepeat}>To Repeat</button>
            </div>
        </div>
        <div className="center">
            <h6 className="center">{prevWord ? prevWord.value : 'start'}</h6>

            <div className="center">
                <Word
                    focused={true}
                    onPressKeyOnWord={props.onPressKeyOnWord}
                    onToggleWordToLearn={props.onToggleWordToLearn}
                    word={currentWord}>
                </Word>
            </div>

            <button className="left" disabled={!prevWord} onClick={props.onPrevWord}>Prev</button>
            <button className="right" disabled={!nextWord} onClick={props.onNextWord}>Next</button>

            <h5 className="center">{nextWord ? nextWord.value : 'end'}</h5>
        </div>

    </div>;
}
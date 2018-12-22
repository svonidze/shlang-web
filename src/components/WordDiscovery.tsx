import * as React from "react";
import { IParsedWord } from 'src/models/ParsingResult';
import Word from "src/containers/Word";

export interface IProps {
    next: { word: IParsedWord | undefined, index: number };
    current: { word: IParsedWord, index: number };
    prev: { word: IParsedWord | undefined, index: number };
    totalWordNumber: number;
}

export interface IActionProps {
    goNextWord: (index: number) => void;

    toggleWordToLearn: () => void;
    markWordToRepeat: () => void;
    markWordAsIncorect: () => void;

    exit: () => void;
}

export function WordDiscovery(props: IProps & IActionProps) {
    const { prev, current: current, next: next } = props;

    return <div className="center">
        <div className="center">
            <label className="center">{current.index + 1}/{props.totalWordNumber}</label>
        </div>
        <div>
            <button className="right" onClick={() => { props.exit(); }}>Exit</button>
            <div className="center" >
                <button className="center" onClick={props.markWordAsIncorect}>Mark as Incorect</button>
                <button className="center" onClick={props.markWordToRepeat}>To Repeat</button>
            </div>
        </div>
        <div className="center">

            <div className="center">
                <Word focused={true} word={current.word} />
            </div>

            <div >
                <button className="left" 
                    disabled={!prev.word} 
                    onClick={() => props.goNextWord(prev.index)}>
                    {prev.word ? prev.word.value : 'start'}
                </button>
                <button className="right" 
                    disabled={!next.word} 
                    onClick={() => props.goNextWord(next.index)}>
                    {next.word ? next.word.value : 'end'}
                </button>
            </div>
        </div>

    </div>;
}
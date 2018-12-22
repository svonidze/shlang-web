import * as React from "react";
import { IParsedWord } from "../models/ParsingResult";

export interface IProps {
    word: IParsedWord;
    focused?: boolean;
}

export interface IActionProps {
    toggleWordToLearn: (word: IParsedWord) => void;
    pressKeyOnWord: (word: IParsedWord, event: React.KeyboardEvent) => void;
}

export function Word(props: IProps & IActionProps) {
    let { word, focused } = props;

    if (!word) {
        return <label>NO WORD</label>;
    }

    const checkbox = <input
        type="checkbox"
        autoFocus={focused}
        checked={!word.toLearn}
        onChange={() => props.toggleWordToLearn(word)} />;

    const textValue = word.editable
        ? <input type="text"
            value={word.value}
            onKeyUp={e => props.pressKeyOnWord(word, e)} />
        : <label>{word.value}</label>;
        
    const repeatNextTimes = word.repeatNextTimes > 0
        ? <label> REPEAT {word.repeatNextTimes} TIMES</label>
        : null;

    return <div onKeyUp={e => props.pressKeyOnWord(word, e)}>
        {checkbox}
        <label>{word.count} </label>
        {textValue}
        {repeatNextTimes}
    </div>;
}
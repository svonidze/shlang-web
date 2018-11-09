import * as React from "react";
import { IParsedWord } from "../models/ParsingResult";

export interface IProps {
    word: IParsedWord;
    focused?: boolean;
}

export interface IActionProps {
    onToggleWordToLearn?: () => void;
    onPressKeyOnWord: (event: React.KeyboardEvent) => void;
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
        onChange={props.onToggleWordToLearn} />;

    const textValue = word.editable
        ? <input type="text"
            value={word.value}
            onKeyUp={props.onPressKeyOnWord} />
        : <label>{word.value}</label>;
        
    const repeatNextTimes = word.repeatNextTimes > 0
        ? <label> REPEAT {word.repeatNextTimes} TIMES</label>
        : null;

    return <div onKeyUp={props.onPressKeyOnWord}>
        {checkbox}
        <label>{word.count} </label>
        {textValue}
        {repeatNextTimes}
    </div>;
}
import * as React from "react";
import { IParsedWord } from "../models/ParsingResult";

export interface IProps {
    word: IParsedWord;
}

export interface IActionProps {
    onToggleToLearn?: () => void;
    onKey?: (event: React.KeyboardEvent) => void;
}

export function Word(props: IProps & IActionProps) {
    //console.log('Word', props);
    let w = props.word;

    return (
        <div>
            <input type="checkbox" checked={!w.toLearn} onChange={props.onToggleToLearn} onKeyUp={props.onKey} />
            <label>{w.count} </label>
            {
                w.editable
                    ? <input type="text" value={w.value} onKeyUp={props.onKey} />
                    : <label>{w.value}</label>
            }
            {
                w.repeatNextTimes > 0
                    ? <label> REPEAT {w.repeatNextTimes} TIMES</label>
                    : null
            }
        </div>
    );
}
import * as React from "react";

import { IParsedWord } from "../models/ParsingResult";
import { ITranslation } from "src/models/Translation";

export interface IState {
    mouseOver?: boolean;
}

export interface IProps {
    word: IParsedWord;
    focused?: boolean;

    translation?: ITranslation | undefined;
}

export interface IActionProps {
    toggleWordToLearn: () => void;
    pressKeyOnWord: (event: React.KeyboardEvent) => void;
    translateWord: () => Promise<void>;
}

export class Word extends React.Component<IProps & IActionProps, IState> {
    constructor(props: IProps & IActionProps) {
        super(props);
        this.state = {};
    }

    render() {
        let { word, focused, translation } = this.props;

        if (!word) {
            return <label>NO WORD</label>;
        }

        let { mouseOver } = this.state;

        const checkboxWordToLearn = <input
            type="checkbox"
            autoFocus={focused}
            checked={!word.toLearn}
            onChange={this.props.toggleWordToLearn} />;

        const textValue = word.editable
            ? <input type="text"
                value={word.value}
                onKeyUp={(e: React.KeyboardEvent) => this.props.pressKeyOnWord(e)} />
            : !word.repeatNextTimes
                ? <label>{word.value}</label>
                : <label title={`repeat ${word.repeatNextTimes} times`}>
                    {word.value} *{word.repeatNextTimes}
                </label>;

        const translationElement = translation
            ? translation.translatedWord
            : mouseOver && <button onClick={this.props.translateWord}>Translate</button>;

        return <tr onKeyUp={this.props.pressKeyOnWord}
            onMouseOver={() => this.onMouseOver(true)}
            onMouseOut={() => this.onMouseOver(false)}>
            <td>{checkboxWordToLearn}</td>
            <td>{word.count} </td>
            <td>{textValue}</td>
            <td>{translationElement}</td>
        </tr>;
    }

    onMouseOver(mouseOver: boolean) {
        setTimeout(() => {
            if (this.state.mouseOver !== mouseOver)
                this.setState({ ...this.state, mouseOver: mouseOver });
        }, 10);
    }
}
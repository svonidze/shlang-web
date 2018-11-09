import * as React from "react";

import { IWord } from '../models/Word';
import { Word } from '../components/Word';
import { IParsedWord } from "../models/ParsingResult";

export interface IState {
    collapsed: boolean;
}

export interface IProps {
    title: string;
    words: IParsedWord[];
    collapsed: boolean;
    focused: boolean;
}

export interface IActionProps {
    toggleWordToLearn: (word: IWord) => void;
    pressKeyOnWord: (word: IParsedWord, event: React.KeyboardEvent) => void;
}

export class WordBoard extends React.Component<IProps & IActionProps, IState> {
    constructor(props: IProps & IActionProps) {
        super(props);
        this.state = { collapsed: props.collapsed };
    }

    public render() {
        console.log('WordBoard', this.props, this.state);
        return (
            <div>
                <button onClick={() => this.setState({ collapsed: !this.state.collapsed })}>^</button>
                <label>{this.props.title} {this.props.words && this.props.words.length}</label>
                {
                    !this.state.collapsed
                    && this.props.words!
                    && this.props.words.map((w, index) => {
                        return (
                            <Word key={index}
                                focused={this.props.focused && index === 0}
                                word={w}
                                onToggleWordToLearn={() => this.props.toggleWordToLearn(w)}
                                onPressKeyOnWord={(e) => this.props.pressKeyOnWord(w, e)} />
                        )
                    })
                }
            </div>
        );
    }
}
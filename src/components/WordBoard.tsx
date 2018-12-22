import * as React from "react";

import Word from '../containers/Word';
import { IParsedWord } from "../models/ParsingResult";

interface IState {
    collapsed: boolean;
}

export interface IProps {
    title: string;
    words: IParsedWord[];
    collapsed?: boolean;
    focused?: boolean;
}

export interface IActionProps {
    pressKeyOnWord: (word: IParsedWord, event: React.KeyboardEvent) => void;
}

export class WordBoard extends React.Component<IProps & IActionProps, IState> {
    constructor(props: IProps & IActionProps) {
        super(props);
        this.state = { collapsed: props.collapsed || false };
    }

    public render() {
        return (
            <div>
                <button onClick={() => this.setState({ collapsed: !this.state.collapsed })}>^</button>
                <label>{this.props.title} {this.props.words && this.props.words.length}</label>
                {
                    !this.state.collapsed
                    && this.props.words!
                    && this.props.words.map((w, index) => 
                        <Word key={index} word={w}
                            focused={this.props.focused && index === 0} />)

                }
            </div>
        );
    }
}
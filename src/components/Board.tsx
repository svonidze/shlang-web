import * as React from "react";

import { IWord } from '../models/Word';
import { WordBoard } from '../components/WordBoard';
import { IParsingResult, IParsingContext, IParsedWord } from "../models/ParsingResult";

export interface IState extends IParsingResult {
}

export interface IProps extends IParsingResult {
}

export interface IOwnProps extends IParsingContext {
}

export interface IActionProps {
    parseText: (text: string) => void;

    toggleWordToLearn: (word: IWord) => void;
    pressKeyOnWord: (word: IParsedWord, event: React.KeyboardEvent) => void;
}

export class Board extends React.Component<IProps & IActionProps, IState> {
    text: string;

    constructor(props: IProps & IActionProps) {
        super(props);
    }

    public render() {
        console.log('Board render', this.props);

        let defaultText: string = '';

        if (!this.text) {
            if (this.props.text) {
                this.text = defaultText = this.props.text;
            }
            else {
                const input = this.props.text || this.props.url;
                if (input) {
                    this.props.parseText(input);
                    return <h1>Loading...</h1>;
                }
            }
        }

        function compare<T>(a: T, b: T, getValue: (x: T) => any): number {
            const aValue = getValue(a);
            const bValue = getValue(b);

            if (aValue > bValue) return +1;
            if (aValue < bValue) return -1;
            return 0;
        }

        const sortWords = (toLearn: boolean) =>
            this.props.words.filter(w => w.toLearn === toLearn)
                .sort((a, b) => 
                    compare(b, a, x => x.count) 
                    || compare(a, b, x => x.value));

        const createWordBoard = (title: string, toLearn: boolean) =>
            <WordBoard
                title={title}
                words={sortWords(toLearn)}
                collapsed={!toLearn}
                toggleWordToLearn={this.props.toggleWordToLearn}
                pressKeyOnWord={this.props.pressKeyOnWord} />;

        return (
            <div className="center">
                <textarea className="center full-width" rows={10} defaultValue={defaultText} onChange={e => this.text = e.target.value} />
                <br/>
                <button className="right" onClick={() => this.props.parseText(this.text)}>Parse</button>
                {this.props.url &&
                    <section>
                        <a href={this.props.url}>Source page</a>
                    </section>
                }
                <div className="center">
                    {createWordBoard('Learned words', false)}
                    {createWordBoard('Words to learn', true)}
                </div>
            </div>
        );
    }
}
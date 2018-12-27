import * as React from "react";

import { IState } from 'src/App';
import { IParsingContext, IParsedWord } from "../models/ParsingResult";
import { isNullOrUndefined } from "util";

import WordBoard from "src/containers/WordBoard";
import WordDiscovery from "src/containers/WordDiscovery";

export interface IProps extends IState { }

export interface IOwnProps extends IParsingContext { }

export interface IActionProps {
    parseText: (text: string) => void;
    startWordDiscovery: () => void;
}

export class Board extends React.Component<IProps & IActionProps, IState> {
    text: string;

    constructor(props: IProps & IActionProps) {
        super(props);
    }

    public render() {
        console.log('Board render', this.props);

        const { currentWordIndex } = this.props;
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

        const filterWords = (toLearn: boolean) =>
            this.props.words.filter(w => w.toLearn === toLearn);

        const sortWords = (_: { toLearn: boolean }) =>
            filterWords(_.toLearn)
                .sort((a, b) =>
                    compare(b, a, x => x.count)
                    || compare(a, b, x => x.value));

        const unkownWords = sortWords({ toLearn: true });

        if (this.props.wordDiscoveryRunning) {
            if (isNullOrUndefined(currentWordIndex)) {
                throw new Error('currentWordIndex is not specified');
            }

            const getWord = (i: number): { word: IParsedWord, index: number } =>
                ({ word: unkownWords[i], index: i });
            return <WordDiscovery
                totalWordNumber={unkownWords.length}
                current={getWord(currentWordIndex)}
                next={getWord(currentWordIndex + 1)}
                prev={getWord(currentWordIndex - 1)} />;
        }

        const DiscoverNewWordsButton = () =>
            <button
                disabled={unkownWords.length == 0}
                className="center"
                onClick={this.props.startWordDiscovery}>
                Discover {unkownWords.length} New Words
            </button>;

        return <div className="center">
            <textarea className="center full-width" rows={10} defaultValue={defaultText} onChange={e => this.text = e.target.value} />
            <br />
            <div className="center">
                <button className="right" onClick={() => this.props.parseText(this.text)}>Parse</button>
                {DiscoverNewWordsButton()}
            </div>
            {this.props.url && <a href={this.props.url}>Source page</a>}
            <div className="center">
                <WordBoard
                    title='Learned words'
                    focused={false}
                    collapsed={true}
                    words={sortWords({ toLearn: false })} />
                <WordBoard
                    title='Words to learn'
                    focused={true}
                    collapsed={false}
                    words={unkownWords} />
            </div>
        </div>;
    }
}


function compare<T>(a: T, b: T, getValue: (x: T) => any): number {
    const aValue = getValue(a);
    const bValue = getValue(b);

    if (aValue > bValue) return +1;
    if (aValue < bValue) return -1;
    return 0;
}
import * as React from "react";

import { IWord } from '../models/Word';
import { WordBoard } from '../components/WordBoard';
import { IParsingResult, IParsingContext, IParsedWord } from "../models/ParsingResult";
import { WordDiscovery } from "./WordDiscovery";
import { isNullOrUndefined } from "util";

export interface IState extends IParsingResult {
    wordDiscoveryRunning?: boolean;
    currentWordIndex?: number;
}

export interface IProps extends IState {

}

export interface IOwnProps extends IParsingContext {
}

export interface IActionProps {
    parseText: (text: string) => void;

    onToggleToLearn: (word: IWord) => void;
    onMarkWordToRepeat: (word: IWord) => void;
    onMarkWordAsIncorect: (word: IWord) => void;
    onPressKeyOn: (word: IParsedWord, event: React.KeyboardEvent) => void;

    onDiscoverNextWord: (nextIndex: number) => void;
    startWordDiscovery: () => void;
    stopWordDiscovery: () => void;
}

export class Board extends React.Component<IProps & IActionProps> {
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

        const filterWords = (toLearn: boolean) =>
            this.props.words.filter(w => w.toLearn === toLearn);

        const sortWords = (toLearn: boolean) =>
            filterWords(toLearn)
                .sort((a, b) =>
                    compare(b, a, x => x.count)
                    || compare(a, b, x => x.value));

        const unkownWords = sortWords(true);

        if (this.props.wordDiscoveryRunning) {
            if (isNullOrUndefined(this.props.currentWordIndex)) {
                throw new Error('currentWordIndex is not specified');
            }

            const index = this.props.currentWordIndex;
            const word = unkownWords[index];
            return <WordDiscovery
                totalWordNumber={unkownWords.length}
                currentWord={word}
                nextWord={unkownWords[index + 1]}
                prevWord={unkownWords[index - 1]}
                onExit={this.props.stopWordDiscovery}
                onNextWord={() => this.props.onDiscoverNextWord(index + 1)}
                onPrevWord={() => this.props.onDiscoverNextWord(index - 1)}
                onPressKeyOnWord={e => this.props.onPressKeyOn(word, e)}
                onToggleWordToLearn={() => this.props.onToggleToLearn(word)}
                onMarkWordToRepeat={() => this.props.onMarkWordToRepeat(word)}
                onMarkWordAsIncorect={() => this.props.onMarkWordAsIncorect(word)}
            >
            </WordDiscovery>;
        }

        const newWordBoard = (_: { title: string, toLearn: boolean, focused: boolean }) =>
            <WordBoard
                title={_.title}
                focused={_.focused}
                words={_.toLearn ? unkownWords : sortWords(_.toLearn)}
                collapsed={!_.toLearn}
                toggleWordToLearn={this.props.onToggleToLearn}
                pressKeyOnWord={this.props.onPressKeyOn} />;
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
            {this.props.url &&
                <section>
                    <a href={this.props.url}>Source page</a>
                </section>
            }
            <div className="center">
                {newWordBoard({ 
                    title: 'Learned words', 
                    toLearn: false, 
                    focused: false })}
                {newWordBoard({
                    title: 'Words to learn', 
                    toLearn: true, 
                    focused: true })}
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
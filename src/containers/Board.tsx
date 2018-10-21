import { Dispatch } from "redux";

import * as actions from '../actions';
import { IProps, IState, IActionProps, IOwnProps, Board } from '../components/Board'
import { connect } from "react-redux";
import { IParsedWord } from "../models/ParsingResult";

function mapStateToProps(state: IState, ownProps: IOwnProps): IProps {
    console.log('mapStateToProps', ownProps, state)

    return {
        words: state.words,
        text: state.text || ownProps.text,
        url: state.url || ownProps.url,
    }
}

function mapDispatchToProps(dispatch: Dispatch<actions.WordAction>): IActionProps {
    return {
        parseText: (text: string) => {
            console.log('mapDispatchToProps', 'parseText');
            dispatch(actions.parseText(text));
        },
        toggleWordToLearn: (word: IParsedWord) => {
            console.log('mapDispatchToProps', 'togglekWordToLearn');
            dispatch(actions.togglekWordToLearn(word));

        },
        pressKeyOnWord: (word: IParsedWord, event: React.KeyboardEvent) => {
            console.log('mapDispatchToProps', 'pressKeyOnWord');
            dispatch(actions.pressKeyOnWord(word, event));
        }
    }
}
export default connect<IProps, IActionProps, IOwnProps>(mapStateToProps, mapDispatchToProps)(Board);
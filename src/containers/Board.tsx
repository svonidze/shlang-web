import { Dispatch } from "redux";

import * as actions from '../actions';
import { IProps, IState, IActionProps, IOwnProps, Board } from '../components/Board'
import { connect } from "react-redux";
import { IParsedWord } from "../models/ParsingResult";
import { Key } from "ts-keycode-enum";

function mapStateToProps(state: IState, ownProps: IOwnProps): IProps {
    console.log('mapStateToProps', ownProps, state)

    return {
        ...state,
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
        onToggleToLearn: (word: IParsedWord) => {
            console.log('mapDispatchToProps', 'toggleWordToLearn');
            dispatch(actions.toggleWordToLearn(word));
        },
        onMarkWordToRepeat: (word: IParsedWord) => {
            console.log('mapDispatchToProps', 'onMarkWordToRepeat');
            dispatch(actions.onMarkWordToRepeat(word));
        },
        onMarkWordAsIncorect: (word: IParsedWord) => {
            console.log('mapDispatchToProps', 'onMarkWordAsIncorect');
            dispatch(actions.onMarkWordAsIncorect(word));
        },
        onPressKeyOn: (word: IParsedWord, event: React.KeyboardEvent) => {
            console.log('mapDispatchToProps', 'pressKeyOnWord', Key[event.keyCode]);
            dispatch(actions.pressKeyOnWord(word, event));
        },
        startWordDiscovery: () => {
            dispatch(actions.startWordDiscovery());
        },
        stopWordDiscovery: () => {
            dispatch(actions.stopWordDiscovery());
        },
        onDiscoverNextWord: (nextIndex: number) => {
            dispatch(actions.discoverNextWord(nextIndex));
        },
    }
}
export default connect<IProps, IActionProps, IOwnProps>(mapStateToProps, mapDispatchToProps)(Board);
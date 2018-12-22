import { Dispatch } from "redux";

import * as actions from '../actions';
import { IState as IAppState } from 'src/App';
import { connect } from "react-redux";
import { IParsedWord } from "../models/ParsingResult";
import { Key } from "ts-keycode-enum";
import { IProps, IActionProps, Word } from "src/components/Word";

const mapStateToProps = (state: IAppState, ownProps: IProps): IProps => ownProps;

const mapDispatchToProps = (dispatch: Dispatch<actions.WordAction>): IActionProps => ({
    toggleWordToLearn: (word) => dispatch(actions.toggleWordToLearn(word)),
    pressKeyOnWord: (word: IParsedWord, event: React.KeyboardEvent) => {
        console.log('mapDispatchToProps', 'pressKeyOnWord', Key[event.keyCode]);
        dispatch(actions.pressKeyOnWord(word, event));
    }
});

export default connect<{}, IActionProps, IProps>(mapStateToProps, mapDispatchToProps)(Word);
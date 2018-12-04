import * as actions from '../actions';
import { IState as IAppState } from 'src/App';
import { connect } from "react-redux";
import { Key } from "ts-keycode-enum";
import { IProps, IActionProps, Word } from "src/components/Word";
import { translateWord } from "src/actions/translating";
import { ThunkDispatch } from "redux-thunk";

const mapStateToProps = (state: IAppState, ownProps: IProps): IProps => ({ 
    ...ownProps, 
    translation: state.translations && state.translations.get(ownProps.word.value) 
});

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>, ownProps: IProps): IActionProps => ({
    toggleWordToLearn: () => dispatch(actions.toggleWordToLearn(ownProps.word)),
    pressKeyOnWord: (event: React.KeyboardEvent) => {
        console.log('mapDispatchToProps', 'pressKeyOnWord', Key[event.keyCode]);
        dispatch(actions.pressKeyOnWord(ownProps.word, event));
    },
    translateWord: async () => {
        await dispatch(translateWord(ownProps.word.value, 'en', 'ru'));
    }
});

export default connect<{}, IActionProps, IProps>(mapStateToProps, mapDispatchToProps)(Word);
import * as actions from '../actions';
import { IState as IAppState } from 'src/App';
import { connect } from "react-redux";
import { Key } from "ts-keycode-enum";
import { IProps, IActionProps, Word } from "src/components/Word";
import { translateWord } from "src/actions/translating";
import { ThunkDispatch } from "redux-thunk";

const mapStateToProps = (state: IAppState, ownProps: IProps): IProps => {
    const translation = ownProps.word &&
        state.translations && state.translations.get(ownProps.word.value);
    const newprop = {
        ...ownProps,
        translationOption: translation || ownProps.translationOption || { langFrom: state.langFrom, langTo: state.langTo },
        translation: translation,
    };

    return newprop;
};

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>, ownProps: IProps): IActionProps => ({
    toggleWordToLearn: () => dispatch(actions.toggleWordToLearn(ownProps.word)),
    pressKeyOnWord: (event: React.KeyboardEvent) => {
        console.log('mapDispatchToProps', 'pressKeyOnWord', Key[event.keyCode]);
        dispatch(actions.pressKeyOnWord(ownProps.word, event));
    },
    translateWord: async (translationOption) => {
        await dispatch(translateWord(ownProps.word.value, translationOption.langFrom, translationOption.langTo));
    }
});

export default connect<{}, IActionProps, IProps>(mapStateToProps, mapDispatchToProps)(Word);
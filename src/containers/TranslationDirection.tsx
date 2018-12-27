import * as actions from '../actions';
import { IState as IAppState } from 'src/App';
import { connect } from "react-redux";
import { IProps, IActionProps, TranslationDirection } from "src/components/TranslationDirection";
import { ThunkDispatch } from "redux-thunk";

const mapStateToProps = (state: IAppState, ownProps: IProps): IProps => (
    { ...ownProps, lang: state.langTo });

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>, ownProps: IProps): IActionProps => ({
    setLang: (langTo) => langTo !== ownProps.lang && dispatch(actions.setLangTo(langTo))
});

export default connect<{}, IActionProps, IProps>(mapStateToProps, mapDispatchToProps)(TranslationDirection);
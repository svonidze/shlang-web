import * as actions from '../actions';
import { IState as IAppState } from 'src/App';
import { connect } from "react-redux";
import Header, { IProps, IActionProps } from "src/components/Header";
import { ThunkDispatch } from "redux-thunk";

const mapStateToProps = (state: IAppState, ownProps: IProps): IProps => (
    { ...ownProps, defaultLangTo: state.langTo });

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>, ownProps: IProps): IActionProps => ({
    setLangTo: (langTo) => langTo !== ownProps.defaultLangTo && dispatch(actions.setLangTo(langTo))
});

export default connect<{}, IActionProps, IProps>(mapStateToProps, mapDispatchToProps)(Header);
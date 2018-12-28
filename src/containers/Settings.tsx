import * as actions from '../actions';
import { connect } from "react-redux";
import Settings, { IActionProps } from "src/components/Settings";
import { ThunkDispatch } from "redux-thunk";

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>): IActionProps => ({
    setLangTo: lang => dispatch(actions.setLangTo(lang))
});

export default connect<{}, IActionProps>(null, mapDispatchToProps)(Settings);
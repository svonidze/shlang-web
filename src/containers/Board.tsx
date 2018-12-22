import { Dispatch } from "redux";

import * as actions from '../actions';
import { IState as IAppState } from 'src/App';
import { IProps, IActionProps, IOwnProps, Board } from '../components/Board'
import { connect } from "react-redux";

const mapStateToProps = (state: IAppState, ownProps: IOwnProps): IProps => ({
    ...state,
    text: state.text || ownProps.text,
    url: state.url || ownProps.url,
});

const mapDispatchToProps = (dispatch: Dispatch<actions.WordAction>): IActionProps => ({
    parseText: (text: string) => dispatch(actions.parseText(text)),
    startWordDiscovery: () => dispatch(actions.startWordDiscovery())
});

export default connect<IProps, IActionProps, IOwnProps>(mapStateToProps, mapDispatchToProps)(Board);
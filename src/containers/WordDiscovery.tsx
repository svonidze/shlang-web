import { Dispatch } from "redux";

import * as actions from '../actions';
import { IState as IAppState } from 'src/App';
import { connect } from "react-redux";
import { IProps, IActionProps, WordDiscovery } from "src/components/WordDiscovery";

const mapStateToProps = (state: IAppState, ownProps: IProps): IProps => ownProps;

const mapDispatchToProps = (dispatch: Dispatch<actions.WordAction>, ownProps: IProps): IActionProps => ({
    exit: () => dispatch(actions.stopWordDiscovery()),
    goNextWord: (index) => dispatch(actions.discoverNextWord(index)),
    markWordAsIncorect: () => dispatch(actions.markWordAsIncorect(ownProps.current.word)),
    markWordToRepeat: () => dispatch(actions.markWordToRepeat(ownProps.current.word)),
    toggleWordToLearn: () => dispatch(actions.toggleWordToLearn(ownProps.current.word)),
});

export default connect<{}, IActionProps, IProps>(mapStateToProps, mapDispatchToProps)(WordDiscovery);
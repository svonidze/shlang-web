import thunkMiddleware from 'redux-thunk'
import * as React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import './App.css';

import * as actions from './actions/';
import { word as wordReducer } from './reducers/index';
import { IOwnProps } from './components/Board';
import Board from './containers/Board';
import Settings from './containers/Settings';
import Header from './containers/Header';
import { IParsingResult } from './models/ParsingResult';
import { Translations, ITranslationOption } from './models/Translation';
import UserConfigurationLocalStorage from './services/UserConfigurationLocalStorage';

export interface IState extends IParsingResult, ITranslationOption {
  wordDiscoveryRunning?: boolean;
  currentWordIndex?: number;

  translations?: Translations;
}

/*
Use if need more than one reducer
 export interface ICombinedState {
  wordReducer: IState;
  notificationSystem?: any;
 }

const reducers = combineReducers<ICombinedState, AnyAction>({ wordReducer: wordReducer });

const store = createStore<ICombinedState, AnyAction, any, any>(
  reducers,
  {
    wordReducer: {
*/
const store = createStore<IState, actions.WordAction, any, any>(
  wordReducer,
  {
    words: [],
    langTo: (new UserConfigurationLocalStorage().get() || {}).preferedLangTo
  },
  applyMiddleware(thunkMiddleware));

const Main = () => (
  <Switch>
    <Route exact path='/' component={Home} />
    <Route exact path='/index.html' component={Home} />
    <Route exact path='/settings' component={Settings} />
  </Switch>
)
function Home(props: any) {
  const queryParams = props.location.search;
  let boardProps: IOwnProps = {};

  if (queryParams) {
    const query = new URLSearchParams(queryParams);
    boardProps.text = query.get('text') || undefined;
    boardProps.url = query.get('url') || undefined;
    console.log('Home query params', boardProps);
  }

  return (
    <div className="App-intro">
      <Board text={boardProps.text} url={boardProps.url} />
    </div>
  )
}

class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            <Header />
            <Main />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;

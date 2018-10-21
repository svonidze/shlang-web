import * as React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import './App.css';

import * as actions from './actions/';
import { word as wordReducer } from './reducers/index';
import { IState, IOwnProps } from './components/Board';
import Board from './containers/Board';
import Settings from './components/Settings';
import Header from './components/Header';

const store = createStore<IState, actions.WordAction, any, any>(wordReducer, {
  words: []
});

const Main = () => (
  <Switch>
    <Route exact path='/' component={Home} />
    <Route exact path='/index.html' component={Home} />
    <Route exact path='/settings' component={Settings} />
  </Switch>
)
function Home(props: any) {
  const queryParams = props!.location!.search;
  let boardProps: IOwnProps = {};

  if (queryParams) {
    const query = new URLSearchParams(props.location.search);
    boardProps.text = query.get('text') || undefined;
    boardProps.url = query.get('url') || undefined;
    console.log('Home query params', boardProps);
  }

  return (
    <div className="App-intro">
      <Provider store={store}>
        <Board text={boardProps.text} url={boardProps.url} />
      </Provider>
    </div>
  )
}

class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Header />
          <Main />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

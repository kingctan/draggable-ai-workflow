import React from 'react';
import ReactDOM from 'react-dom';
import { StoreContext } from 'redux-react-hook';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';

import './styles/style.styl';
import { Routes } from './routes';
import * as serviceWorker from './serviceWorker';
import configureStore from './redux/configureStore';

const store = configureStore();

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <LocaleProvider locale={zhCN}>
      <Routes />
    </LocaleProvider>
  </StoreContext.Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './util/http'
//import reportWebVitals from './reportWebVitals';
import { store } from './store/store'; // 引入配置好的 store
import { Provider } from 'react-redux'; // 引入 Redux 提供器
import {  HashRouter } from 'react-router-dom'; // 导入路由组件
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <HashRouter> {/* 添加路由根组件 */}
      <App />
      </HashRouter>

    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

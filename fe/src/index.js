import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import NotFound from "./components/NotFound"

// document.onreadystatechange = () => {
//     if (document.readyState === 'complete') {
//         ReactDOM.render(<App />, document.getElementById('root'));
//     } else {
//         ReactDOM.render(<NotFound />, document.getElementById('root'));
//     }
// }

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable spaced-comment */
//import './scss/main.scss';
import 'fmihel-polyfills';
import '@fortawesome/fontawesome-free/js/all';
//import 'bootstrap';
import { DOM } from 'fmihel-browser-lib';
import React from 'react';
import ReacDOM from 'react-dom';
import { Provider } from 'react-redux';
import redux from 'REDUX';
import App from './App.jsx';

$(() => {
    ReacDOM.render(<Provider store={redux.store}><App /></Provider>, DOM('#app'));
});

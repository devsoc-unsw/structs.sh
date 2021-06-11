import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';

// Root React component
import App from './App';

// Globally applied stylesheets
import 'assets/css/nucleo-icons.css';
import 'assets/demo/demo.css';
import 'assets/scss/global.scss';

ReactDOM.render(
    <React.StrictMode>

<BrowserRouter>
        <App />
</BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

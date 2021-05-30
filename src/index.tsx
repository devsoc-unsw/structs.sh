import React from 'react';
import ReactDOM from 'react-dom';

// Root React component
import App from './App';

// Globally applied stylesheets
import 'assets/css/nucleo-icons.css';
import 'assets/demo/demo.css';
import 'assets/scss/global.scss';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import HomePage from 'views/HomePage.jsx';
import Dashboard from 'views/Dashboard.jsx';

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/visualiser/:topic" render={Dashboard} />
                <Route path="/" render={HomePage} />
            </Switch>
        </BrowserRouter>
    );
};

export default App;

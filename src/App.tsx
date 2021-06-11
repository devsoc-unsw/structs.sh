import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import HomePage from 'views/HomePage.jsx';
import Dashboard from 'views/Dashboard.jsx';
import Page404 from 'views/Page404';

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                {/* Visualiser routes */}
                <Route exact path="/visualiser/:topic" render={Dashboard} />
                <Route exact path="/" render={HomePage} />
                {/* 404 page */}
                <Route component={Page404} />
            </Switch>
        </BrowserRouter>
    );
};

export default App;

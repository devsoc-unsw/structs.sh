import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from 'views/HomePage.jsx';
import Dashboard from 'views/Dashboard.jsx';
import Page404 from 'views/Page404';
import AboutUs from 'views/AboutUs';
import Feedback from 'views/Feedback';
import { AnimatePresence } from 'framer-motion';

const App = () => {
    const location = useLocation();
    return (
        <AnimatePresence>
            <Switch location={location}>
                {/* Visualiser routes */}
                <Route exact path="/visualiser/:topic" render={Dashboard} />
                <Route exact path="/" render={HomePage} />
                {/* About us page */}
                <Route exact path="/about" render={AboutUs} />
                {/* Feedback and feature request page */}
                <Route exact path="/feedback" render={Feedback} />
                {/* 404 page */}
                <Route component={Page404} />
            </Switch>
        </AnimatePresence>
    );
};

export default App;

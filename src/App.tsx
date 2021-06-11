import React from 'react';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';
import HomePage from 'views/HomePage.jsx';
import Dashboard from 'views/Dashboard.jsx';
import Page404 from 'views/Page404';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
    const location = useLocation();
    return (
            <AnimatePresence>
                <Switch location={location} >
                    {/* Visualiser routes */}
                    <Route exact path="/visualiser/:topic" render={Dashboard} />
                    <Route exact path="/" render={HomePage} />
                    {/* 404 page */}
                    <Route component={Page404} />
                </Switch>
            </AnimatePresence>
    );
};

export default App;

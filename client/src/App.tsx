import React, { createContext, useCallback, useEffect, useState } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from 'views/HomePage';
import Dashboard from 'views/Dashboard';
import Page404 from 'views/Page404';
import AboutUs from 'views/AboutUs';
import Feedback from 'views/Feedback';
import { AnimatePresence } from 'framer-motion';
import ContentManagementDashboard from 'views/ContentManagementDashboard';
import { Theme, ThemeProvider } from '@mui/material';
import './App.scss';
import { darkTheme, lightTheme } from './structsThemes';
import { useCookies } from 'react-cookie';

export const ThemeMutationContext = createContext({
    toggleDarkMode: () => alert('ASS'),
});

const DARK_MODE_ON = 'dark-mode-on';

const App = () => {
    const [cookies, setCookie] = useCookies([DARK_MODE_ON]);
    const [currTheme, setCurrTheme] = useState<Theme>(
        cookies[DARK_MODE_ON] === 'true' ? darkTheme : lightTheme
    );

    const toggleDarkMode = useCallback(() => {
        if (currTheme === darkTheme) {
            setCurrTheme(lightTheme);
            setCookie(DARK_MODE_ON, 'false');
        } else {
            setCurrTheme(darkTheme);
            setCookie(DARK_MODE_ON, 'true');
        }
    }, [currTheme]);

    const location = useLocation();
    return (
        <AnimatePresence>
            <ThemeProvider theme={currTheme}>
                <ThemeMutationContext.Provider
                    value={{
                        toggleDarkMode: toggleDarkMode,
                    }}
                >
                    <Switch location={location}>
                        {/* Homepage */}
                        <Route exact path="/" component={HomePage} />

                        {/* Visualiser routes */}
                        <Route exact path="/visualiser/:topic" component={Dashboard} />

                        {/* About us page */}
                        <Route exact path="/about" component={AboutUs} />

                        {/* Feedback and feature request page */}
                        <Route exact path="/feedback" component={Feedback} />

                        {/* Content management dashboard */}
                        <Route exact path="/content" component={ContentManagementDashboard} />

                        {/* 404 page */}
                        <Route component={Page404} />
                    </Switch>
                </ThemeMutationContext.Provider>
            </ThemeProvider>
        </AnimatePresence>
    );
};

export default App;

import { Theme, ThemeProvider } from '@mui/material';
import TopNavbar from 'components/Navbars/TopNavbar';
import { AnimatePresence } from 'framer-motion';
import React, { createContext, useCallback, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Route, Switch, useLocation } from 'react-router-dom';
import AboutUs from 'views/AboutUs';
import ContentManagementDashboard from 'views/ContentManagementDashboard';
import Feedback from 'views/Feedback';
import HomePage from 'views/HomePage';
import Page404 from 'views/Page404';
import VisualiserDashboard from 'views/VisualiserDashboard';
import './App.scss';
import { darkTheme, lightTheme } from './structsThemes';

export const ThemeMutationContext = createContext({
    toggleDarkMode: () => console.log('Dark mode toggling is not ready yet'),
    isDarkMode: false,
});

const LIGHT_MODE_ON = 'light-mode-on';

const App = () => {
    const [cookies, setCookie] = useCookies([LIGHT_MODE_ON]);
    const [currTheme, setCurrTheme] = useState<Theme>(
        cookies[LIGHT_MODE_ON] === 'true' ? lightTheme : darkTheme
    );

    const toggleDarkMode = useCallback(() => {
        if (currTheme === lightTheme) {
            setCurrTheme(darkTheme);
            setCookie(LIGHT_MODE_ON, 'false');
        } else {
            setCurrTheme(lightTheme);
            setCookie(LIGHT_MODE_ON, 'true');
        }
    }, [currTheme, setCookie]);

    const location = useLocation();
    return (
        <AnimatePresence>
            <ThemeProvider theme={currTheme}>
                <ThemeMutationContext.Provider
                    value={{
                        toggleDarkMode: toggleDarkMode,
                        isDarkMode: cookies[LIGHT_MODE_ON] === 'true',
                    }}
                >
                    <TopNavbar position={'fixed'} enableOnScrollEffect={true} />
                    <Switch location={location}>
                        {/* Homepage */}
                        <Route exact path="/" component={HomePage} />

                        {/* Visualiser routes */}
                        <Route exact path="/visualiser/:topic" component={VisualiserDashboard} />

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

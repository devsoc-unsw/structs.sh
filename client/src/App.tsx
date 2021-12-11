import { Theme, ThemeProvider } from '@mui/material';
import TopNavbar from 'components/Navbars/TopNavbar';
import { AnimatePresence } from 'framer-motion';
import React, { createContext, useCallback, useState } from 'react';
import { useCookies } from 'react-cookie';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import AboutUs from 'views/AboutUs';
import ContentManagementDashboard from 'views/ContentManagementDashboard';
import Feedback from 'views/Feedback';
import HomePage from 'views/HomePage';
import Page404 from 'views/Page404';
import VisualiserDashboard from 'views/VisualiserDashboard';
import './App.scss';
import { darkTheme, lightTheme } from 'structsThemes';
import { LIGHT_MODE_ON } from 'constants/cookies';

export const ThemeMutationContext = createContext({
    toggleDarkMode: () => console.log('Dark mode toggling is not ready yet'),
    isDarkMode: false,
});

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

    return (
        <AnimatePresence>
            <ThemeProvider theme={currTheme}>
                <ThemeMutationContext.Provider
                    value={{
                        toggleDarkMode: toggleDarkMode,
                        isDarkMode: cookies[LIGHT_MODE_ON] !== 'true',
                    }}
                >
                    <TopNavbar position={'fixed'} enableOnScrollEffect={true} />
                    <Routes>
                        {/* Homepage */}
                        <Route path="/" element={<HomePage />} />

                        {/* Visualiser routes */}
                        <Route path="/visualiser/:topic" element={<VisualiserDashboard />} />

                        {/* About us page */}
                        <Route path="/about" element={<AboutUs />} />

                        {/* Feedback and feature request page */}
                        <Route path="/feedback" element={<Feedback />} />

                        {/* Content management dashboard */}
                        <Route path="/content" element={<ContentManagementDashboard />} />

                        {/* 404 page */}
                        <Route element={<Page404 />} />
                    </Routes>
                </ThemeMutationContext.Provider>
            </ThemeProvider>
        </AnimatePresence>
    );
};

export default App;

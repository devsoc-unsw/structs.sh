import {useState, createContext, useContext, useEffect} from 'react';

type ThemeContextType = {
    darkMode: boolean;
    toggleDarkMode: () => void
};

export const ThemeContext = createContext<ThemeContextType>({
    darkMode: false,
    toggleDarkMode: () => {}   
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

    return (
        <ThemeContext.Provider value={{darkMode, toggleDarkMode}}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
import { useState, createContext, useContext, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

const getStoredTheme = (): boolean => {
  try {
    const stored = localStorage.getItem('darkMode');
    return stored ? JSON.parse(stored) : false;
  } catch (error) {
    console.warn('Error reading theme from localStorage:', error);
    return false;
  }
};

const setStoredTheme = (darkMode: boolean): void => {
  try {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  } catch (error) {
    console.warn('Error saving theme to localStorage:', error);
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialise state from localStorage
  const [darkMode, setDarkMode] = useState<boolean>(() => getStoredTheme());

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    setStoredTheme(darkMode);
  }, [darkMode]);

  const value = useMemo(() => ({ darkMode, toggleDarkMode }), [darkMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired as PropTypes.Validator<React.ReactNode>,
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context;
};

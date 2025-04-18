import { useState, createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const value = useMemo(() => {
    return { darkMode, toggleDarkMode };
  }, [darkMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired as PropTypes.Validator<React.ReactNode>,
};

export const useTheme = () => useContext(ThemeContext);

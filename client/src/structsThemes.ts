import { ThemeOptions } from '@mui/material';
import { createTheme } from '@mui/material/styles';

const baseOptions: ThemeOptions = {
  typography: {
    fontFamily: 'AtlassianText',
  },
  palette: {
    primary: {
      main: '#2E2054',
    },
    secondary: {
      main: '#916BBF',
    },
  },
};

const MUI_THEME_COLORS = {
  light: {
    background: '#ffffff',
    text: '#1C2024',
    button: '#2F265F',
    border: '#1C2024',
    secondary: '#757575'
  },
  dark: {
    background: '#1C2024',
    text: '#ffffff',
    button: '#6E56CF',
    border: '#ffffff',
    secondary: '#ffffff'
  }
};

export const structsTheme = createTheme({
  typography: {
    ...baseOptions.typography,
  },
  palette: {
    ...baseOptions.palette,
    background: {
      default: '#14113C',
      paper: '#14113C',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
  },
});

export const createDebuggerTheme = (darkMode: boolean) => {
  const colors = darkMode ? MUI_THEME_COLORS.dark : MUI_THEME_COLORS.light;
  
  return createTheme({
    typography: {
      ...baseOptions.typography,
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: colors.button,
      },
      secondary: {
        main: colors.secondary,
      },
      background: {
        default: colors.background,
        paper: colors.background,
      },
      text: {
        primary: colors.text,
        secondary: colors.secondary,
        disabled: darkMode 
          ? 'rgba(255, 255, 255, 0.5)' 
          : 'rgba(28, 32, 36, 0.5)',
      },
    },
  });
};
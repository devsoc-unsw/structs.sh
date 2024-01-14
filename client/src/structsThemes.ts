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
      primary: '#00000',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
  },
});

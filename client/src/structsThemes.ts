import { ThemeOptions } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

const baseOptions: ThemeOptions = {
    typography: {
        fontFamily: 'AtlassianText',
    },
    palette: {
        primary: {
            main: '#3C415C', // Note: `light`, `dark` and `contrastText` properties will be calculated from `main`
        },
        secondary: {
            main: '#916BBF',
        },
    },
};

export const darkTheme = createTheme({
    palette: {
        ...baseOptions.palette,
        background: {
            default: '#261C2C',
            paper: '#3E2C41',
        },
        text: {
            primary: '#FEFEFE',
            secondary: 'rgba(255, 255, 255, 0.7)',
            disabled: 'rgba(255, 255, 255, 0.5)',
        },
    },
    typography: {
        ...baseOptions.typography,
    },
});

export const lightTheme = createTheme({
    ...baseOptions,
    palette: {
        ...baseOptions.palette,
        background: {
            default: '#EEEEEE',
            paper: '#FDFAFF',
        },
    },
    typography: {
        ...baseOptions.typography,
    },
});

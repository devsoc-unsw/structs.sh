import React from 'react';
import Divider from '@mui/material/Divider';
import { Theme } from '@mui/material';
import { useTheme } from '@mui/system';
import { darkTheme } from 'structsThemes';

interface Props {}

const HorizontalRule: React.FC<Props> = ({}) => {
    const theme: Theme = useTheme();

    return <Divider sx={{ mt: 2, mb: 2, background: theme === darkTheme && 'white' }}></Divider>;
};

export default HorizontalRule;

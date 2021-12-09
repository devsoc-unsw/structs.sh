import { Box, Theme, useTheme } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';
import styles from './VisualiserController.module.scss';
import Controls from './Controls/Controls';

interface Props {
    terminalMode: boolean;
    setTerminalMode: Dispatch<SetStateAction<boolean>>;
}

const VisualiserController: React.FC<Props> = ({ terminalMode, setTerminalMode }) => {
    const theme: Theme = useTheme();

    return (
        <Box
            className={styles.container}
            sx={{ height: '64px', width: '100%', backgroundColor: theme.palette.background.paper }}
        >
            <Controls terminalMode={terminalMode} setTerminalMode={setTerminalMode} />
        </Box>
    );
};

export default VisualiserController;

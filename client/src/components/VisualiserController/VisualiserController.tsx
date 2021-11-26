import { Box, Theme, useTheme } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';
import ModeSwitch from './GUIMode/ModeSwitch';
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
            sx={{ height: '64px', backgroundColor: theme.palette.background.paper }}
        >
            <Controls />
            <ModeSwitch switchMode={terminalMode} setSwitchMode={setTerminalMode} />
        </Box>
    );
};

export default VisualiserController;

import { Box } from '@mui/material';
import { FC } from 'react';
import OperationsTree from './GUIOperations/OperationsTree';

interface Props {
    executeCommand: (command: string, args: string[]) => string;
    topicTitle: string;
}

const GUIMode: FC<Props> = ({ executeCommand, topicTitle }) => {
    return (
        <Box sx={{ height: 'calc(100% - 64px)', overflow: 'auto' }}>
            <OperationsTree topicTitle={topicTitle} executeCommand={executeCommand} />
        </Box>
    );
};

export default GUIMode;

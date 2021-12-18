import { Box } from '@mui/material';
import { FC } from 'react';
import { Topic } from 'utils/apiRequests';
import OperationsTree from './GUIOperations/OperationsTree';

interface Props {
    executeCommand: (command: string, args: string[]) => string;
    topic: Topic;
}

const GUIMode: FC<Props> = ({ executeCommand, topic }) => {
    return (
        <Box sx={{ height: 'calc(100% - 64px)', overflow: 'auto' }}>
            <OperationsTree topic={topic} executeCommand={executeCommand} />
        </Box>
    );
};

export default GUIMode;

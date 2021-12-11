import OperationsTree from './GUIOperations/OperationsTree';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { Topic } from 'utils/apiRequests';

interface Props {
    executeCommand: (command: string, args: string[]) => string;
    topic: Topic;
}

const GUIMode = ({ executeCommand, topic }) => {
    return (
        <Box>
            <OperationsTree topic={topic} executeCommand={executeCommand} />
        </Box>
    );
};

export default GUIMode;

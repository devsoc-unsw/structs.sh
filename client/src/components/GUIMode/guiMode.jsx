import Operations from '../Operations/operations';
import { useParams } from 'react-router-dom';

const GUIMode = ({ executeCommand }) => {
    const { topic } = useParams();

    return (
        <div>
            <Operations topic={topic} executeCommand={executeCommand} />
        </div>
    );
};

export default GUIMode;

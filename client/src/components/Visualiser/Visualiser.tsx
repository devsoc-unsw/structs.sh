import React from 'react';
import { Pane } from 'components/Panes';
import VisualiserCanvas from './VisualiserCanvas';
import VisualiserManager from './VisualiserManager';
import { Topic } from 'utils/apiRequests';

interface Props {
    topic: Topic;
}

const Visualiser: React.FC<Props> = ({ topic }) => {
    return (
        <Pane orientation="horizontal" minSize={150.9}>
            <VisualiserCanvas />
            <VisualiserManager topic={topic} />
        </Pane>
    );
};

export default Visualiser;

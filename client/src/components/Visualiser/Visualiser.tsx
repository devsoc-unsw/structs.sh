import React from 'react';
import { Pane } from 'components/Panes';
import VisualiserCanvas from './VisualiserCanvas';
import VisualiserManager from './VisualiserManager';
import { Topic } from 'utils/apiRequests';
import { CircularLoader } from 'components/Loader';

interface Props {
    topicTitle: string;
}

const Visualiser: React.FC<Props> = ({ topicTitle }) => {
    return topicTitle ? (
        <Pane orientation="horizontal" minSize={150.9}>
            <VisualiserCanvas topicTitle={topicTitle} />
            <VisualiserManager topicTitle={topicTitle} />
        </Pane>
    ) : (
        <CircularLoader />
    );
};

export default Visualiser;

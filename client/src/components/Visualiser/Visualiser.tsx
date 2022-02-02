import { CircularLoader } from 'components/Loader';
import { Pane } from 'components/Panes';
import React from 'react';
import VisualiserCanvas from './VisualiserCanvas';
import VisualiserManager from './VisualiserManager';

interface Props {
  topicTitle: string;
}

const Visualiser: React.FC<Props> = ({ topicTitle }) => (topicTitle ? (
  <Pane orientation="horizontal" minSize={150.9}>
    <VisualiserCanvas topicTitle={topicTitle} />
    <VisualiserManager topicTitle={topicTitle} />
  </Pane>
) : (
  <CircularLoader />
));

export default Visualiser;

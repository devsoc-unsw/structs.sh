import { CircularLoader } from 'components/Loader';
import { Pane } from 'components/Panes';
import React from 'react';
import { DataStructure } from 'visualiser-src/common/typedefs';
import VisualiserCanvas from './VisualiserCanvas';
import VisualiserInterface from './VisualiserInterface';

interface VisualiserProps {
  topicTitle: DataStructure;
}

/**
 * The root visualiser component, which contains:
 * 1. The canvas component that the visualiser is rendered to
 * 2. The UI for manipulating the visualiser. This includes the terminal, the
 *    GUI form, the play/pause buttons and sliders, etc.
 *
 * Given the `topicTitle`, this component will render the corresponding
 * visualiser and load up the commands for that visualiser.
 */
const Visualiser: React.FC<VisualiserProps> = ({ topicTitle }) =>
  topicTitle ? (
    <Pane orientation="horizontal" minSize={150.9}>
      <VisualiserCanvas />
      <VisualiserInterface topicTitle={topicTitle} />
    </Pane>
  ) : (
    <CircularLoader />
  );

export default Visualiser;

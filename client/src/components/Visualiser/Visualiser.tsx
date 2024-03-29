import { FC } from 'react';
import { CircularLoader } from 'components/Loader';
import VisualiserCanvas from './VisualiserCanvas';
import VisualiserInterface from './VisualiserInterface/VisualiserInterface';

interface VisualiserProps {
  topicTitle: string;
  data: number[];
}

/**
 * The root visualiser component, which contains:
 * 1. The canvas component that the visualiser is rendered to
 * 2. The User Interface for manipulating the visualiser. This includes the
 *    GUI for performing operations, the play/pause buttons and sliders, etc.
 *
 * Given the `topicTitle`, this component will render the corresponding
 * visualiser and load up the commands for that visualiser.
 */
const Visualiser: FC<VisualiserProps> = ({ topicTitle, data }) =>
  topicTitle ? (
    <>
      <VisualiserCanvas />
      <VisualiserInterface topicTitle={topicTitle} data={data} />
    </>
  ) : (
    <CircularLoader />
  );

export default Visualiser;

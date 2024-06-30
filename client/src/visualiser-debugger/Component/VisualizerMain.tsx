import { useRef } from 'react';
import { useGlobalStore } from '../Store/globalStateStore';
import { useFrontendStateStore } from '../Store/frontendStateStore';

const VisualizerMain: React.FC = () => {
  const { visComponent: VisComponent } = useGlobalStore().visualizer;
  const currFrontendState = useFrontendStateStore((store) => {
    return store.currState().frontendState;
  });

  const visualizerRef = useRef(null);
  const { uiState } = useGlobalStore();

  return (
    <div
      className="visualizer"
      ref={visualizerRef}
      style={{ overflow: 'hidden', height: '100%', width: '100%' }}
    >
      <VisComponent graphState={currFrontendState} dimension={uiState.visualizerDimension} />
    </div>
  );
};

export default VisualizerMain;

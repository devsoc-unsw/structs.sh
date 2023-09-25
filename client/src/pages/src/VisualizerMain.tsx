import { useEffect, useRef } from 'react';
import { BackendState } from './visualizer-component/types/backendType';
import { useFrontendStateStore } from './visualizer-component/visualizerStateStore';
import { useGlobalStore } from './visualizer-component/globalStateStore';

export interface RoutesProps {
  backendState: BackendState;
}

// Future support different parser
const VisualizerMain: React.FC<RoutesProps> = ({ backendState }: RoutesProps) => {
  const { userAnnotation, parser, visComponent: VisComponent } = useGlobalStore().visualizer;
  const currState = useFrontendStateStore((store) => {
    return store.currState();
  });

  useEffect(() => {
    if (backendState && userAnnotation) {
      const newParsedState = parser.parseInitialState(backendState, userAnnotation);
      useFrontendStateStore.getState().updateNextState(newParsedState);
    } else {
      let issue = 'something';
      if (!backendState) {
        issue = 'backendState';
      } else if (!userAnnotation) {
        issue = 'localsAnnotations';
      }

      console.error(`Unable to parse backend state: ${issue} is undefined`);
    }
  }, [backendState]);

  const visualizerRef = useRef(null);
  const { uiState } = useGlobalStore();
  return (
    <div className="visualizer" ref={visualizerRef} style={{ overflow: 'hidden' }}>
      <VisComponent graphState={currState} dimension={uiState} />
    </div>
  );
};

export default VisualizerMain;

import { useEffect, useRef } from 'react';
import { useGlobalStore } from '../Store/globalStateStore';
import { useFrontendStateStore } from '../Store/frontendStateStore';
import { BackendState, isInitialBackendState } from '../Types/backendType';

export interface RoutesProps {
  backendState: BackendState;
}

const VisualizerMain: React.FC<RoutesProps> = ({ backendState }: RoutesProps) => {
  const { userAnnotation, parser, visComponent: VisComponent } = useGlobalStore().visualizer;
  const currState = useFrontendStateStore((store) => {
    return store.currState();
  });

  useEffect(() => {
    if (backendState && !isInitialBackendState(backendState) && userAnnotation) {
      const newParsedState = parser.parseState(backendState, userAnnotation);
      useFrontendStateStore.getState().appendFrontendNewState(backendState, newParsedState);
    } else {
      let issue = 'something';
      if (!backendState) {
        issue = 'backendState';
      } else if (!userAnnotation) {
        issue = 'localsAnnotations';
      }
      console.error(`Unable to parse backend state: ${issue} is undefined`);
    }
  }, [backendState, userAnnotation]);

  const visualizerRef = useRef(null);
  const { uiState } = useGlobalStore();
  return (
    <div
      className="visualizer"
      ref={visualizerRef}
      style={{ overflow: 'hidden', height: '100%', width: '100%' }}
    >
      <VisComponent graphState={currState} dimension={uiState.visualizerDimension} />
    </div>
  );
};

export default VisualizerMain;

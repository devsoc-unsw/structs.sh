import { useEffect, useRef } from 'react';
import { useGlobalStore } from '../Store/globalStateStore';
import { useFrontendStateStore } from '../Store/frontendStateStore';
import { isInitialBackendState } from '../Types/backendType';

const VisualizerMain: React.FC = () => {
  const { currFrame } = useGlobalStore();
  const { userAnnotation, parser, visComponent: VisComponent } = useGlobalStore().visualizer;
  const currFrontendState = useFrontendStateStore((store) => {
    return store.currState().frontendState;
  });

  useEffect(() => {
    if (currFrame && !isInitialBackendState(currFrame) && userAnnotation) {
      const newParsedState = parser.parseState(currFrame, userAnnotation);
      useFrontendStateStore.getState().appendFrontendNewState(currFrame, newParsedState);
    } else {
      let issue = 'something';
      if (!currFrame) {
        issue = 'backendState';
      } else if (!userAnnotation) {
        issue = 'localsAnnotations';
      }
      console.error(`Unable to parse backend state: ${issue} is undefined`);
    }
  }, [currFrame, userAnnotation]);

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

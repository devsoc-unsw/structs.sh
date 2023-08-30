import { useEffect, useRef, useState } from 'react';
import { DEFAULT_UISTATE, UiState } from './visualizer-component/types/uiState';
import { parserFactory } from './visualizer-component/parser/parserFactory';
import { visualizerFactory } from './visualizer-component/visulizer/visualizerFactory';
import { BackendState } from './visualizer-component/types/backendType';
import { Timeline } from './visualizer-component/util/timeline';
import { Debugger } from './visualizer-component/util/debugger';
import { useFrontendStateStore } from './visualizer-component/stateManager';

export interface RoutesProps {
  backendState: BackendState;
  getNextState: () => void;
}

// Future support different parser
const VisualizerMain: React.FC<RoutesProps> = ({ backendState, getNextState }) => {
  const [settings, setSettings] = useState<UiState>(DEFAULT_UISTATE);
  const VisComponent = visualizerFactory(settings);
  const [parser] = useState(parserFactory(settings));

  const currState = useFrontendStateStore((store) => {
    return store.currState();
  });

  useEffect(() => {
    const newParsedState = parser.parseInitialState(backendState, undefined);
    useFrontendStateStore.getState().updateNextState(newParsedState);
  }, [backendState]);

  const visualizerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (!visualizerRef) return;

      entries.forEach((element) => {
        if (element.target instanceof HTMLElement && element.target.className === 'visualizer') {
          const { width, height } = element.contentRect;

          if (dimensions.height === 0) {
            setDimensions({ width, height });
          }
        }
      });
    });

    if (visualizerRef.current) {
      observer.observe(visualizerRef.current);
    }
    return () => {
      if (visualizerRef.current) {
        observer.unobserve(visualizerRef.current);
      }
    };
  }, [visualizerRef]);

  return (
    <div className="container">
      <div className="linked-list">
        <div className="visualizer" ref={visualizerRef}>
          <VisComponent
            settings={settings}
            graphState={currState}
            setSettings={setSettings}
            dimensions={dimensions}
          />
        </div>
        <div className="timeline">
          <Timeline
            nextState={getNextState}
            forwardState={() => {
              useFrontendStateStore.getState().forwardState();
              console.log('Forward triggered', useFrontendStateStore.getState().currStateIdx);
            }}
            backwardState={() => {
              useFrontendStateStore.getState().backwardState();
              console.log('Forward triggered', useFrontendStateStore.getState().currStateIdx);
            }}
          />
        </div>
        <div className="debugger">
          {settings.debug && <Debugger src={currState} />}
        </div>
      </div>
    </div>
  );
};

export default VisualizerMain;

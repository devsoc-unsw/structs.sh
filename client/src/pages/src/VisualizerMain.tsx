import { useEffect, useRef, useState } from 'react';
import { DEFAULT_UISTATE, UiState } from './visualizer-component/types/uiState';
import { parserFactory } from './visualizer-component/parser/parserFactory';
import { visualizerFactory } from './visualizer-component/visulizer/visualizerFactory';
import { BackendState } from './visualizer-component/types/backendType';
import { Timeline } from './visualizer-component/util/timeline';
import { Debugger } from './visualizer-component/util/debugger';
import { useFrontendStateStore } from './visualizer-component/stateManager';
import {
  DataStructureAnnotation,
  LinkedListAnnotation,
  LocalsAnnotations,
} from './visualizer-component/types/annotationType';

export interface RoutesProps {
  backendState: BackendState;
  getNextState: () => void;
  getDummyNextState: () => void;
  dataStructureAnnotation: DataStructureAnnotation;
}

// Future support different parser
const VisualizerMain: React.FC<RoutesProps> = ({
  backendState,
  getDummyNextState,
  getNextState,
  dataStructureAnnotation,
}: RoutesProps) => {
  const [settings, setSettings] = useState<UiState>(DEFAULT_UISTATE);
  const VisComponent = visualizerFactory(settings);
  const [parser] = useState(parserFactory(settings));

  const currState = useFrontendStateStore((store) => {
    return store.currState();
  });

  useEffect(() => {
    // Assume user have a variable called curr
    const localsAnnotations: LocalsAnnotations = {
      curr: {
        typeName: 'struct node*',
      },
    };
    // === Dummy linked list node annotation
    // const dataStructureAnnotation: LinkedListAnnotation = {
    //   typeName: 'struct node', // Name for the user's linked list struct
    //   value: {
    //     name: 'data', // Name for the user's linked list "value" field
    //     typeName: 'int',
    //   },
    //   next: {
    //     name: 'next', // Name for the user's linked list "next" field
    //     typeName: 'struct node*',
    //   },
    // };
    console.log(dataStructureAnnotation);
    if (backendState && localsAnnotations && dataStructureAnnotation) {
      const newParsedState = parser.parseInitialState(
        backendState,
        localsAnnotations,
        dataStructureAnnotation,
        settings
      );
      useFrontendStateStore.getState().updateNextState(newParsedState);
    } else {
      let issue = 'something';
      if (backendState === undefined) {
        issue = 'backendState';
      } else if (localsAnnotations === undefined) {
        issue = 'localsAnnotations';
      } else if (dataStructureAnnotation === undefined) {
        issue = 'dataStructureAnnotation';
      }

      console.error(`Unable to parse backend state: ${issue} is undefined`);
    }
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
            dimensions.height = height;
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
        <div className="visualizer" ref={visualizerRef} style={{ overflow: 'hidden' }}>
          <VisComponent
            settings={settings}
            graphState={currState}
            setSettings={setSettings}
            dimensions={dimensions}
          />
        </div>
        <div className="timeline">
          <Timeline
            nextStateDummy={getDummyNextState}
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
        <div className="debugger">{settings.debug && <Debugger src={currState} />}</div>
      </div>
    </div>
  );
};

export default VisualizerMain;

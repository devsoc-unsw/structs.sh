import { useEffect, useRef, useState } from 'react';
import { DEFAULT_UISTATE, UiState } from './visualizer-component/types/uiState';
import { parserFactory } from './visualizer-component/parser/parserFactory';
import { visualizerFactory } from './visualizer-component/visulizer/visualizerFactory';
import { BackendState } from './visualizer-component/types/backendType';
import { useFrontendStateStore } from './visualizer-component/visaulizerStateStore';
import { LocalAnnotationBase, UserAnnotation } from './visualizer-component/types/annotationType';
import { useUiStateStore } from './visualizer-component/uiStateStore';

export interface RoutesProps {
  backendState: BackendState;
  getNextState: () => void;
  getDummyNextState: () => void;
}

// Future support different parser
const VisualizerMain: React.FC<RoutesProps> = ({ backendState }: RoutesProps) => {
  const [settings, setSettings] = useState<UiState>(DEFAULT_UISTATE);
  const VisComponent = visualizerFactory(settings);
  const [parser] = useState(parserFactory(settings));
  const { userAnnotation } = useUiStateStore();

  const currState = useFrontendStateStore((store) => {
    return store.currState();
  });

  useEffect(() => {
    // === Dummy linked list node annotation
    // const userAnnotation: LinkedListAnnotation = {
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
    if (backendState && userAnnotation) {
      const newParsedState = parser.parseInitialState(backendState, userAnnotation, settings);
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
  const [dimensions, setDimensions] = useState({ width: settings.width, height: settings.height });

  // useEffect(() => {
  //   const observer = new ResizeObserver((entries) => {
  //     if (!visualizerRef) return;
  //
  //     entries.forEach((element) => {
  //       if (element.target instanceof HTMLElement && element.target.className === 'visualizer') {
  //         const { width, height } = element.contentRect;
  //
  //         if (dimensions.height === 0) {
  //           setDimensions({ width, height });
  //           dimensions.height = height;
  //         }
  //       }
  //     });
  //   });
  //
  //   if (visualizerRef.current) {
  //     observer.observe(visualizerRef.current);
  //   }
  //   return () => {
  //     if (visualizerRef.current) {
  //       observer.unobserve(visualizerRef.current);
  //     }
  //   };
  // }, [visualizerRef]);

  return (
    <div className="visualizer" ref={visualizerRef} style={{ overflow: 'hidden' }}>
      <VisComponent
        settings={settings}
        graphState={currState}
        setSettings={setSettings}
        dimensions={dimensions}
      />
    </div>
  );
};

export default VisualizerMain;

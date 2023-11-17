import { useEffect, useRef, useState } from 'react';
import { NodeEntity } from 'pages/Types/entity/nodeEntity';
import { useGlobalStore } from '../Store/globalStateStore';

// Future support different parser
const VisualizerMain: React.FC = () => {
  const { userAnnotation, visComponent: VisComponent } = useGlobalStore().visualizer;
  const currGraphState = useGlobalStore().currVisualiserState().graphState;

  const [flagViewed, setFlagViewed] = useState(false);

  useEffect(() => {
    // if (backendStateHistory[currState] && userAnnotation) {
    //   const newParsedState = parser.parseState(backendStateHistory[currState], userAnnotation);
    //   useFrontendStateStore.getState().updateNextState(newParsedState);
    // } else {
    //   let issue = 'something';
    //   if (!backendStateHistory[currState]) {
    //     issue = 'backendState';
    //   } else if (!userAnnotation) {
    //     issue = 'localsAnnotations';
    //   }
    //   console.error(`Unable to parse backend state: ${issue} is undefined`);
    // }

    const isDev = () => {
      // TODO: DEBUG THIS
      if (!currGraphState) return false;
      if (currGraphState.nodes.length !== 3) {
        return false;
      }

      const first = currGraphState.nodes.find((node: NodeEntity) => node.title === 'd');
      if (!first || first.edges.length === 0) {
        return false;
      }

      const second = currGraphState.nodes.find(
        (node: NodeEntity) => node.uid === first.edges[0].split('-')[1]
      );
      if (second.title !== 'e' || second.edges.length === 0) {
        return false;
      }

      const third = currGraphState.nodes.find(
        (node: NodeEntity) => node.uid === second.edges[0].split('-')[1]
      );

      return third.title === 'v';
    };

    if (isDev() && !flagViewed) {
      alert(
        `Olli has now made it to the fair and is contemplating joining structs, here's the flag: ${
          import.meta.env.VITE_CTF_FLAG
        }`
      );
      setFlagViewed(true);
    }
  }, [currGraphState, userAnnotation]);

  const visualizerRef = useRef(null);
  const { uiState } = useGlobalStore();
  return (
    <div
      className="visualizer"
      ref={visualizerRef}
      style={{ overflow: 'hidden', height: '100%', width: '100%' }}
    >
      <VisComponent graphState={currGraphState} dimension={uiState} />
    </div>
  );
};

export default VisualizerMain;

import { useEffect, useRef } from 'react';
import { useGlobalStore } from '../Store/globalStateStore';
import { useFrontendStateStore } from '../Store/visualizerStateStore';
import { BackendState } from '../Types/backendType';
import { NodeEntity } from 'pages/Types/entity/nodeEntity';

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

    const isOlli = () => {
      if (currState.nodes.length !== 4) {
        return false;
      }

      const first = currState.nodes.find((node: NodeEntity) => node.title === 'o');
      if (!first || first.edges.length === 0) {
        return false;
      }

      const second = currState.nodes.find(
        (node: NodeEntity) => node.uid === first.edges[0].split('-')[1]
      );
      if (second.title !== 'l' || second.edges.length === 0) {
        return false;
      }

      const third = currState.nodes.find(
        (node: NodeEntity) => node.uid === second.edges[0].split('-')[1]
      );
      if (third.title !== 'l' || third.edges.length === 0) {
        return false;
      }

      const fourth = currState.nodes.find(
        (node: NodeEntity) => node.uid === third.edges[0].split('-')[1]
      );

      return fourth.title === 'i';
    };

    if (isOlli()) {
      alert(
        `Olli has now made it to the fair and is contemplating joining structs, here's the flag: ${
          import.meta.env.VITE_CTF_FLAG
        }`
      );
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

import { useEffect, useRef, useState } from 'react';
import { NodeEntity } from 'visualiser-debugger/Component/Visualizer/Entities/BaseEntity/nodeEntity';
import { useGlobalStore } from '../Store/globalStateStore';
import { useFrontendStateStore } from '../Store/visualizerStateStore';
import { BackendState } from '../Types/backendType';

export interface RoutesProps {
  backendState: BackendState;
}

const VisualizerMain: React.FC<RoutesProps> = ({ backendState }: RoutesProps) => {
  const { userAnnotation, parser, visComponent: VisComponent } = useGlobalStore().visualizer;
  const currState = useFrontendStateStore((store) => {
    return store.currState();
  });

  // TODO:I believe CTF code is ready to removed, a good onboarding task
  const [flagViewed, setFlagViewed] = useState(false);

  useEffect(() => {
    if (backendState && userAnnotation) {
      const newParsedState = parser.parseState(backendState, userAnnotation);
      useFrontendStateStore.getState().newState(newParsedState);
    } else {
      let issue = 'something';
      if (!backendState) {
        issue = 'backendState';
      } else if (!userAnnotation) {
        issue = 'localsAnnotations';
      }
      console.error(`Unable to parse backend state: ${issue} is undefined`);
    }

    const isDev = () => {
      // TODO: DEBUG THIS
      if (!currState) return false;
      if (currState.nodes.length !== 3) {
        return false;
      }

      const first = currState.nodes.find((node: NodeEntity) => node.label === 'd');
      if (!first || first.edgeUids.length === 0) {
        return false;
      }

      const second = currState.nodes.find(
        (node: NodeEntity) => node.uid === first.edgeUids[0].split('-')[1]
      );
      if (second.label !== 'e' || second.edgeUids.length === 0) {
        return false;
      }

      const third = currState.nodes.find(
        (node: NodeEntity) => node.uid === second.edgeUids[0].split('-')[1]
      );

      return third.label === 'v';
    };

    if (isDev() && !flagViewed) {
      alert(
        `Olli has now made it to the fair and is contemplating joining structs, here's the flag: ${
          import.meta.env.VITE_CTF_FLAG
        }`
      );
      setFlagViewed(true);
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
      <VisComponent graphState={currState} dimension={uiState} />
    </div>
  );
};

export default VisualizerMain;

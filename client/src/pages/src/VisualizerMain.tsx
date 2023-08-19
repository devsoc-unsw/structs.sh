import { useEffect, useState } from 'react';
import { StateManager } from './visualizer-component/stateManager';
import { DEFAULT_UISTATE, UiState } from './visualizer-component/types/uiState';
import { BackendState, GenericGraph, INITIAL_GRAPH } from './visualizer-component/types/graphState';
import { parserFactory } from './visualizer-component/parser/parserFactory';
import { visualizerFactory } from './visualizer-component/visulizer/visualizerFactory';
import { recursiveUpdate } from './visualizer-component/util/util';

export interface RoutesProps {
  backendState: BackendState;
  getNextState: () => void;
}

// Future support different parser
const VisualizerMain: React.FC<RoutesProps> = ({ backendState, getNextState }) => {
  const [settings, setSettings] = useState<UiState>(DEFAULT_UISTATE);
  const visComponent = visualizerFactory(settings);
  const [parser] = useState(parserFactory(settings));
  const [frontend, setFrontend] = useState<GenericGraph>(INITIAL_GRAPH);

  const handleButtonClick = () => {
    getNextState();
  };

  useEffect(() => {
    const newParsedState = parser.parseInitialState(backendState, undefined);
    recursiveUpdate(frontend, newParsedState);
    setFrontend((prev) => ({ ...prev }));
  }, [backendState]);

  return (
    <StateManager
      settings={settings}
      setSettings={setSettings}
      state={frontend}
      Visualizer={visComponent}
      nextState={handleButtonClick}
    />
  );
};

export default VisualizerMain;

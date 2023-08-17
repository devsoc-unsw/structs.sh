import { useEffect, useState } from 'react';
import { StateManager } from './visualizer-component/stateManager';
import { IMAGINARY_STATES } from './visualizer-component/util/imaginaryState';
import { DEFAULT_UISTATE, UiState } from './visualizer-component/types/uiState';
import { BackendState } from './visualizer-component/types/graphState';
import { parserFactory } from './visualizer-component/parser/parserFactory';

export interface RoutesProps {
  backendState: BackendState;
  getNextState: () => void;
}

// Future support different parser
const VisualizerMain: React.FC<RoutesProps> = ({ backendState, getNextState }) => {
  const [framerNodes, setFramerNodes] = useState(IMAGINARY_STATES[0]);
  const [settings, setSettings] = useState<UiState>(DEFAULT_UISTATE);

  const handleButtonClick = () => {
    getNextState();
  };

  useEffect(() => {
    console.log('Backend state changes', backendState);
    const parser = parserFactory(settings);

    const frontendState = parser.parseInitialState(backendState, undefined);
    console.log('Parser', frontendState);
  }, [backendState]);

  return (
    <StateManager
      settings={settings}
      setSettings={setSettings}
      state={framerNodes}
      nextState={handleButtonClick}
    />
  );
};

export default VisualizerMain;

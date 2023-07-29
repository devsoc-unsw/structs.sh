import React, { useState, useEffect } from 'react';
import { StateManager } from './visualizer-component/stateManager';
import { IMAGINARY_STATES } from './visualizer-component/util/imaginaryState';
import { DEFAULT_UISTATE, UiState } from './visualizer-component/types/uiState';

export interface RoutesProps {
  onGetBreakPoint: (breakPoint: number) => void;
}

const VisualizerMain: React.FC<RoutesProps> = ({onGetBreakPoint}) => {
  const [framerNodes, setFramerNodes] = useState(IMAGINARY_STATES[0]);
  const [settings, setSettings] = useState<UiState>(DEFAULT_UISTATE);

  let idx = 0;
  const handleButtonClick = () => {
    idx += 1;
    onGetBreakPoint(idx);
    setFramerNodes(IMAGINARY_STATES[idx]);
  };

  return <StateManager settings={settings} setSettings={setSettings} state={framerNodes} nextState={handleButtonClick} />;
};

export default VisualizerMain;

import React, { useState, useEffect } from 'react';
import { StateManager } from './visualizer-component/stateManager';
import { BackendLinkedList } from './visualizer-component/types/graphState';
import { IMAGINARY_STATE_1 } from './visualizer-component/util/imaginaryState';
import { DEFAULT_UISTATE, UiState } from './visualizer-component/types/uiState';

export interface RoutesProps {
  onGetBreakPoint: (breakPoint: number) => void;
}

const RoutesComponent: React.FC<RoutesProps> = ({onGetBreakPoint}) => {
  const [framerNodes, setFramerNodes] = useState(IMAGINARY_STATE_1);
  const [settings, setSettings] = useState<UiState>(DEFAULT_UISTATE);

  let idx = 0;
  const handleButtonClick = () => {
    idx += 1;
    onGetBreakPoint(idx);
    setFramerNodes(IMAGINARY_STATE_1);
  };

  return <StateManager settings={settings} setSettings={setSettings} state={framerNodes} nextState={handleButtonClick} />;
};

export default RoutesComponent;

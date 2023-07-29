import React, { useState, useEffect } from 'react';
import { StateManager } from './framer-component/stateManager';
import { BackendLinkedList } from './framer-component/types/graphState';
import { IMAGINARY_STATE_1 } from './framer-component/util/imaginaryState';
import { DEFAULT_UISTATE, UiState } from './framer-component/types/uiState';

const RoutesComponent = () => {
  const [framerNodes, setFramerNodes] = useState(IMAGINARY_STATE_1);
  const [settings, setSettings] = useState<UiState>(DEFAULT_UISTATE);

  let idx = 0;
  const handleButtonClick = () => {
    idx += 1;
    setFramerNodes(IMAGINARY_STATE_1);
  };

  return <StateManager settings={settings} setSettings={setSettings} state={framerNodes} nextState={handleButtonClick} />;
};

export default RoutesComponent;

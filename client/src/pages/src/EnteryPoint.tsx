import React, { useState, useEffect } from 'react';
import { DrawingMotions } from './framer-component/stateManager';
import { BackendLinkedList } from './framer-component/types/graphState';
import { IMAGINARY_STATE_1 } from './framer-component/util/imaginaryState';

const RoutesComponent = () => {
  const [framerNodes, setFramerNodes] = useState(IMAGINARY_STATE_1);

  let idx = 0;
  const handleButtonClick = () => {
    // logic to update framerNodes
    idx += 1;
    setFramerNodes(IMAGINARY_STATE_1);
  };

  return <DrawingMotions state={framerNodes} nextState={handleButtonClick} />;
};

export default RoutesComponent;

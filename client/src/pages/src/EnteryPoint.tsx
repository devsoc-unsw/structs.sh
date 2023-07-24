import { useState, useEffect } from 'react';
import { DrawingMotions } from './framer-component/drawingMotion';
import { BackendLinkedList } from './framer-component/types/graphState';
import { IMAGINARY_STATE_1 } from './imaginaryState';

const initialBackendState: BackendLinkedList = {
  nodes: [
    {
      nodeId: '0x000001',
      value: 'Node 1',
      next: '0x000002',
    },
    {
      nodeId: '0x000002',
      value: 'Node 2',
      next: '0x000003',
    },
    {
      nodeId: '0x000003',
      value: 'Node 3',
      next: '0x000004',
    },
    {
      nodeId: '0x000004',
      value: 'Node 4',
      next: null,
    },
  ],
};

const states: BackendLinkedList[] = [
  {
    nodes: [
      {
        nodeId: '0x000001',
        value: 'Node 1',
        next: '0x000002',
      },
      {
        nodeId: '0x000002',
        value: 'Node 2',
        next: '0x000003',
      },
      {
        nodeId: '0x000003',
        value: 'Node 3',
        next: '0x000004',
      },
      {
        nodeId: '0x000004',
        value: 'Node 4',
        next: null,
      },
    ],
  },
  {
    nodes: [
      {
        nodeId: '0x000001',
        value: 'Node 1',
        next: '0x000002',
      },
      {
        nodeId: '0x000002',
        value: 'Node 2',
        next: '0x000003',
      },
      {
        nodeId: '0x000003',
        value: 'Node 3',
        next: '0x000004',
      },
      {
        nodeId: '0x000004',
        value: 'Node 4',
        next: null,
      },
    ],
  },
];

const RoutesComponent = () => {
  const [framerNodes, setFramerNodes] = useState(initialBackendState);

  let idx = 0;
  const handleButtonClick = () => {
    // logic to update framerNodes
    idx += 1;
    setFramerNodes(IMAGINARY_STATE_1[idx]);
  };

  return <DrawingMotions state={framerNodes} nextState={handleButtonClick} />;
};

export default RoutesComponent;

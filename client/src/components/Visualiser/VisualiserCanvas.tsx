import React from 'react';
import curr from 'visualiser-src/linked-list-visualiser/assets/curr.svg';
import prev from 'visualiser-src/linked-list-visualiser/assets/prev.svg';

interface Props {
  topicTitle: string;
}

/* -------------------------------------------------------------------------- */
/*                        Visualiser-Specific Canvases                        */
/* -------------------------------------------------------------------------- */

// Linked list visualiser canvas
const LinkedListCanvas: React.FC = () => (
  <header
    style={{
      height: '100%',
      padding: '10px',
      background: 'rgba(235, 235, 235)',
    }}
  >
    <svg className="container" id="canvas">
      <image opacity="0" id="current" href={curr} />
      <image opacity="0" id="prev" href={prev} />
    </svg>
  </header>
);

// Binary search tree canvas
const BSTCanvas: React.FC = () => (
  <div
    id="bst-canvas"
    style={{ height: '100%', width: '100%', background: 'rgba(235, 235, 235)' }}
  />
);

/**
 * The React component that renders the DOM elements that the visualiser
 * attaches itself to. Each visualiser may have a different canvas that it
 * needs.
 */
const VisualiserCanvas: React.FC<Props> = ({ topicTitle }) => {
  switch (topicTitle) {
    case 'Linked Lists':
      return <LinkedListCanvas />;
    case 'Binary Search Trees':
      return <BSTCanvas />;
    default:
      return null;
  }
};

export default VisualiserCanvas;

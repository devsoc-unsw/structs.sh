// HoverContent.tsx
import React from 'react';
import { motion } from 'framer-motion';

type HoverContentProps = {
  isVisible: boolean;
  obj: any;
  size: number;
};

const HoverContent: React.FC<HoverContentProps> = ({ isVisible, obj, size }) => {
  if (!isVisible) return null;

  return (
    <motion.foreignObject width={250} height={350} x={size - 50} y={80} style={{ zIndex: 1000 }}>
      <div
        style={{
          backgroundColor: 'white',
          color: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '250px',
          padding: '10px',
          overflow: 'auto',
          boxSizing: 'border-box',
          border: '2px solid black',
        }}
      >
        <pre style={{ margin: 0 }}>{JSON.stringify(obj, null, 2)}</pre>
      </div>
    </motion.foreignObject>
  );
};

export default HoverContent;

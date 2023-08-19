import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { DrawableComponentBase, NodeProp } from './drawable';

const draw = {
  hidden: { opacity: 0 },
  visible: (i: number) => {
    const delay = 1 + i * 0.5;
    return {
      opacity: 1,
      transition: {
        delay,
        type: 'spring',
        bounce: 0,
        duration: 0.5,
      },
    };
  },
  x: {
    transition: { duration: 3 },
  },
  y: {
    transition: { duration: 3 },
  },
};

type DrawableEdgeComponent = DrawableComponentBase<NodeProp>;
const LinkedNode: DrawableEdgeComponent = ({ entity: nodeEntity }, ref) => {
  const [isHover, setIsHovered] = useState(false);

  if (nodeEntity.type !== 'node') return;
  const { colorHex, title, size } = nodeEntity;

  // eslint-disable-next-line consistent-return
  return (
    <motion.g
      ref={ref}
      initial={{ x: nodeEntity.x, y: nodeEntity.y }}
      exit={{
        opacity: 0,
        scale: 0.7,
        transition: { duration: 0.05, type: 'spring' },
      }}
      transition={{ x: 'x', y: 'y' }}
      drag
      dragConstraints={{ left: 0, top: 0, right: 1000, bottom: 1000 }}
      dragMomentum={false}
      onHoverStart={() => {
        setIsHovered(true);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
      }}
      onClick={() => {
        setIsHovered(false);
      }}
      onDragEnd={(_event, info) => {
        nodeEntity.x += info.offset.x;
        nodeEntity.y += info.offset.y;
      }}
    >
      <motion.circle
        cx={0}
        cy={0}
        r={size}
        stroke={colorHex}
        variants={draw}
        initial="hidden"
        animate="visible"
      />

      <motion.text
        x={0}
        y={0}
        textAnchor="middle"
        fill={colorHex}
        dy=".3em"
        fontSize="20px"
        initial="hidden"
        animate="visible"
        variants={draw}
        style={{ userSelect: 'none' }}
      >
        {title}
      </motion.text>

      {isHover && (
        <motion.foreignObject
          width={250}
          height={350}
          x={size - 50}
          y={80}
          style={{ zIndex: 1000 }}
        >
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
            <pre style={{ margin: 0 }}>{JSON.stringify(nodeEntity, null, 2)}</pre>
          </div>
        </motion.foreignObject>
      )}
    </motion.g>
  );
};

LinkedNode.displayName = 'Edge';
export default React.forwardRef(LinkedNode);

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { DrawableComponentBase, NodeProp } from './drawable';

const animations = {
  entry: {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: 1 + i * 0.5,
        type: 'spring',
        bounce: 0,
        duration: 0.5,
      },
    }),
  },
  exit: {
    exit: {
      opacity: 0,
      scale: 0.7,
      transition: {
        duration: 0.05,
        type: 'spring',
      },
    },
  },
  animate: {
    positionChange: (x: number, y: number) => ({
      x,
      y,
      transition: { duration: 1.5 },
    }),
  },
};

type DrawableEdgeComponent = DrawableComponentBase<NodeProp>;
const LinkedNode: DrawableEdgeComponent = ({ entity: nodeEntity, coord }, ref) => {
  const [isHover, setIsHovered] = useState(false);

  if (nodeEntity.type !== 'node' || !coord) return null;
  const { colorHex, title, size } = nodeEntity;

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    setX(coord.x.val);
    setY(coord.y.val);
  }, [coord.y.val, coord.x.val]);

  return (
    <motion.g
      ref={ref}
      initial={{ x: coord.x.val, y: coord.y.val }}
      exit={animations.exit.exit}
      animate={animations.animate.positionChange(coord.x.val, coord.y.val)}
      x={x}
      y={y}
      drag
      dragConstraints={{ left: 0, top: 0, right: 1000, bottom: 1000 }}
      dragMomentum={false}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => setIsHovered(false)}
      onDragEnd={(_event, info) => {}}
    >
      <motion.circle cx={0} cy={0} r={size} stroke={colorHex} opacity={1} />
      <motion.text
        x={0}
        y={0}
        textAnchor="middle"
        fill={colorHex}
        dy=".3em"
        fontSize="20px"
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

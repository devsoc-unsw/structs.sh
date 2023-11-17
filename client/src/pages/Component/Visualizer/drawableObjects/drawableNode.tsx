import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { DrawableComponentBase, NodeProp } from './drawable';
import HoverContent from '../util/hoverDebugger';

const animations = {
  entry: {
    initialPosition: (x: number, y: number) => {
      return {
        x,
        y,
        opacity: 0,
        scale: 0,
        duration: 0.15,
      };
    },
    hidden: { opacity: 0 },
    visible: () => ({
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        bounce: 0,
        duration: 0.15,
      },
    }),
  },
  exit: {
    exit: {
      opacity: 0,
      scale: 0.7,
      transition: {
        duration: 0.15,
        type: 'spring',
      },
    },
  },
  animate: {
    positionChange: (x: number, y: number) => ({
      x,
      y,
      transition: { duration: 0.15 },
      opacity: 1,
      scale: 1,
    }),
  },
};

type DrawableEdgeComponent = DrawableComponentBase<NodeProp>;
const LinkedNode: DrawableEdgeComponent = ({ entity: nodeEntity, coord }: NodeProp, ref) => {
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
      initial={animations.entry.initialPosition(coord.x.val, coord.y.val)}
      exit={animations.exit.exit}
      animate={animations.animate.positionChange(coord.x.val, coord.y.val)}
      x={x}
      y={y}
      dragMomentum={false}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.circle cx={0} cy={0} r={size} stroke={colorHex} opacity={1} />
      <motion.text
        x={0}
        y={0}
        textAnchor="middle"
        fill={colorHex}
        dy=".3em"
        fontSize="38px"
        fontWeight="1000"
        style={{ userSelect: 'none' }}
      >
        {title}
      </motion.text>
      <HoverContent isVisible={false} obj={nodeEntity} size={size} />
    </motion.g>
  );
};

LinkedNode.displayName = 'Edge';
export default React.forwardRef(LinkedNode);

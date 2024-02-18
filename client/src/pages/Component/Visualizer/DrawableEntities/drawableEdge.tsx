import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DrawableComponentBase, EdgeProp, MotionCoord } from './drawable';
import HoverContent from '../Util/hoverDebugger';

const animations = {
  enter: {
    initialPosition: (x: number, y: number) => {
      return {
        x,
        y,
        opacity: 0,
        transition: { duration: 1.5 },
      };
    },
  },
  exit: { opacity: 0, transition: { duration: 0.75 } },
  animate: {
    positionChange: (x: number, y: number) => ({
      x,
      y,
      opacity: 1,
      transition: { duration: 1.5 },
    }),
  },
};

const ArrowMarker = ({ id, color }: { id: string; color: string }) => (
  <motion.marker
    id={id}
    markerWidth="2.67"
    markerHeight="2.67"
    refX="0"
    refY="1"
    orient="auto"
    markerUnits="strokeWidth"
  >
    <path d="M0,0 L0,2 L3,1 z" fill={color} />
  </motion.marker>
);

function calculateCoordinates(from: MotionCoord, to: MotionCoord, offsetDistance = 80) {
  const deltaX = to.x.val - from.x.val;
  const deltaY = to.y.val - from.y.val;
  const angle = Math.atan2(deltaY, deltaX);

  // Coordinates for the starting point
  const x1 = from.x.val + Math.cos(angle) * offsetDistance * 0.8;
  const y1 = from.y.val + Math.sin(angle) * offsetDistance * 0.8;

  // Coordinates for the end point
  const x2 = to.x.val - Math.cos(angle) * offsetDistance;
  const y2 = to.y.val - Math.sin(angle) * offsetDistance;

  return { x1, y1, x2, y2 };
}

type DrawableEdgeComponent = DrawableComponentBase<EdgeProp>;
const Edge: DrawableEdgeComponent = ({ entity: edge, from, to }: EdgeProp, ref) => {
  const markerId = `arrow-${edge.uid}`;
  const [coords, setCoords] = useState(calculateCoordinates(from, to));
  const [isHover, setIsHovered] = useState(false);

  useEffect(() => {
    const res = calculateCoordinates(from, to);
    setCoords(res);
  }, [from.x.val, from.y.val, to.x.val, to.y.val]);

  return (
    <motion.g
      ref={ref}
      x={coords.x1}
      y={coords.y1}
      initial={animations.enter.initialPosition(coords.x1, coords.y1)}
      exit={animations.exit}
      animate={animations.animate.positionChange(coords.x1, coords.y1)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      drag
      dragMomentum={false}
    >
      <defs>
        <ArrowMarker id={markerId} color="#DE3163" />
      </defs>
      <motion.line
        x1={0}
        y1={0}
        x2={coords.x2 - coords.x1}
        y2={coords.y2 - coords.y1}
        opacity={1}
        transition={{ type: 'spring', bounce: 0.025, duration: 1 }}
        stroke="#DE3163"
        strokeWidth={6}
        markerEnd={`url(#${markerId})`}
      />
      <HoverContent isVisible={false} obj={{ ...edge, toPos: to, fromPos: from }} size={75} />
    </motion.g>
  );
};

Edge.displayName = 'Edge';
export default React.forwardRef(Edge);

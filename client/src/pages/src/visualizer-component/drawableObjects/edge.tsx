import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FrontendLinkedListGraph } from '../types/frontendType';
import { DrawableComponentBase, EdgeProp, MotionCoord } from './drawable';

const animations = {
  enter: { opacity: 1, transition: { duration: 1 } },
  exit: { opacity: 0, transition: { duration: 1 } },
  path: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      pathLength: { delay: i * 0.2, duration: 1, ease: [0.43, 0.13, 0.23, 0.96] },
      opacity: { delay: i * 0.2, duration: 0.05 },
    },
  }),
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
const Edge: DrawableEdgeComponent = ({ entity: edge, graph, from, to }, ref) => {
  const markerId = `arrow-${edge.uid}`;
  const [coords, setCoords] = useState<
    | {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
      }
    | {}
  >({});

  useEffect(() => {
    const res = calculateCoordinates(from, to);
    setCoords(res);
  }, [from.x, from.y, to.x, to.y]);

  return (
    <motion.g ref={ref} variants={animations} initial="exit" animate="enter">
      <defs>
        <ArrowMarker id={markerId} color="#DE3163" />
      </defs>
      <motion.line
        {...coords}
        opacity={1}
        transition={{ type: 'spring', bounce: 0.025, duration: 1 }}
        stroke="#DE3163"
        strokeWidth={6}
        variants={animations}
        custom={2}
        markerEnd={`url(#${markerId})`}
      />
    </motion.g>
  );
};

Edge.displayName = 'Edge';
export default React.forwardRef(Edge);

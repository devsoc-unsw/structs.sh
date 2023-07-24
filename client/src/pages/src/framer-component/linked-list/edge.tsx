import { AnimatePresence, motion } from "framer-motion";
import { forwardRef } from "react";
import { FrontendLinkedListGraph, NodeEntity } from "../types/graphState";

interface EdgeProps {
  edgeUid: string;
  graph: FrontendLinkedListGraph;
  color: string;
}

const draw = {
  animate: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      type: "spring",
      pathLength: {
        delay: i * 0.2,
        duration: 1,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
      opacity: { delay: i * 0.2, duration: 0.05 },
    },
  }),
  exit: {
    opacity: 0,
    transition: { duration: 1 },
  },
};

const createArrowMarker = (id: string, color: string) => (
  <marker
    id={id}
    markerWidth="2.67" // 8 / 3 = 2.67
    markerHeight="2.67" // 8 / 3 = 2.67
    refX="0"
    refY="1" // 3 / 3 = 1
    orient="auto"
    markerUnits="strokeWidth"
  >
    <path d="M0,0 L0,2 L3,1 z" fill={color} /> // coordinates are divided by 3
  </marker>
);

function calculateCoordinates(
  fromUid: string,
  toUid: string,
  graph: FrontendLinkedListGraph,
  offsetDistance = 80
) {
  const from: NodeEntity = graph.cacheEntity[fromUid] as NodeEntity;
  const to: NodeEntity = graph.cacheEntity[toUid] as NodeEntity;

  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  const angle = Math.atan2(deltaY, deltaX);

  // Coordinates for the starting point
  const x1 = from.x + Math.cos(angle) * offsetDistance * 0.8;
  const y1 = from.y + Math.sin(angle) * offsetDistance * 0.8;

  // Coordinates for the end point
  const x2 = to.x - Math.cos(angle) * offsetDistance;
  const y2 = to.y - Math.sin(angle) * offsetDistance;

  return { x1, y1, x2, y2, opacity: 1, transition: { duration: 1 }, };
}

const Edge = forwardRef<SVGSVGElement, EdgeProps>(({ edgeUid, graph }, ref) => {
  const edge = graph.cacheEntity[edgeUid];
  if (edge.type !== "edge") return;
  const markerId = `arrow-${edgeUid}`;

  return (
      <motion.g
        ref={ref}
        variants={draw}
        transition={{ ease: "easeOut", duration: 2 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1 },}}
      >
        <defs>{createArrowMarker(markerId, "#DE3163")}</defs>
        <motion.line
          initial={calculateCoordinates(edge.from, edge.to, graph)}
          animate={calculateCoordinates(edge.from, edge.to, graph)}
          transition={{ type: "spring", bounce: 0.025 }}
          stroke={"#DE3163"}
          strokeWidth={6}
          custom={2}
          variants={draw}
          markerEnd={`url(#${markerId})`}
        />
      </motion.g>
  );
});

export default Edge;

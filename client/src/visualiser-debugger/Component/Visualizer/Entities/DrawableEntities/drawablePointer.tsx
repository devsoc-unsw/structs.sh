import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DrawableComponentBase, MotionCoord, PointerProp } from './drawable';
import { AttachableEntity, getAttachableEntityShape } from '../CoreEntity/attachableEntity';

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

function calculateCoordinates(
  to: MotionCoord,
  attachedEntity: AttachableEntity,
  offsetDistance = 40
) {
  const shape = getAttachableEntityShape(attachedEntity);

  // We want the arrow appear below it
  return {
    x2: shape.center.x,
    x1: shape.center.x,
    y2: shape.center.y + shape.radius + (1 / 2) * offsetDistance,
    y1: shape.center.y + shape.radius + offsetDistance,
  };
}

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

type DrawablePointerComponent = DrawableComponentBase<PointerProp>;
const PointerDrawable: DrawablePointerComponent = (
  { entity, attachedEntity, pos }: PointerProp,
  ref
) => {
  const markerId = `arrow-${entity.uid}`;
  const [coords, setCoords] = useState(calculateCoordinates(pos, attachedEntity));

  useEffect(() => {
    const res = calculateCoordinates(pos, attachedEntity);
    setCoords(res);
  }, [pos.x.val, pos.y.val]);

  const splitLabels = (label: string) => {
    return label.split(', ');
  };

  // Calculate the text's width using canvas
  // https://www.tutorialspoint.com/Calculate-text-width-with-JavaScript#:~:text=To%20calculate%20text%20width%2C%20we,method%20to%20measure%20the%20text.
  const getTextWidth = (text: string, fontSize: number) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = `${fontSize}px Arial`;
      return context.measureText(text).width;
    }
    return 0;
  };

  return (
    <motion.g
      ref={ref}
      x={coords.x1}
      y={coords.y1}
      initial={animations.enter.initialPosition(coords.x1, coords.y1)}
      exit={animations.exit}
      animate={animations.animate.positionChange(coords.x1, coords.y1)}
      drag
      dragMomentum={false}
    >
      <defs>
        <ArrowMarker id={markerId} color="#DE3163" />
      </defs>
      <motion.line
        x1={0}
        y1={30}
        x2={0}
        y2={coords.y2 - coords.y1}
        opacity={1}
        transition={{ type: 'spring', bounce: 0.025, duration: 1 }}
        stroke="#DE3163"
        strokeWidth={8}
        markerEnd={`url(#${markerId})`}
      />

      {splitLabels(entity.label).map((l, idx) => {
        const fontSize = 40;
        let label = l;
        if (idx < splitLabels(entity.label).length - 1) {
          label += ',';
        }

        return (
          <motion.text
            key={idx}
            x={-getTextWidth(label, fontSize) / 2}
            y={coords.y2 - coords.y1 + 85 + idx * 40}
            fontSize={fontSize}
          >
            {label}
          </motion.text>
        );
      })}
    </motion.g>
  );
};

PointerDrawable.displayName = 'PointerDrawable';
export default React.forwardRef(PointerDrawable);

import { PanInfo, motion, useAnimation } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { Coord } from '../../../Types/geometry/geometry';

interface SvgComponentProps {
  dimension: { width: number; height: number };
  centerCoord: Coord;
  children: React.ReactNode;
}

const ScaleBar = ({ viewBoxWidth }: { viewBoxWidth: number }) => {
  const scaleWidth = 100; // fixed width in user space (e.g., a bar that always tries to represent 100 units in the user's space)
  const displayWidth = (scaleWidth / viewBoxWidth) * 1000; // This calculates the width the bar should have in the SVG.

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'white',
        padding: '5px',
        borderRadius: '5px',
      }}
    >
      <svg width={displayWidth} height="20">
        <rect x="0" y="5" width={displayWidth} height="10" fill="gray" />
      </svg>
      <div style={{ fontSize: '10px', textAlign: 'center' }}>{`${Math.round(displayWidth)}`}</div>
    </div>
  );
};

const SvgComponent: React.FC<SvgComponentProps> = ({ children, dimension, centerCoord }) => {
  const [viewBoxWidth, setViewBoxWidth] = useState(1000);
  const controls = useAnimation();
  const svgRef = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    if (svgRef.current) {
      controls.start({
        viewBox: `${centerCoord.x - viewBoxWidth / 2} ${
          centerCoord.y - viewBoxWidth / 2
        } ${viewBoxWidth} ${viewBoxWidth}`,
        transition: {
          duration: 2, // this will set the duration to 200ms
        },
      });
    }
    /*  */
    // viewBox: `${centerCoord.x - viewBoxWidth / 2} ${centerCoord.y - viewBoxWidth / 2} ${viewBoxWidth} ${viewBoxWidth}`,
    /* const viewBox: SVGRect = svgRef.current.viewBox.baseVal;
    viewBox.x = centerCoord.x - viewBoxWidth / 2;
    viewBox.y = centerCoord.y - viewBoxWidth / 2; */
  }, [viewBoxWidth, controls, centerCoord]);

  /**
   * SVG Section
   */

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    event.preventDefault();
    const viewBox: SVGRect = svgRef.current.viewBox.baseVal;
    viewBox.x -= info.delta.x;
    viewBox.y -= info.delta.y;
  };
  const handleWheel = (event: React.WheelEvent<SVGSVGElement>) => {
    event.preventDefault();

    const viewBox: SVGRect = svgRef.current.viewBox.baseVal;
    const zoomFactor = 1.045;

    const dx = (viewBox.width * (zoomFactor - 1)) / 2;
    const dy = (viewBox.height * (zoomFactor - 1)) / 2;

    if (event.deltaY < 0) {
      // zoom in
      viewBox.width /= zoomFactor;
      viewBox.height /= zoomFactor;
      viewBox.x += dx;
      viewBox.y += dy;

      setViewBoxWidth((prevWidth) => prevWidth / zoomFactor);
    } else {
      // zoom out
      viewBox.width *= zoomFactor;
      viewBox.height *= zoomFactor;
      viewBox.x -= dx;
      viewBox.y -= dy;

      setViewBoxWidth((prevWidth) => prevWidth * zoomFactor);
    }
  };

  return (
    <div>
      <motion.svg
        ref={svgRef}
        width={dimension.width}
        height={dimension.height}
        viewBox="0 0 1000 1000"
        initial="hidden"
        overflow="hidden"
        animate={controls}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragMomentum={false}
        dragElastic={0}
        onDrag={(event, info) => handleDrag(event, info)}
        onWheel={(event) => handleWheel(event)}
      >
        {children}
      </motion.svg>
      <div>
        <ScaleBar viewBoxWidth={viewBoxWidth} />
      </div>
    </div>
  );
};

export default SvgComponent;

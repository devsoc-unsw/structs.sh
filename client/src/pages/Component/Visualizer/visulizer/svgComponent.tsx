import { PanInfo, motion, useAnimation } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { Coord } from '../../../Types/geometry/geometry';

interface SvgComponentProps {
  dimension: { width: number; height: number };
  centerCoord: Coord;
  children: React.ReactNode;
}

const ScaleBar = ({ scalePercentage }: { scalePercentage: number }) => {
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
      <div style={{ fontSize: '10px', textAlign: 'center' }}>{`${Math.round(
        scalePercentage
      )}%`}</div>
    </div>
  );
};

const SvgComponent: React.FC<SvgComponentProps> = ({ children, dimension, centerCoord }) => {
  const [scalePercentage, setScalePercentage] = useState(100);
  const controls = useAnimation();
  const svgRef = useRef<SVGSVGElement | null>(null);

  const VIEW_BOX_HEIGHT = 1000;
  const VIEW_BOX_WIDTH = 1000;
  useEffect(() => {
    const effectiveWidth = VIEW_BOX_WIDTH / (scalePercentage / 100);
    const effectiveHeight = VIEW_BOX_HEIGHT / (scalePercentage / 100);
    if (svgRef.current) {
      controls.start({
        viewBox: `${centerCoord.x - effectiveWidth / 2} ${
          centerCoord.y - effectiveHeight / 2
        } ${effectiveWidth} ${effectiveHeight}`,
        transition: {
          duration: 2, // this will set the duration to 200ms
        },
      });
    }
  }, [scalePercentage, controls, centerCoord]);

  /**
   * SVG Section
   */
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    event.preventDefault();
    const viewBox: SVGRect = svgRef.current.viewBox.baseVal;
    viewBox.x -= info.delta.x;
    viewBox.y -= info.delta.y;
  };

  const MAX_SCALE = 400;
  const MIN_SCALE = 25;
  const handleWheel = (event: React.WheelEvent<SVGSVGElement>) => {
    event.preventDefault();

    const viewBox: SVGRect = svgRef.current.viewBox.baseVal;
    const zoomFactor = 1.045;

    const dx = (viewBox.width * (zoomFactor - 1)) / 2;
    const dy = (viewBox.height * (zoomFactor - 1)) / 2;

    let newScale: number = MIN_SCALE;
    if (event.deltaY <= 0) {
      // Potential zoom in
      newScale = scalePercentage * zoomFactor;

      // Check if we're not exceeding the maximum zoom.
      if (newScale <= MAX_SCALE) {
        viewBox.width /= zoomFactor;
        viewBox.height /= zoomFactor;
        viewBox.x += dx;
        viewBox.y += dy;
      }
      setScalePercentage(Math.min(MAX_SCALE, newScale));
    } else {
      // Potential zoom out
      newScale = scalePercentage / zoomFactor;

      // Check if we're not going below the minimum zoom.
      if (newScale >= MIN_SCALE) {
        viewBox.width *= zoomFactor;
        viewBox.height *= zoomFactor;
        viewBox.x -= dx;
        viewBox.y -= dy;
      }
      setScalePercentage(Math.max(MIN_SCALE, newScale));
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
        <ScaleBar scalePercentage={scalePercentage} />
      </div>
    </div>
  );
};

export default SvgComponent;

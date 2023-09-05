import React, { PointerEvent, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const ZoomableSvg = styled('svg')(({ scale }) => ({
  transition: 'transform 0.2s linear',
  transformOrigin: 'center',
  transform: `scale(${scale})`,
  width: '100%',
}));

/* -------------------------------------------------------------------------- */
/*                        Visualiser-Specific Canvases                        */
/* -------------------------------------------------------------------------- */

/**
 * The React component that renders the DOM elements that the visualiser
 * attaches itself to.
 */
const VisualiserCanvas: React.FC = () => {
  const [scale, setScale] = useState(1);
  const svgRef = useRef(null);
  const [height, setHeight] = useState(1000);
  const [width, setWidth] = useState(1000);

  const ZOOM_SPEED = 0.05;
  const MAX_SCALE = 2;
  const MIN_SCALE = 0.5;
  const onScroll = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      setScale(Math.min(scale + ZOOM_SPEED, MAX_SCALE));
    } else {
      setScale(Math.max(scale - ZOOM_SPEED, MIN_SCALE));
    }
  };

  const [isPointerDown, setIsPointerDown] = useState(false);

  const [pointerOrigin, setPointerOrigin] = useState({
    x: 0,
    y: 0,
  });

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    setIsPointerDown(true);

    setPointerOrigin({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const [viewBox, setViewBox] = useState({
    x: 0,
    y: 0,
  });

  const [newViewBox, setNewViewBox] = useState({
    x: 0,
    y: 0,
  });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown) {
      return;
    }

    event.preventDefault();

    // Ensure x is between -width and width and y is between -height and height
    setNewViewBox({
      x: Math.min(width, Math.max(-width, viewBox.x - (event.clientX - pointerOrigin.x))),
      y: Math.min(height, Math.max(-height, viewBox.y - (event.clientY - pointerOrigin.y))),
    });
  };

  const handlePointerUp = () => {
    setIsPointerDown(false);

    setViewBox({
      x: newViewBox.x,
      y: newViewBox.y,
    });
  };

  useEffect(() => {
    setHeight(svgRef.current.clientHeight);
    setWidth(svgRef.current.clientWidth);
    setViewBox((prevViewBox) => ({
      ...prevViewBox,
      height,
      width,
    }));
  }, []);

  return (
    <Box
      onWheel={onScroll}
      id="visualiser-container"
      margin="auto"
      height="100vh"
      width={window.screen.width}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      <ZoomableSvg
        ref={svgRef}
        id="visualiser-canvas"
        scale={scale}
        viewBox={`${newViewBox.x} ${newViewBox.y} ${width} ${height}`}
      />
    </Box>
  );
};

export default VisualiserCanvas;

import { PanInfo, motion, useAnimation } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Coord } from '../../../Types/geometryType';

interface SvgComponentProps {
  centerCoord: Coord;
  children: React.ReactNode;
}

const ScaleBar = ({ scalePercentage }: { scalePercentage: number }) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '15px',
        background: 'white',
        padding: '5px',
        borderRadius: '5px',
      }}
    >
      <div style={{ fontSize: '12px', textAlign: 'center' }}>{`${Math.round(
        scalePercentage
      )}%`}</div>
    </div>
  );
};

const SvgComponent: React.FC<SvgComponentProps> = ({ children, centerCoord: centerCoordProp }) => {
  const [scalePercentage, setScalePercentage] = useState(100);
  const controls = useAnimation();
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [isLocked, setIsLocked] = useState(true);
  const [centerCoord, setCenterCoord] = useState<Coord>({
    x: 0,
    y: 0,
  });

  // ... existing state and function definitions ...
  const [viewBoxWidth, setViewBoxWidth] = useState(1600); // Default width
  const [viewBoxHeight, setViewBoxHeight] = useState(800); // Default height
  useEffect(() => {
    if (svgRef.current) {
      const { width, height } = svgRef.current.getBoundingClientRect();
      setViewBoxWidth(width);
      setViewBoxHeight(height);
    }
  }, []);

  useEffect(() => {
    if (isLocked) {
      setCenterCoord(centerCoordProp);
    }
  }, [centerCoordProp]);

  const handlePosSimulation = () => {
    if (isLocked) {
      setScalePercentage(100);
    }
    const effectiveWidth = (Math.max(viewBoxWidth, 500) * 2) / (scalePercentage / 100);
    const effectiveHeight = (Math.max(viewBoxHeight, 500) * 2) / (scalePercentage / 100);

    if (svgRef.current) {
      if (isLocked) {
        controls.start({
          viewBox: `${centerCoord.x - effectiveWidth / 2} ${
            centerCoord.y - effectiveHeight / 2
          } ${effectiveWidth} ${effectiveHeight}`,
          transition: {
            duration: 1.25, // this will set the duration to 200ms
          },
        });
      } else {
        controls.set({
          viewBox: `${centerCoord.x - effectiveWidth / 2} ${
            centerCoord.y - effectiveHeight / 2
          } ${effectiveWidth} ${effectiveHeight}`,
        });
      }
    }
  };
  useEffect(() => {
    handlePosSimulation();
  }, [scalePercentage, controls, centerCoord, isLocked]);

  /**
   * SVG Section
   */
  const toggleLock = () => {
    setIsLocked((prevLockStatus) => {
      setCenterCoord(centerCoordProp);
      return !prevLockStatus;
    });
  };

  useEffect(() => {
    // Update the cursor style based on the isLocked state
    controls.start({
      cursor: isLocked ? 'not-allowed' : 'grab',
    });
    controls.start({
      transition: {
        duration: 20,
      },
    });
  }, [isLocked, controls]);

  const isSvgInteractive = (event: MouseEvent | TouchEvent | PointerEvent) => {
    if (isLocked) return false;
    if (!svgRef.current) return false;
    // Get the bounding rectangle of the SVG container
    const svgRect = svgRef.current.getBoundingClientRect();

    let clientX: number = 0;
    let clientY: number = 0;
    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else if (event instanceof TouchEvent && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if (window.PointerEvent && event instanceof PointerEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      return false;
    }

    if (
      clientX < svgRect.left ||
      clientX > svgRect.right ||
      clientY < svgRect.top ||
      clientY > svgRect.bottom
    ) {
      return false;
    }

    return true;
  };
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    event.preventDefault();
    if (!isSvgInteractive(event)) return;

    setCenterCoord({
      x: (centerCoord.x -= info.delta.x * (175 / scalePercentage)),
      y: (centerCoord.y -= info.delta.y * (175 / scalePercentage)),
    });
  };

  const MAX_SCALE_PER = 400;
  const MIN_SCALE_PER = 25;
  const handleWheel = (event: React.WheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    if (isLocked) return;
    if (!svgRef.current) return;

    const viewBox: SVGRect = svgRef.current.viewBox.baseVal;
    const zoomFactor = 1.045;

    const dx = (viewBox.width * (zoomFactor - 1)) / 2;
    const dy = (viewBox.height * (zoomFactor - 1)) / 2;

    let newScale: number = MIN_SCALE_PER;
    if (event.deltaY <= 0) {
      // Potential zoom in
      newScale = scalePercentage * zoomFactor;

      // Check if we're not exceeding the maximum zoom.
      if (newScale <= MAX_SCALE_PER) {
        viewBox.width /= zoomFactor;
        viewBox.height /= zoomFactor;
        viewBox.x += dx;
        viewBox.y += dy;
      }
      setScalePercentage(Math.min(MAX_SCALE_PER, newScale));
    } else {
      // Potential zoom out
      newScale = scalePercentage / zoomFactor;

      // Check if we're not going below the minimum zoom.
      if (newScale >= MIN_SCALE_PER) {
        viewBox.width *= zoomFactor;
        viewBox.height *= zoomFactor;
        viewBox.x -= dx;
        viewBox.y -= dy;
      }
      setScalePercentage(Math.max(MIN_SCALE_PER, newScale));
    }
  };

  const flexContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  };

  const svgContainerStyle: React.CSSProperties = {
    position: 'relative',
    flexGrow: 1,
    border: '3px solid #ccc',
    borderRadius: '4px',
    backgroundClip: 'padding-box',
    height: '100%',
    width: '100%',
    margin: '5px',
    padding: '5px',
    overflow: 'hidden',
  };

  return (
    <div style={flexContainerStyle}>
      <div style={svgContainerStyle}>
        <motion.svg
          ref={svgRef}
          initial="hidden"
          overflow="hidden"
          height="100%"
          width="100%"
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

        {/* Tooltip and lock icon placed on the top right within the SVG */}
        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <Tooltip title={isLocked ? 'Unlock Visualizer View' : 'Lock Visualizer View'}>
            <IconButton onClick={toggleLock}>
              {isLocked ? <LockIcon /> : <LockOpenIcon />}
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <ScaleBar scalePercentage={scalePercentage} />
    </div>
  );
};

export default SvgComponent;

// https://www.npmjs.com/package/react-resizable

// visualiser-debugger/components/TabResize/TabResize.tsx
import React, { useState, useRef, useEffect } from 'react';

interface TabResizeProps {
  children: React.ReactNode;
  initialHeight: number;
  minConstraints: [number, number];
  maxConstraints: [number, number];
  onResize?: (height: number) => void;
}

const TabResize: React.FC<TabResizeProps> = ({ children, initialHeight, minConstraints, maxConstraints, onResize }) => {
  const [height, setHeight] = useState(initialHeight);
  const resizableRef = useRef<HTMLDivElement>(null);
  // const [hovering, setHovering] = useState(false);

  const handleMouseMove = (event: MouseEvent) => {
    if (!resizableRef.current) return;

    const newHeight = event.clientY - resizableRef.current.getBoundingClientRect().top;
    if (newHeight >= minConstraints[1] && newHeight <= maxConstraints[1]) {
      setHeight(newHeight);
      if (onResize) onResize(newHeight);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = () => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    setHeight(initialHeight);
  }, [initialHeight]);

  return (
    <div
      className="resizable"
      ref={resizableRef}
      style={{ height: `${height}px`, position: 'relative', width: '100%' }}
      // onMouseEnter={() => setHovering(true)}
      // onMouseLeave={() => setHovering(false)}
    >
      <div
        className="resizer top-resizer"
        onMouseDown={handleMouseDown}
        style={{
          width: '100%',
          height: '5px',
          background: 'gray',
          cursor: 'row-resize',
          position: 'absolute',
          top: 0,
          display: 'block',
        }}
      />
      {children}
      <div
        className="resizer bottom-resizer"
        onMouseDown={handleMouseDown}
        style={{
          width: '100%',
          height: '5px',
          background: 'gray',
          cursor: 'row-resize',
          position: 'absolute',
          bottom: 0,
          display: 'block',
        }}
      />
    </div>
  );
};

export default TabResize;

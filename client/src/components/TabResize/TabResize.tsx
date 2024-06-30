// https://www.npmjs.com/package/react-resizable

// visualiser-debugger/components/TabResize/TabResize.tsx
import React, {useState, useEffect} from 'react';
import { Resizable } from 're-resizable';
import './tabResize.css';

interface TabResizeProps {
  initialWidth: number;
  initialHeight: number;
  minConstraints?: [number, number];
  maxConstraints?: [number, number];
  children: React.ReactNode;
}

const TabResize: React.FC<TabResizeProps> = ({
  initialHeight,
  minConstraints = [100, 100],
  maxConstraints = [800, 800],
  children
}) => {
  return (
    <Resizable
      defaultSize={{
        width: 420,
        height: initialHeight,
      }}
      minHeight={minConstraints[1]}
      maxHeight={maxConstraints[1]}
      enable={{ top: true, bottom: true, left: false, right: false, topLeft: false, topRight: false, bottomLeft: false, bottomRight: false }}
      className="resize-container"
    >
      <div style={{ width: '420px' }}>
        {children}
      </div>
    </Resizable>
  );
};

interface TabResizeWrapperProps {
  children: React.ReactNode[];
}

const TabResizeWrapper: React.FC<TabResizeWrapperProps> = ({ children }) => {
  const [constraints, setConstraints] = useState<[number, number, number, number]>([100, 100, window.innerWidth, window.innerHeight]);

  useEffect(() => {
    const handleResize = () => {
      setConstraints([100, 100, window.innerWidth, window.innerHeight]);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="tab-resize-wrapper">
      {React.Children.map(children, (child) => {
        return React.cloneElement(child as React.ReactElement<any>, {
          minConstraints: [constraints[0], constraints[1]],
          maxConstraints: [constraints[2], constraints[3]],
        });
      })}
    </div>
  );
};

export default TabResizeWrapper;
export { TabResize };
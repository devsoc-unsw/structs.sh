import React, { useState, useEffect } from 'react';
import TabResizeWrapper, { TabResize } from "./TabResize";
import './tabResize.css';
// http://localhost:3000/resizableTest

const TempTabResizablePage: React.FC = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [div1Height, setDiv1Height] = useState(windowHeight / 2);
  const [div2Height, setDiv2Height] = useState(windowHeight / 2);

  useEffect(() => {
    const handleResize = () => {
      const newWindowHeight = window.innerHeight;
      setWindowHeight(newWindowHeight);
      const totalHeight = div1Height + div2Height;
      const newDiv1Height = (div1Height / totalHeight) * newWindowHeight;
      const newDiv2Height = (div2Height / totalHeight) * newWindowHeight;
      setDiv1Height(newDiv1Height);
      setDiv2Height(newDiv2Height);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [div1Height, div2Height]);

  const handleResize = (height: number, div: 'div1' | 'div2') => {
    if (div === 'div1') {
      const newDiv2Height = windowHeight - height;
      if (newDiv2Height >= 100) {
        setDiv1Height(height);
        setDiv2Height(newDiv2Height);
      }
    } else {
      const newDiv1Height = windowHeight - height;
      if (newDiv1Height >= 100) {
        setDiv2Height(height);
        setDiv1Height(newDiv1Height);
      }
    }
  };

  return (
    <TabResizeWrapper>
      <TabResize
        initialWidth={420}
        initialHeight={div1Height}
        minConstraints={[420, 100]}
        maxConstraints={[420, windowHeight - 100]}
        // onResize={(height: number) => handleResize(height, 'div1')}
      >
        <div className="resize-content-1"></div>
      </TabResize>
      <TabResize
        initialWidth={420}
        initialHeight={div2Height}
        minConstraints={[420, 100]}
        maxConstraints={[420, windowHeight - 100]}
        // onResize={(height: number) => handleResize(height, 'div2')}
      >
        <div className="resize-content-2"></div>
      </TabResize>
    </TabResizeWrapper>
  );
};

export default TempTabResizablePage;

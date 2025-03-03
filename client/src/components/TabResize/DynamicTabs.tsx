import React, { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import DynamicTab from './DynamicTab';

interface TabsPropsBase {
  children: ReactNode[];
  direction: 'horizontal' | 'vertical';
  initialSize: string | number;
}

interface VerticalTabsProps extends TabsPropsBase {
  direction: 'vertical';
  minHeightRatio: number[];
}

interface HorizontalTabsProps extends TabsPropsBase {
  direction: 'horizontal';
  minWidthRatio: number[];
}

type DynamicTabsProps = VerticalTabsProps | HorizontalTabsProps;

const DynamicTabs: React.FC<DynamicTabsProps> = (props) => {
  const { children, direction, initialSize } = props;
  const isHorizontal = direction === 'horizontal';

  const minSizeRatios = isHorizontal
    ? (props as HorizontalTabsProps).minWidthRatio
    : (props as VerticalTabsProps).minHeightRatio;

  const initialRatios = new Array(children.length).fill(1 / children.length);
  const totalRatio = initialRatios.reduce((acc, ratio) => acc + ratio, 0);
  const normalizedInitialRatios = initialRatios.map((ratio) => ratio / totalRatio);

  const [ratios, setRatios] = useState<number[]>(normalizedInitialRatios);
  const [dragging, setDragging] = useState<number | null>(null);

  const handleMouseDown = (index: number) => (event: React.MouseEvent) => {
    const startPos = isHorizontal ? event.clientX : event.clientY;
    const ratioBeforeMouseDown = [...ratios];

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const innerScopeIndex = index;

      const currentPos = isHorizontal ? moveEvent.clientX : moveEvent.clientY;
      const delta =
        (currentPos - startPos) / (isHorizontal ? window.innerWidth : window.innerHeight);
      const ratioAfterMouseDown = [...ratioBeforeMouseDown];

      // TODO: THIS IS IMPORTANT
      const nextIndex = innerScopeIndex + 1;

      if (nextIndex >= 0 && nextIndex < ratioAfterMouseDown.length) {
        ratioAfterMouseDown[innerScopeIndex] += delta;
        ratioAfterMouseDown[nextIndex] -= delta;

        if (
          ratioAfterMouseDown[innerScopeIndex] < minSizeRatios[innerScopeIndex] ||
          ratioAfterMouseDown[nextIndex] < minSizeRatios[nextIndex]
        ) {
          console.log('Min size reached', minSizeRatios[innerScopeIndex]);
          return;
        }

        setRatios(ratioAfterMouseDown);
      }
    };

    const handleMouseUp = () => {
      setDragging(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    setDragging(index);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        width: '100%',
        height: initialSize,
      }}
    >
      {React.Children.map(children, (child, index) => (
        <React.Fragment key={index}>
          <DynamicTab
            sx={{
              flexGrow: ratios[index],
              flexBasis: 0,
              display: 'flex',
              overflow: 'hidden',
            }}
          >
            {child}
          </DynamicTab>
          {index < children.length - 1 && (
            <motion.div
              style={{
                cursor: isHorizontal ? 'col-resize' : 'row-resize',
                backgroundColor: dragging === index ? 'darkgray' : 'gray',
                width: isHorizontal ? '3px' : '100%',
                height: isHorizontal ? '100%' : '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: dragging === index ? 1 : 0,
                transition: 'background-color 0.2s ease',
              }}
              onMouseDown={handleMouseDown(index)}
              whileHover={{ backgroundColor: 'darkgray' }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default DynamicTabs;

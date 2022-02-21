import React, { FC } from 'react';
import { SplitPane } from 'react-collapse-pane';
import styles from './CollapsiblePane.module.scss';

const CollapsiblePane = ({
  orientation = 'vertical',
  collapseDirection = 'right',
  minSize = 0,
  hasTopGutter = false,
  children,
}) => (
  <SplitPane
    className={`${styles.pane} ${
      orientation === 'vertical' ? styles.vertical : styles.horizontal
    } ${hasTopGutter && styles.topGutter}`}
    split={orientation}
    dir="ltr"
    collapse={{ collapseDirection }}
    resizerOptions={{
      grabberSize: '1rem',
    }}
    minSizes={minSize}
  >
    {children}
  </SplitPane>
);

export default CollapsiblePane;

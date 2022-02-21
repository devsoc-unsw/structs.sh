import React, { FC } from 'react';
import { SplitPane } from 'react-collapse-pane';
import PropTypes from 'prop-types';
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

CollapsiblePane.propTypes = {
  orientation: PropTypes.string,
  collapseDirection: PropTypes.string,
  minSize: PropTypes.number,
  hasTopGutter: PropTypes.number,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default CollapsiblePane;

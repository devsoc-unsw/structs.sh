import React from 'react';
import { DataStructure, Documentation } from 'visualiser-src/common/typedefs';
import VisualiserController from 'visualiser-src/controller/VisualiserController';

export interface VisualiserContextValues {
  controller?: VisualiserController;
  topicTitle?: DataStructure;
  documentation?: Documentation;
  timeline?: {
    isTimelineComplete: boolean;
    handleTimelineUpdate: (val: string | number) => void;
  };
}

const VisualiserContext = React.createContext<VisualiserContextValues>({});

export default VisualiserContext;

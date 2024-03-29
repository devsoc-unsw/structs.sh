import React from 'react';
import { Documentation } from 'visualiser-src/common/typedefs';
import VisualiserController from 'visualiser-src/controller/VisualiserController';

interface VisualiserContextValues {
  controller?: VisualiserController;
  topicTitle?: string;
  documentation?: Documentation;
  timeline?: {
    isTimelineComplete: boolean;
    handleTimelineUpdate: (val: string | number) => void;
    isPlaying: boolean;
    handleUpdateIsPlaying: (val: boolean) => void;
  };
  codeSnippet?: {
    isCodeSnippetExpanded: boolean;
    handleSetCodeSnippetExpansion: (val: boolean) => void;
  };
}

const VisualiserContext = React.createContext<VisualiserContextValues>({});

export default VisualiserContext;

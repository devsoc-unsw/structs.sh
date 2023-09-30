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
  loadOptionsContext?: {
    isLoadOptionsExpanded: boolean;
    handleSetLoadOptionsExpansion: (val: boolean) => void;
<<<<<<< HEAD
  }
=======
  };
>>>>>>> 9664a69cb9210b8ac89d475b837fc4b5aac3b250
}

const VisualiserContext = React.createContext<VisualiserContextValues>({});

export default VisualiserContext;

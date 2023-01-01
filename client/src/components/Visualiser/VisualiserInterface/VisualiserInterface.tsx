import React, { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import { Box, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Documentation } from 'visualiser-src/common/typedefs';
import VisualiserController from 'visualiser-src/controller/VisualiserController';
import VisualiserContext from './VisualiserContext';
import Controls from './Controls';
import Operations from './Operations';
import CodeSnippet from './CodeSnippet';
import CreateMenu from './CreateMenu';
import TopicTree from './TopicTree';
import VisualiserCanvas from '../VisualiserCanvas';
import CodeEditor from './CodeEditor';
import Debugger from './Debugger';

interface VisualiserInterfaceProps {
  topicTitle: string;
}

/**
 * The component responsible for connecting the visualiser source code with the
 * React client.
 *   - Contains the controller and form.
 *   - Initialises the visualiser and 'puts' it onto the DOM. It relies on
 *     the corresponding <VisualiserCanvas /> component being there.
 *   - Defines a bunch of callbacks to that call visualiser methods and passes
 *     them off to the controller components (basically the play/pause buttons,
 *     sliders, etc.).
 */
const VisualiserInterface: React.FC<VisualiserInterfaceProps> = ({ topicTitle }) => {
  const topicTitleRef = useRef<string>();
  const controllerRef = useRef<VisualiserController>();
  const [isTimelineComplete, setIsTimelineComplete] = useState<boolean>(false);
  const [documentation, setDocumentation] = useState<Documentation>({});
  const [isCodeSnippetExpanded, setIsCodeSnippetExpanded] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const theme = useTheme();

  useEffect(() => {
    controllerRef.current = controllerRef.current || new VisualiserController();
    controllerRef.current.applyTopicTitle(topicTitle);
    topicTitleRef.current = topicTitle;
    setDocumentation(controllerRef.current.documentation);
    setIsCodeSnippetExpanded(false);
  }, [topicTitle]);

  const handleTimelineUpdate = useCallback((val) => {
    const timelineSlider = document.querySelector('#timelineSlider') as HTMLInputElement;
    timelineSlider.value = String(val);
    timelineSlider.style.background = `linear-gradient(to right, #39AF8E ${val}%, #aeabba ${val}%)`;
    setIsTimelineComplete(val >= 100);
  }, []);

  const handleSetCodeSnippetExpansion = useCallback((val) => {
    setIsCodeSnippetExpanded(val);
  }, []);

  const handleUpdateIsPlaying = useCallback((val) => {
    setIsPlaying(val);
  }, []);

  const contextValues = useMemo(
    () => ({
      controller: controllerRef.current,
      topicTitle: topicTitleRef.current,
      documentation,
      timeline: { isTimelineComplete, handleTimelineUpdate, isPlaying, handleUpdateIsPlaying },
      codeSnippet: { isCodeSnippetExpanded, handleSetCodeSnippetExpansion },
    }),
    [
      controllerRef.current,
      topicTitleRef.current,
      documentation,
      isTimelineComplete,
      handleTimelineUpdate,
      isPlaying,
      handleUpdateIsPlaying,
      isCodeSnippetExpanded,
      handleSetCodeSnippetExpansion,
    ]
  );

  return (
    <VisualiserContext.Provider value={contextValues}>
      <Box display="flex" height="100vh">
        <Box width="15vw">
          <TopicTree />
        </Box>
        {/* <Divider orientation="vertical" flexItem /> */}
        <Box width="85vw">
          <Box display="flex" height="45vh" bgcolor={theme.palette.background.default} width="100%">
            <CodeEditor />
            <Divider orientation="vertical" flexItem light />
            <Debugger />
          </Box>
          <VisualiserCanvas />
          <Controls />
        </Box>
      </Box>
      {/* <CreateMenu /> */}
      {/* <Operations /> */}
      <CodeSnippet />
      {/* <Controls /> */}
    </VisualiserContext.Provider>
  );
};

export default VisualiserInterface;

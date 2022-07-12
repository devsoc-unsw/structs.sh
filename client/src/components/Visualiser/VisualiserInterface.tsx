import { Box } from '@mui/material';
import React, { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import CodeSnippet from 'components/CodeSnippet/CodeSnippet';
import { Documentation } from 'visualiser-src/common/typedefs';
import VisualiserController from 'visualiser-src/controller/VisualiserController';
import { VisualiserControls } from './Controller';
import GUIMode from './Controller/GUIMode/GUIMode';
import styles from './VisualiserDashboard.module.scss';
import VisualiserContext from './VisualiserContext';

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
    setIsTimelineComplete(val >= 100);
  }, []);

  const handleSetCodeSnippetExpansion = useCallback((val) => {
    setIsCodeSnippetExpanded(val);
  }, []);

  const contextValues = useMemo(
    () => ({
      controller: controllerRef.current,
      topicTitle: topicTitleRef.current,
      documentation,
      timeline: { isTimelineComplete, handleTimelineUpdate },
      codeSnippet: { isCodeSnippetExpanded, handleSetCodeSnippetExpansion },
    }),
    [
      controllerRef.current,
      topicTitleRef.current,
      documentation,
      isTimelineComplete,
      handleTimelineUpdate,
      isCodeSnippetExpanded,
      handleSetCodeSnippetExpansion,
    ]
  );

  return (
    <VisualiserContext.Provider value={contextValues}>
      <GUIMode />
      <CodeSnippet />
      <VisualiserControls />
    </VisualiserContext.Provider>
  );
};

export default VisualiserInterface;

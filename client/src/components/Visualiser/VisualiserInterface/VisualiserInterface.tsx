import React, { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import { Documentation } from 'visualiser-src/common/typedefs';
import VisualiserController from 'visualiser-src/controller/VisualiserController';
import VisualiserContext from './VisualiserContext';
import Controls from './Controls';
import Operations from './Operations';
import CodeSnippet from './CodeSnippet';
import CreateMenu from './CreateMenu';
import { RecorderState } from '../VisualiserRecorder/RecorderState';

export const recorder : RecorderState = RecorderState.getInstance();

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
  
  /* Handles the upload of the SVG to a canvas
  which will be captured using canvas-record library
  */
  if (!isTimelineComplete && recorder.isRecording()) {
    recorder.record();
  } else if (isTimelineComplete && recorder.isRecording()) {
    recorder.stop();
  }
  
  return (
    <VisualiserContext.Provider value={contextValues}>
      <CreateMenu />
      <Operations />
      <CodeSnippet />
      <Controls />
    </VisualiserContext.Provider>
  );
};

export default VisualiserInterface;

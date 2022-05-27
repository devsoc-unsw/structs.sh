import { Box } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Notification from 'utils/Notification';
import CodeSnippet from 'components/CodeSnippet/CodeSnippet';
import { Pane } from 'components/Panes';
import { defaultSpeed } from 'visualiser-src/common/constants';
import { DataStructure, Documentation } from 'visualiser-src/common/typedefs';
import VisualiserController from 'visualiser-src/controller/VisualiserController';
import { VisualiserControls } from './Controller';
import GUIMode from './Controller/GUIMode/GUIMode';
import styles from './VisualiserDashboard.module.scss';
import VisualiserContext from './VisualiserContext';

interface VisualiserInterfaceProps {
  topicTitle: DataStructure;
}

/**
 * The component responsible for connecting the visualiser source code with the
 * React client.
 *   - Contains the controller, terminal and GUI form.
 *   - Initialises the visualiser and 'puts' it onto the DOM. It relies on
 *     the corresponding <VisualiserCanvas /> component being there.
 *   - Defines a bunch of callbacks to that call visualiser methods and passes
 *     them off to the controller components (basically the play/pause buttons,
 *     sliders, etc.).
 */
const VisualiserInterface: React.FC<VisualiserInterfaceProps> = ({ topicTitle }) => {
  const controllerRef = useRef<VisualiserController>(new VisualiserController());
  const [isTimelineComplete, setIsTimelineComplete] = useState<boolean>(false);
  const [documentation, setDocumentation] = useState<Documentation>({});

  useEffect(() => {
    controllerRef.current.applyTopicTitle(topicTitle);
    setDocumentation(controllerRef.current.documentation);
  }, [topicTitle]);

  const handleTimelineUpdate = useCallback((val) => {
    const timelineSlider = document.querySelector('#timelineSlider') as HTMLInputElement;
    timelineSlider.value = String(val);

    setIsTimelineComplete(val >= 100);
  }, []);

  return (
    <VisualiserContext.Provider
      value={{
        controller: controllerRef.current,
        topicTitle,
        documentation,
        timeline: { isTimelineComplete, handleTimelineUpdate },
      }}
    >
      <Box className={styles.interactor}>
        <VisualiserControls />
        <Pane orientation="vertical" minSize={150.9}>
          <GUIMode />
          <CodeSnippet />
        </Pane>
      </Box>
    </VisualiserContext.Provider>
  );
};

export default VisualiserInterface;

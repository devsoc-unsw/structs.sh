import { Box } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Notification from 'utils/Notification';
import CodeSnippet from 'components/CodeSnippet/CodeSnippet';
import { Pane } from 'components/Panes';
import { defaultSpeed } from 'visualiser-src/common/constants';
import { Documentation } from 'visualiser-src/common/typedefs';
import VisualiserController from 'visualiser-src/controller/VisualiserController';
import { VisualiserControls } from './Controller';
import GUIMode from './Controller/GUIMode/GUIMode';
import styles from './VisualiserDashboard.module.scss';

interface Props {
  topicTitle: string;
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
const VisualiserInterface: React.FC<Props> = ({ topicTitle }) => {
  const [timelineComplete, setTimelineComplete] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(defaultSpeed);
  const controller = useRef<VisualiserController>(new VisualiserController());
  const [documentation, setDocumentation] = useState<Documentation>({});
  /* ------------------------ Visualiser Initialisation ----------------------- */
  useEffect(() => {
    controller.current.applyTopicTitle(topicTitle);
    setDocumentation(controller.current.documentation);
  }, [topicTitle]);

  /* -------------------------- Visualiser Callbacks -------------------------- */

  const updateTimeline = useCallback((val) => {
    const timelineSlider = document.querySelector('#timelineSlider') as HTMLInputElement;
    timelineSlider.value = String(val);

    setTimelineComplete(val >= 100);
  }, []);

  const executeCommand = (command: string, args: string[]): string => controller.current.doOperation(command, updateTimeline, ...args);

  const handlePlay = useCallback(() => {
    controller.current.play();
  }, [controller]);

  const handlePause = useCallback(() => {
    controller.current.pause();
  }, [controller]);

  const handleStepForward = useCallback(() => {
    controller.current.stepForwards();
  }, [controller]);

  const handleStepBackward = useCallback(() => {
    controller.current.stepBackwards();
  }, [controller]);

  const dragTimeline = useCallback(
    (val: number) => {
      controller.current.seekPercent(val);
    },
    [controller]
  );

  const handleSpeedSliderDrag = useCallback(
    (val: number) => {
      controller.current.setSpeed(val);
      setSpeed(val);
    },
    [controller]
  );

  /* -------------------------------------------------------------------------- */

  return (
    <Box className={styles.interactor}>
      <VisualiserControls
        handlePlay={handlePlay}
        handlePause={handlePause}
        handleStepForward={handleStepForward}
        handleStepBackward={handleStepBackward}
        handleUpdateTimeline={updateTimeline}
        handleDragTimeline={dragTimeline}
        handleSpeedSliderDrag={handleSpeedSliderDrag}
        timelineComplete={timelineComplete}
        speed={speed}
      />
      <Pane orientation="vertical" minSize={150.9}>
        <GUIMode
          documentation={documentation}
          executeCommand={executeCommand}
          topicTitle={topicTitle}
        />
        <CodeSnippet />
      </Pane>
    </Box>
  );
};

export default VisualiserInterface;

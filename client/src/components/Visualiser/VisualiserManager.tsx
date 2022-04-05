import { Box } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Notification from 'utils/Notification';
import initLinkedListVisualiser from 'visualiser-src/linked-list-visualiser/initialiser';
import initBSTVisualiser from 'visualiser-src/binary-search-tree-visualiser/initialiser';
import CodeSnippet from 'components/CodeSnippet/CodeSnippet';
import { Pane } from 'components/Panes';
import { VisualiserController } from './Controller';
import GUIMode from './Controller/GUIMode/GUIMode';
import styles from './VisualiserDashboard.module.scss';
import getCommandExecutor from './executableCommands';

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
  const [speed, setSpeed] = useState<number>(0.6);
  const [terminalMode, setTerminalMode] = useState(true);

  const [visualiser, setVisualiser] = useState<any>({});

  /* ------------------------ Visualiser Initialisation ----------------------- */

  useEffect(() => {
    const normalisedTitle: string = topicTitle.toLowerCase();
    switch (normalisedTitle) {
      case 'linked lists':
        setVisualiser(initLinkedListVisualiser());
        break;
      case 'binary search trees':
        setVisualiser(initBSTVisualiser());
        break;
      case 'avl trees':
        // TODO: invoke the AVL tree visualiser initialiser instead of BST:
        setVisualiser(initBSTVisualiser());
        break;
      default:
        Notification.info(`Couldn't find a visualiser to load for '${topicTitle}'`);
    }
  }, [topicTitle]);

  /* -------------------------- Visualiser Callbacks -------------------------- */

  const updateTimeline = useCallback((val) => {
    const timelineSlider = document.querySelector('#timelineSlider') as HTMLInputElement;
    timelineSlider.value = String(val);

    setTimelineComplete(val >= 100);
  }, []);

  const executeCommand = useMemo(
    () => getCommandExecutor(topicTitle, visualiser, updateTimeline),
    [topicTitle, visualiser, updateTimeline]
  );

  const handlePlay = useCallback(() => {
    visualiser.play();
  }, [visualiser]);

  const handlePause = useCallback(() => {
    visualiser.pause();
  }, [visualiser]);

  const handleStepForward = useCallback(() => {
    visualiser.stepForward();
  }, [visualiser]);

  const handleStepBackward = useCallback(() => {
    visualiser.stepBack();
  }, [visualiser]);

  const dragTimeline = useCallback(
    (val: number) => {
      visualiser.setTimeline(val);
    },
    [visualiser]
  );

  const handleSpeedSliderDrag = useCallback(
    (val: number) => {
      visualiser.setSpeed(val);
      setSpeed(val);
    },
    [visualiser]
  );

  const handleSpeedSliderDragEnd = useCallback(() => {
    visualiser.onFinishSetSpeed();
  }, [visualiser]);

  /* -------------------------------------------------------------------------- */

  return (
    <Box className={styles.interactor}>
      <VisualiserController
        terminalMode={terminalMode}
        setTerminalMode={setTerminalMode}
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
        {/* terminalMode ? (
          <Terminal executeCommand={executeCommand} topicTitle={topicTitle} />
        ) : ( */}
        <GUIMode executeCommand={executeCommand} topicTitle={topicTitle} />
        <CodeSnippet />
      </Pane>
    </Box>
  );
};

export default VisualiserInterface;

import styles from 'styles/Timeline.module.css';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CircularProgress from '@mui/material/CircularProgress';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Fade } from '@mui/material';
import { useSocketCommunication } from '../../../Services/useSocketCommunication';
import { useFrontendStateStore } from '../../Store/frontendStateStore';
import { Button } from '../../../components/Button';
import Slider from '../../../components/Timeline/Slider';
import { useGlobalStore } from '../../Store/globalStateStore';
import { isInitialBackendState } from '../../Types/backendType';

const BUFFER_THRESHOLD = 30;
const Controls = () => {
  const { currFrame } = useGlobalStore();
  const { userAnnotation, parser } = useGlobalStore().visualizer;
  const { sendCode, bulkSendNextStates, getNextState } = useSocketCommunication();
  const { states, currentIndex, stepForward, stepBackward, jumpToState } = useFrontendStateStore();
  const { isActive } = useFrontendStateStore();

  const [loading, setLoading] = useState<boolean>(false);
  const bufferingRef = useRef<boolean>(false);
  const bufferModeRef = useRef<boolean>(false);

  const playToggle = () => {
    bufferModeRef.current = !bufferModeRef.current;
    setLoading(true);
  };

  const startBuffering = useCallback(async () => {
    if (bufferingRef.current) return;
    bufferingRef.current = true;
    setLoading(true);

    const result = await bulkSendNextStates(10);
    if (result === 0) {
      bufferModeRef.current = false;
    }

    setLoading(false);
    bufferingRef.current = false;
  }, []);

  useEffect(() => {
    if (!bufferModeRef.current) return;
    if (states.length - currentIndex < BUFFER_THRESHOLD && !bufferingRef.current) {
      startBuffering();
    }
  }, [currentIndex, states.length, startBuffering, loading]);

  const [autoNext, setAutoNext] = useState<boolean>(false);
  useEffect(() => {
    if (currFrame && !isInitialBackendState(currFrame) && userAnnotation) {
      const newParsedState = parser.parseState(currFrame, userAnnotation);
      useFrontendStateStore.getState().appendFrontendNewState(currFrame, newParsedState);

      if (autoNext === true) {
        stepForward();
        setAutoNext(false);
      }
    } else {
      let issue = 'something';
      if (!currFrame) {
        issue = 'backendState';
      } else if (!userAnnotation) {
        issue = 'localsAnnotations';
      }
      console.error(`Unable to parse backend state: ${issue} is undefined`);
    }
  }, [currFrame, userAnnotation]);

  return (
    <div className={styles.timeline}>
      <Button
        variant="primary"
        onClick={() => {
          bufferModeRef.current = false;
          bufferingRef.current = false;
          setLoading(false);
          sendCode();
        }}
      >
        Compile
      </Button>
      <Button disabled={!isActive} onClick={playToggle}>
        {loading ? (
          <Fade in={loading} timeout={500}>
            <CircularProgress size={24} />
          </Fade>
        ) : (
          <Fade in={!loading} timeout={500}>
            <PlayArrowIcon />
          </Fade>
        )}
      </Button>
      <Button
        disabled={!isActive || currentIndex === 0}
        onClick={() => {
          stepBackward();
        }}
      >
        <UndoIcon />
      </Button>
      <Button
        onClick={async () => {
          if (currentIndex === states.length - 1) {
            setAutoNext(true);
            await getNextState();
          } else {
            stepForward();
          }
        }}
      >
        <RedoIcon />
      </Button>
      <Slider
        max={states.length - 1}
        value={currentIndex}
        onChange={(event: Event, value: number) => jumpToState(value)}
        loading={loading}
      />
    </div>
  );
};

export default Controls;

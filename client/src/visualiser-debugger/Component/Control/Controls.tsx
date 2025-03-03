import styles from 'styles/Timeline.module.css';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useRef, useState } from 'react';
import { Fade } from '@mui/material';
import { handleCompileClicked } from 'visualiser-debugger/Store/onboardingStore';
import { useSocketCommunication } from '../../../Services/useSocketCommunication';
import { useFrontendStateStore } from '../../Store/frontendStateStore';
import { Button } from '../../../components/Button';
import Slider from '../../../components/Timeline/Slider';
import { useGlobalStore } from '../../Store/globalStateStore';
import { isInitialBackendState } from '../../Types/backendType';
import { DEFAULT_MESSAGE_DURATION, useToastStateStore } from '../../Store/toastStateStore';

const BUFFER_THRESHOLD = 30;
const Controls = () => {
  const { currFrame } = useGlobalStore();
  const { userAnnotation, parser } = useGlobalStore().visualizer;
  const { sendCode, bulkSendNextStates, getNextState } = useSocketCommunication();
  const { states, currentIndex, stepForward, stepBackward, jumpToState, isActive, setActive } =
    useFrontendStateStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [bufferMode, setBufferMode] = useState<boolean>(false);

  // Avoid race condition
  const bufferingRef = useRef<boolean>(false);
  const { setToastMessage: setMessage } = useToastStateStore();

  const playToggle = () => {
    setBufferMode((mode) => !mode);
  };

  const startBuffering = async (bufferSize: number) => {
    if (bufferingRef.current) return;
    bufferingRef.current = true;
    setLoading(true);

    setMessage({
      content: 'Buffer started.',
      colorTheme: 'warning',
      durationMs: DEFAULT_MESSAGE_DURATION,
    });

    await bulkSendNextStates(bufferSize);

    setMessage({
      content: 'Buffer completed.',
      colorTheme: 'info',
      durationMs: DEFAULT_MESSAGE_DURATION,
    });

    setLoading(false);
    setBufferMode(false);
    bufferingRef.current = false;
  };

  useEffect(() => {
    if (!isActive) {
      setBufferMode(false);
      setLoading(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (!bufferMode || bufferingRef.current) return;
    if (states.length - currentIndex < BUFFER_THRESHOLD) {
      startBuffering(BUFFER_THRESHOLD);
    } else {
      // There's no need to buffer at this point
      setMessage({
        content: 'Buffer completed.',
        colorTheme: 'info',
        durationMs: DEFAULT_MESSAGE_DURATION,
      });

      setBufferMode(false);
    }
  }, [bufferMode]);

  const [autoNext, setAutoNext] = useState<boolean>(false);
  useEffect(() => {
    if (isInitialBackendState(currFrame)) {
      return;
    }

    if (currFrame && userAnnotation) {
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
          setBufferMode(false);
          setLoading(false);
          sendCode();
          handleCompileClicked();
        }}
        className="Onboarding-compileButton"
      >
        Compile
      </Button>
      <Button disabled={!isActive} onClick={playToggle} className="Onboarding-playButton">
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
        disabled={!isActive}
        onClick={async () => {
          if (currentIndex === states.length - 1) {
            setActive(false);
            setAutoNext(true);
            await getNextState();
            setActive(true);
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
        onChange={(event: Event, value: number | number[], _activeThumb: number) => {
          if (typeof value !== 'number') return;

          jumpToState(value as number);
        }}
        loading={loading}
      />
    </div>
  );
};

export default Controls;

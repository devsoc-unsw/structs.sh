import styles from 'styles/Timeline.module.css';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ReplayIcon from '@mui/icons-material/Replay';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { useSocketCommunication } from '../../../Services/useSocketCommunication';
import { useFrontendStateStore } from '../../Store/frontendStateStore';
import { Button } from '../../../components/Button';
import Slider from '../../../components/Timeline/Slider';

const Controls = () => {
  const { sendCode, bulkSendNextStates, getNextState } = useSocketCommunication();
  const { states, currentIndex, stepForward, stepBackward, jumpToState } = useFrontendStateStore();
  const { isActive } = useFrontendStateStore();

  const playToggle = () => {
    bulkSendNextStates(10);
  };

  return (
    <div className={styles.timeline}>
      <Button variant="primary" onClick={sendCode}>
        Compile
      </Button>
      <Button disabled={!isActive} onClick={playToggle}>
        <PlayArrowIcon />
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
        onClick={() => {
          if (currentIndex === states.length - 1) {
            console.info('Triggered next state');
            getNextState();
          } else {
            stepForward();
          }
        }}
      >
        <RedoIcon />
      </Button>
      <Button
        disabled={!isActive}
        onClick={() => {
          jumpToState(currentIndex === states.length ? 0 : states.length);
        }}
      >
        {currentIndex === states.length ? <ReplayIcon /> : <SkipNextIcon />}
      </Button>
      <Slider
        max={states.length}
        value={currentIndex}
        onChange={([value]: number[]) => jumpToState(value)}
      />
    </div>
  );
};

export default Controls;

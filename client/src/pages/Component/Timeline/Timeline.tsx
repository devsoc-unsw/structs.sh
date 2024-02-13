import { PlayIcon, TrackNextIcon } from '@radix-ui/react-icons';
import MaterialIcon from 'components/MaterialIcon';
import styles from 'styles/Timeline.module.css';
import { Button } from 'components/Button';
import { useEffect, useState } from 'react';
import { useGlobalStore } from 'pages/Store/globalStateStore';
import Slider from './Slider';

const Timeline = ({
  frameCount,
  interval,
  onCompile,
  onGetNextState,
  bufferStates,
  onChange,
  isActive,
}: {
  frameCount: number;
  interval: number;
  onCompile: () => void;
  onGetNextState: () => void;
  bufferStates: () => void;
  onChange: (number) => void;
  isActive: boolean;
}) => {
  // const [frame, setFrame] = useState<number>(0);
  const [timer, setTimer] = useState(null);

  const { currIdx, visualiserStates, updateCurrState, numStates } = useGlobalStore();

  // useEffect(() => {
  //   onChange(frame);
  //   updateCurrState(frame);
  // }, [frame]);

  const handleSeek = ([value]: number[]) => {
    // setFrame(value);
    updateCurrState(value);
  };

  const pause = () => {
    setTimer((prevTimer) => {
      clearInterval(prevTimer);
      return null;
    });
  };

  const offsetFrame = (offset: number) => {
    // setFrame((prevFrame) => {
    //   let newFrame: number = prevFrame + offset;

    //   if (newFrame < 0) {
    //     newFrame = 0;
    //   }

    // if (newFrame >= frameCount - 1) {
    //   pause();
    // }

    //   if (newFrame >= frameCount) {
    //     newFrame = frameCount - 1;
    //   }

    //   return newFrame;
    // });
    if (currIdx + offset >= numStates()) {
      pause();
    }
    updateCurrState(currIdx + offset);
  };

  const handleTick = () => {
    offsetFrame(1);
  };

  const playToggle = () => {
    setTimer((prevTimer) => {
      if (!prevTimer) {
        handleTick();
        return setInterval(handleTick, interval);
      }
      clearInterval(prevTimer);
      return null;
    });
  };

  return (
    <div className={styles.timeline}>
      <Button variant="primary" onClick={onCompile}>
        Compile
      </Button>
      <Button disabled={!isActive} onClick={playToggle}>
        <MaterialIcon name={timer ? 'pause' : 'play_arrow'} />
      </Button>
      <Button
        disabled={!isActive || currIdx === 0}
        onClick={() => {
          offsetFrame(-1);
          pause();
        }}
      >
        <MaterialIcon name="undo" />
      </Button>
      <Button
        onClick={() => {
          offsetFrame(1);
          pause();
          // onGetNextState();
        }}
      >
        <MaterialIcon name="redo" />
      </Button>
      <Button
        disabled={!isActive}
        onClick={() => {
          updateCurrState(currIdx === numStates() ? 0 : numStates());
          pause();
        }}
      >
        <MaterialIcon name={currIdx === numStates() ? 'replay' : 'skip_next'} />
      </Button>
      <Slider max={numStates()} value={currIdx} onChange={handleSeek} />
      {/* <button type="button" onClick={sendCode} className={styles.Button}>
        <Refresh name="refresh" /> Reset
      </button> */}
    </div>
  );
};

export default Timeline;

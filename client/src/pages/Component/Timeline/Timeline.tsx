import { PlayIcon, TrackNextIcon } from '@radix-ui/react-icons';
import MaterialIcon from 'components/MaterialIcon';
import styles from 'styles/Timeline.module.css';
import { Button } from 'components/Button';
import { useEffect, useState } from 'react';
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
  const [frame, setFrame] = useState<number>(0);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    onChange(frame);
    console.log('frame changed, trigger useeffect');
  }, [frame]);

  const handleSeek = ([value]: number[]) => {
    setFrame(value);
  };

  const pause = () => {
    setTimer((prevTimer) => {
      clearInterval(prevTimer);
      return null;
    });
  };

  const offsetFrame = (offset: number) => {
    setFrame((prevFrame) => {
      let newFrame: number = prevFrame + offset;

      if (newFrame < 0) {
        newFrame = 0;
      }

      if (newFrame >= frameCount - 1) {
        pause();
      }

      if (newFrame >= frameCount) {
        newFrame = frameCount - 1;
      }

      console.log('frame offet by 1', newFrame);
      return newFrame;
    });
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
        disabled={!isActive || frame === 0}
        onClick={() => {
          offsetFrame(-1);
          pause();
        }}
      >
        <MaterialIcon name="undo" />
      </Button>
      <Button
        onClick={() => {
          onGetNextState();
          offsetFrame(1);
          pause();
        }}
      >
        <MaterialIcon name="redo" />
      </Button>
      <Button
        disabled={!isActive}
        onClick={() => {
          setFrame(frame === frameCount - 1 ? 0 : frameCount - 1);
          pause();
        }}
      >
        <MaterialIcon name={frame === frameCount - 1 ? 'replay' : 'skip_next'} />
      </Button>
      <Slider max={frameCount - 1} value={frame} onChange={handleSeek} />
      {/* <button type="button" onClick={sendCode} className={styles.Button}>
        <Refresh name="refresh" /> Reset
      </button> */}
    </div>
  );
};

export default Timeline;

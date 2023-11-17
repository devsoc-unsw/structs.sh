import { PlayIcon, TrackNextIcon } from '@radix-ui/react-icons';
import MaterialIcon from 'components/MaterialIcon';
import styles from 'styles/Timeline.module.css';
import Slider from './Slider';
import { Button } from 'components/Button';
import { useEffect, useState } from 'react';

const Timeline = ({
  frameCount,
  interval,
  onCompile,
  onChange,
  isActive,
}: {
  frameCount: number,
  interval: number,
  onCompile: () => void,
  onChange: (number) => void,
  isActive: boolean,
}) => {
  const [frame, setFrame] = useState(0);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    onChange(frame);
  }, [frame]);

  const handleSeek = ([value]: number[]) => {
    setFrame(value);
  }

  const offsetFrame = (offset: number) => {
    setFrame((frame) => {
      frame += offset;

      if (frame < 0) {
        frame = 0;
      }

      if (frame >= frameCount - 1) {
        pause();
      }

      if (frame >= frameCount) {
        frame = frameCount - 1;
      }

      return frame;
    });
  }

  const handleTick = () => {
    offsetFrame(1);
  }

  const playToggle = () => {
    setTimer((timer) => {
      if (!timer) {
        handleTick();
        return setInterval(handleTick, interval);
      } else {
        clearInterval(timer);
        return null;
      }
    })
  }

  const pause = () => {
    setTimer((timer) => {
      clearInterval(timer);
      return null;
    });
  }

  return (
    <div className={styles.timeline}>
      <Button variant="primary" onClick={onCompile}>
        Compile
      </Button>
      <Button disabled={!isActive} onClick={playToggle}>
        <MaterialIcon name={timer ? "pause" : "play_arrow"} />
      </Button>
      <Button disabled={!isActive || frame === 0} onClick={() => {
        offsetFrame(-1);
        pause();
      }}>
        <MaterialIcon name="undo" />
      </Button>
      <Button disabled={!isActive || frame === frameCount - 1} onClick={() => {
        offsetFrame(1);
        pause();
      }}>
        <MaterialIcon name="redo" />
      </Button>
      <Button disabled={!isActive} onClick={() => {
        setFrame(frame === frameCount - 1 ? 0 : frameCount - 1);
        pause();
      }}>
        <MaterialIcon name={frame === frameCount - 1 ? "replay" : "skip_next"} />
      </Button>
      <Slider max={frameCount - 1} value={frame} onChange={handleSeek} />
      {/* <button type="button" onClick={sendCode} className={styles.Button}>
        <Refresh name="refresh" /> Reset
      </button> */}
    </div>
  );
};

export default Timeline;

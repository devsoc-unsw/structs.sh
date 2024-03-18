/**
 * TODO: I remember we have a timeline do we?
 */
import { PlayIcon, TrackNextIcon } from '@radix-ui/react-icons';
import styles from 'styles/Controls.module.css';

const Controls = ({
  sendCode,
  getNextState,
  activeSession,
}: {
  sendCode: () => void;
  getNextState: () => void;
  activeSession: boolean;
}) => {
  return (
    <div className={styles.timeline}>
      <button type="button" onClick={sendCode} className={styles.Button}>
        <PlayIcon /> Compile
      </button>
      <button
        type="button"
        onClick={getNextState}
        className={styles.Button}
        disabled={!activeSession}
      >
        <TrackNextIcon /> Next
      </button>
    </div>
  );
};

export default Controls;

import { PlayIcon, TrackNextIcon } from '@radix-ui/react-icons';
import styles from 'styles/Controls.module.css';
import { useSocketCommunication } from '../../../Services/useSocketCommunication';
import { useFrontendStateStore } from '../../Store/frontendStateStore';

const Controls = () => {
  const { sendCode, getNextState } = useSocketCommunication();
  const { activeSession } = useFrontendStateStore();

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

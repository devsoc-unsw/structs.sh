/**
 * TODO: I remember we have a timeline do we?
 */
import { PlayIcon, TrackNextIcon } from '@radix-ui/react-icons';
import styles from 'styles/Controls.module.css';
import classNames from 'classnames';

const Controls = ({
  sendCode,
  getNextState,
  activeSession,
  handleCompileClick,
}: {
  sendCode: () => void;
  getNextState: () => void;
  activeSession: boolean;
  handleCompileClick: () => void;
}) => {
  const handleClick = () => {
    sendCode();
    handleCompileClick();
  };

  return (
    <div className={styles.timeline}>
      <button 
        type="button" 
        onClick={handleClick} 
        className={classNames('compileButton', styles.Button)}
      >
        <PlayIcon /> Compile
      </button>
      <button
        type="button"
        onClick={getNextState}
        className={classNames('nextButton', styles.Button)}
        disabled={!activeSession}
      >
        <TrackNextIcon /> Next
      </button>
    </div>
  );
};

export default Controls;

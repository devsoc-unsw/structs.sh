import styles from './Control.module.scss';
import PropTypes from 'prop-types';

const ProgressBar = ({ progress }) => {
    return (
        <div className={styles.progressBar}>
            <div className={styles.progress} style={{ width: `${progress}%` }}></div>
        </div>
    );
};

ProgressBar.propTypes = {
  progress: PropTypes.number
}

export default ProgressBar;

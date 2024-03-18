/**
 * TODO: this is incomplete, horrible code
 * Need huge refactor work
 */
import styles from './StackInspector.module.scss';

const StackInspector = () => {
  return (
    <div className={styles.stackInspector}>
      <div style={{ fontSize: 'small' }}>
        Note: This is so far just a placeholder, doesn&#39;t show actual stack data from the
        debugger yet.
      </div>
    </div>
  );
};

export default StackInspector;

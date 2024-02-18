/**
 * TODO: this is incomplete, horrible code
 * Need huge refactor work
 */
import React from 'react';
import styles from './StackInspector.module.scss';
import { useGlobalStore } from '../../Store/globalStateStore';

const StackInspector = () => {
  const { stackInspector: debuggerData }: { stackInspector: any } = useGlobalStore().visualizer;
  return (
    <div className={styles.stackInspector}>
      <div style={{ fontSize: 'small' }}>
        Note: This is so far just a placeholder, doesn&#39;t show actual stack data from the
        debugger yet.
      </div>
      {debuggerData.stack.map((stackFrame, idx) => (
        <div className={styles.frame} key={idx}>
          <div className={styles.frameHeader}>
            <code className={styles.function}>{stackFrame.callerLocation.function}()</code>{' '}
            <span className={styles.location}>
              @ {stackFrame.callerLocation.file}:{stackFrame.callerLocation.line}:
              {stackFrame.callerLocation.column}
            </span>
          </div>
          <dl>
            {stackFrame.locals.map((stackLocal) => (
              <>
                <dt>
                  <code className={styles.type}>{stackLocal.type}</code>
                  <code className={styles.name}>{stackLocal.name}</code>
                </dt>
                <dd>
                  <code className={styles.value}>{stackLocal.value}</code>
                </dd>
              </>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
};

export default StackInspector;

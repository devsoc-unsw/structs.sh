import React from "react";
import styles from "./StackInspector.module.scss";

function StackInspector({debuggerData}) {
  return (
    <>
      { debuggerData.stack.map((stackFrame) => (
        <div className={styles.frame}>
          <div className={styles.frameHeader}>
            <code className={styles.function}>{stackFrame.callerLocation.function}()</code> <span className={styles.location}>@ {stackFrame.callerLocation.file}:{stackFrame.callerLocation.line}:{stackFrame.callerLocation.column}</span>
          </div>
          <dl>
            { stackFrame.locals.map((stackLocal) => (
              <>
                <dt>
                  <code className={styles.type}>{stackLocal.type}</code>
                  <code className={styles.name}>{stackLocal.name}</code>
                </dt>
                <dd><code className={styles.value}>{stackLocal.value}</code></dd>
              </>
            ))}
          </dl>
        </div>
      ))}
    </>
  );
}

export default StackInspector;

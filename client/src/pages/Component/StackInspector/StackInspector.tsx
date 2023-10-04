import React from 'react';
import styles from './StackInspector.module.scss';
import {isStructTypeName, isPointerType, isArrayType} from '../../Types/backendType';
import { useGlobalStore } from '../../Store/globalStateStore';

const StackInspector = () => {
  const debuggerData = useGlobalStore().currFrame;
  // array of html divs each representing a local
  const localDivs = [];

  for (const [name, memoryValue] of Object.entries(debuggerData.stack_data)) {
    // NOTE: this processes the actual output of the debugger correctly, but
    // does not conform to the backend types (i.e. debugger is sending data in
    // slightly incorrect format at the moment)
    const typeName = memoryValue.typeName;
    var localValue;
    if (isStructTypeName(typeName)) {
      // todo: actually display these special cases
      localValue = "<struct>";
    } else if (isPointerType(typeName)) {
      localValue = "<pointer>";
    } else if (isArrayType(typeName)) {
      localValue = "<array>";
    } else {
      localValue = memoryValue.value;
    }
      
    localDivs.push({
      type: memoryValue.typeName,
      name: name,
      value: localValue
    });
  }

  console.log(localDivs);

  return (
    <div className={styles.stackInspector}>
      <div className={styles.frame}>
        <div className={styles.frameHeader}>
          <code className={styles.function}>{debuggerData.frame_info.function}()</code>{' '}
          <span className={styles.location}>
            @ {debuggerData.frame_info.file}:{debuggerData.frame_info.line_num}
          </span>
        </div>
        <dl>
          {localDivs.map((localDiv) => (
            <>
              <dt>
                <code className={styles.type}>{localDiv.type}</code>
                <code className={styles.name}>{localDiv.name}</code>
              </dt>
              <dd>
                <code className={styles.value}>{localDiv.value}</code>
              </dd>
            </>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default StackInspector;

import React from 'react';
import styles from './StackInspector.module.scss';
import {isStructTypeName, isPointerType, isArrayType} from '../../Types/backendType';
import { useGlobalStore } from '../../Store/globalStateStore';

const StackInspector = () => {
  const debuggerData = useGlobalStore().currFrame;
  // array of html divs each representing a local
  const localDivs = [];

  for (const [name, memoryValue] of Object.entries(debuggerData.stack_data)) {
    const typeName = memoryValue.typeName;
    var localValue;
    if (isStructTypeName(typeName)) {
      localValue = "struct";
    } else if (isPointerType(typeName)) {
      localValue = "pointer";
    } else if (isArrayType(typeName)) {
      localValue = "array";
    } else {
      localValue = memoryValue.value;
    }
      
    localDivs.push(
      <>
        <dt>
          <code className={styles.type}>{memoryValue.type.typeName}</code>
          <code className={styles.name}>{name}</code>
        </dt>
        <dd>
          <code className={styles.value}>{localValue}</code>
        </dd>
      </>
    );
  }

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
          {localDivs.join("\r\n")}
        </dl>
      </div>
    </div>
  );
};

export default StackInspector;

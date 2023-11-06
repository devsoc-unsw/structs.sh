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
    // char *[3];
    if (isStructTypeName(typeName)) {
      localValue = "<struct>";
    } else if (isPointerType(typeName)) {
      localValue = "<pointer>";
    } else if (/\[\d+\]$/.test(typeName)) {
      // localValue = "<array>";
      localValue = memoryValue.value;
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

  function defaultTemplate(localDiv) {
    return (
      <>
        <dt>
          <code>
            <span className={styles.type}>{localDiv.type}</span>&nbsp;
            <span className={styles.name}>{localDiv.name}</span>
          </code>
        </dt>
        <dd>
          <code className={styles.value}>{localDiv.value}</code>
        </dd>
      </>
    );
  }

  function arrayTemplate(localDiv) {
    const typeWords = localDiv.type.split(" ");
    var arrayLengthIndicator = typeWords.pop();
    var arrayType;
    if (arrayLengthIndicator[0] == '*') {
      // array of pointers
      // TODO: handle double pointers
      arrayLengthIndicator = arrayLengthIndicator.substring(1);
      arrayType = typeWords.join(" ") + " *";
    } else {
      // includes the trailing space
      arrayType = typeWords.join(" ") + " ";
    }
    return (
      <>
        <dt>
          <code>
            <span className={styles.type}>{arrayType}</span>
            <span className={styles.name}>{localDiv.name}</span>
            <span className={styles.type}>{arrayLengthIndicator}</span>
          </code>
        </dt>
        <dd>
          <code className={styles.value}>{localDiv.value}</code>
        </dd>
      </>
    );
  }
  
  function pointerTemplate(localDiv) {
    // NOTE: single pointers only
    const fixedType = localDiv.type.slice(0,-1);
    return (
      <>
        <dt>
          <code>
            <span className={styles.type}>{fixedType + " *"}</span>
            <span className={styles.name}>{localDiv.name}</span>
          </code>
        </dt>
        <dd >
          <code className={styles.value}>{localDiv.value}</code>
        </dd>
      </>
    );
  }
  
  function divMapper(localDiv) {
    if (/\[\d+\]$/.test(localDiv.type)) {
      return arrayTemplate(localDiv);
    } else if (isPointerType(localDiv.type)) {
      // todo: handle arrays of pointers
      return pointerTemplate(localDiv);
    } else {
      return defaultTemplate(localDiv);
    }
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
          {localDivs.map(divMapper)}
        </dl>
      </div>
    </div>
  );
};

export default StackInspector;

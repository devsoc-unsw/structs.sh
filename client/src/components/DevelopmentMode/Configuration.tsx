import { useState } from 'react';
import styles from 'styles/Configuration.module.css';
// import * as Select from '@radix-ui/react-select';

interface LinkedListAnnotations {
  nodeVariable: string;
  dataType: string; //TODO: custom types
  dataVariable: string;
  nextVariable: string;
}

const Configuration = () => {
  const [annotations, setAnnotations] = useState<LinkedListAnnotations>({
    nodeVariable: 'node',
    dataType: 'int',
    dataVariable: 'data',
    nextVariable: 'next',
  });

  const handleChangeNodeVariable = (newNodeVariable: string) => {
    console.log(newNodeVariable);
    setAnnotations((prevAnnotations: LinkedListAnnotations) => ({
      ...prevAnnotations,
      nodeVariable: newNodeVariable,
    }));
  };

  const handleChangeDataVariable = (newDataVariable: string) => {
    setAnnotations((prevAnnotations: LinkedListAnnotations) => ({
      ...prevAnnotations,
      dataVariable: newDataVariable,
    }));
  };

  const handleChangeNextVariable = (newNextVariable: string) => {
    setAnnotations((prevAnnotations: LinkedListAnnotations) => ({
      ...prevAnnotations,
      nextVariable: newNextVariable,
    }));
  };

  return (
    <>
      <pre>
        struct{' '}
        <input
          value={annotations.nodeVariable}
          onChange={(e) => handleChangeNodeVariable(e.target.value)}
          className={styles.annotatorInput}
        />
        {' {'} <br />
        {'    '} {annotations.dataType}{' '}
        <input
          value={annotations.dataVariable}
          onChange={(e) => handleChangeDataVariable(e.target.value)}
          className={styles.annotatorInput}
        />
        ; <br />
        {'    '} struct {annotations.nodeVariable} *
        <input
          value={annotations.nextVariable}
          onChange={(e) => handleChangeNextVariable(e.target.value)}
          className={styles.annotatorInput}
        />
        ; <br />
        {'}'};
      </pre>
    </>
  );
};

export default Configuration;

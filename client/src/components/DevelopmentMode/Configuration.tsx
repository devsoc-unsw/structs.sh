import { useState } from 'react';

const annotationString = `struct node {
    int data;
    struct node* next;
}`;
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
        <span
          contentEditable
          onInput={(e) => handleChangeNodeVariable(e.currentTarget.textContent)}
        >
          {annotations.nodeVariable}
        </span>{' '}
        {'{'} <br />
        {'    '} {annotations.dataType}{' '}
        <span
          contentEditable
          onInput={(e) => handleChangeDataVariable(e.currentTarget.textContent)}
        >
          {annotations.dataVariable}
        </span>
        ; <br />
        {'    '} struct {annotations.nodeVariable} *
        <span
          contentEditable
          onInput={(e) => handleChangeNextVariable(e.currentTarget.textContent)}
        >
          {annotations.nextVariable}
        </span>
        ; <br />
        {'}'};
      </pre>
    </>
  );
};

export default Configuration;

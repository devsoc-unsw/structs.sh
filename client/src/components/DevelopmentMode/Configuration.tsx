import * as RadioGroup from '@radix-ui/react-radio-group';
import ConfigurationSelect from './ConfigurationSelect';
import styles from 'styles/Configuration.module.css';
import { useState } from 'react';

interface NodeAnnotation {
  dataType: string;
  dataVariable: string;
  nextVariable: string;
}

const Configuration = ({ typeDeclarations }) => {
  const [currNodeVariable, setCurrNodeVariable] = useState('');
  const [nodeAnnotations, setNodeAnnotations] = useState<Record<string, NodeAnnotation>>({});

  const handleSelectNodeType = (newNodeVariable: string) => {
    setCurrNodeVariable(newNodeVariable);
    if (!(newNodeVariable in nodeAnnotations)) {
      const newNodeAnnotations = { ...nodeAnnotations };
      newNodeAnnotations[newNodeVariable] = {
        dataType: '',
        dataVariable: '',
        nextVariable: '',
      };
      setNodeAnnotations(newNodeAnnotations);
    }
  };

  const handleUpdateNodeAnnotation = (nodeVariable: string, newAnnotation: NodeAnnotation) => {
    const updatedNodeAnnotations = { ...nodeAnnotations };
    updatedNodeAnnotations[nodeVariable] = newAnnotation;
    setNodeAnnotations(updatedNodeAnnotations);
  };

  const handleUpdateNodeData = (
    nodeVariable: string,
    newNodeData: string,
    newNodeDataType: string
  ) => {
    handleUpdateNodeAnnotation(nodeVariable, {
      ...nodeAnnotations[nodeVariable],
      dataVariable: newNodeData,
      dataType: newNodeDataType,
    });
  };

  const handleUpdateNodeNext = (
    nodeVariable: string,
    newNodeNext: string,
    newNodeNextType: string
  ) => {
    handleUpdateNodeAnnotation(nodeVariable, {
      ...nodeAnnotations[nodeVariable],
      nextVariable: newNodeNext,
    });
  };

  const isSelfReferencing = (typeDeclaration) => {
    if (!('fields' in typeDeclaration)) {
      return false;
    }

    return (
      typeDeclaration.fields.length >= 2 &&
      typeDeclaration.fields.some((field) => field.type.includes(typeDeclaration.name))
    );
  };
  return (
    <div>
      <h4>Select Linked List Node</h4>
      <RadioGroup.Root
        className={styles.RadioGroupRoot}
        value={currNodeVariable}
        onValueChange={handleSelectNodeType}
      >
        {typeDeclarations.filter(isSelfReferencing).map((typeDeclaration, index: number) => (
          <div key={index}>
            <div className={styles.RadioGroupRow}>
              <RadioGroup.Item value={typeDeclaration.name} className={styles.RadioGroupItem}>
                <RadioGroup.Indicator className={styles.RadioGroupIndicator} />
              </RadioGroup.Item>
              <label className={styles.Label}>{typeDeclaration.name}</label>
            </div>

            <div className={styles.configuratorField}>
              <span>Node Data</span>
              <ConfigurationSelect
                type={typeDeclaration.name}
                fields={typeDeclaration.fields}
                handleUpdateAnnotation={handleUpdateNodeData}
              />
            </div>

            <div className={styles.configuratorField}>
              <span>Next Node</span>
              <ConfigurationSelect
                type={typeDeclaration.name}
                fields={typeDeclaration.fields.filter((field) =>
                  field.type.includes(typeDeclaration.name)
                )}
                handleUpdateAnnotation={handleUpdateNodeNext}
              />
            </div>
          </div>
        ))}
      </RadioGroup.Root>
    </div>
  );
};

export default Configuration;

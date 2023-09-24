import { useEffect, useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import SyntaxHighlighter from 'react-syntax-highlighter';
import styles from 'styles/Configuration.module.css';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
  StructType,
  isNativeTypeName,
  isStructTypeName,
  Name,
  NativeTypeName,
  PointerType,
  isPointerType,
} from 'pages/src/visualizer-component/types/backendType';
import { LinkedListAnnotation } from 'pages/src/visualizer-component/types/annotationType';
import ConfigurationSelect from './ConfigurationSelect';

type PossibleLinkedListAnnotation = {
  typeName: StructType['typeName'];
  possibleValues: {
    name: Name;
    typeName: NativeTypeName;
  }[];
  possibleNexts: {
    name: Name;
    typeName: PointerType['typeName'];
  }[];
};

const Configuration = ({
  typeDeclarations,
  sendLinkedListAnnotation,
}: {
  typeDeclarations: any;
  sendLinkedListAnnotation: (linkedListAnnotation: LinkedListAnnotation) => void;
}) => {
  const [currNodeVariable, setCurrNodeVariable] = useState('');
  const [nodeAnnotations, setNodeAnnotations] = useState<Record<string, LinkedListAnnotation>>({});
  const [possibleTypeDeclsForLinkedList, setPossibleTypeDeclsForLinkedList] = useState<
    PossibleLinkedListAnnotation[]
  >([]);

  useEffect(() => {
    const possibleTypeDecls = createPossibleLinkedListTypeDecls(typeDeclarations);
    setPossibleTypeDeclsForLinkedList(possibleTypeDecls);
    if (possibleTypeDecls.length > 0) {
      handleSelectNodeType(possibleTypeDecls[0].typeName);
    }
  }, [typeDeclarations]);

  const handleSelectNodeType = (newNodeVariable: string) => {
    setCurrNodeVariable(newNodeVariable);
    if (!(newNodeVariable in nodeAnnotations)) {
      const linkedListTypeDecl = possibleTypeDeclsForLinkedList.find(
        (typeDecl) => typeDecl.typeName === newNodeVariable
      );
      if (!linkedListTypeDecl) {
        return;
      }
      const newNodeAnnotations = { ...nodeAnnotations };
      newNodeAnnotations[newNodeVariable] = {
        typeName: linkedListTypeDecl.typeName,
        value: {
          name: linkedListTypeDecl.possibleValues[0].name,
          typeName: linkedListTypeDecl.possibleValues[0].typeName,
        },
        next: {
          name: linkedListTypeDecl.possibleNexts[0].name,
          typeName: linkedListTypeDecl.possibleNexts[0].typeName,
        },
      };
      setNodeAnnotations(newNodeAnnotations);
      sendLinkedListAnnotation(newNodeAnnotations[newNodeVariable] as LinkedListAnnotation);
    } else {
      sendLinkedListAnnotation(nodeAnnotations[newNodeVariable] as LinkedListAnnotation);
    }
  };

  const handleUpdateNodeAnnotation = (
    nodeVariable: string,
    newAnnotation: LinkedListAnnotation
  ) => {
    const updatedNodeAnnotations = { ...nodeAnnotations };
    updatedNodeAnnotations[nodeVariable] = newAnnotation;
    setNodeAnnotations(updatedNodeAnnotations);
    if (currNodeVariable === nodeVariable) {
      sendLinkedListAnnotation(updatedNodeAnnotations[currNodeVariable] as LinkedListAnnotation);
    }
  };

  const handleUpdateNodeData = (
    nodeVariable: string,
    newNodeData: string,
    newNodeDataType: string
  ) => {
    if (isNativeTypeName(newNodeDataType)) {
      handleUpdateNodeAnnotation(nodeVariable, {
        ...nodeAnnotations[nodeVariable],
        value: {
          typeName: newNodeDataType,
          name: newNodeData,
        },
      });
    }
  };

  const handleUpdateNodeNext = (
    nodeVariable: string,
    newNodeNext: string,
    newNodeNextType: string
  ) => {
    if (isPointerType(newNodeNextType) && isStructTypeName(newNodeNextType.slice(0, -1))) {
      handleUpdateNodeAnnotation(nodeVariable, {
        ...nodeAnnotations[nodeVariable],
        next: {
          typeName: newNodeNextType,
          name: newNodeNext,
        },
      });
    }
  };

  return (
    <div>
      <h4>Select Linked List Node</h4>
      <RadioGroup.Root
        className={styles.RadioGroupRoot}
        value={currNodeVariable}
        onValueChange={handleSelectNodeType}
      >
        {possibleTypeDeclsForLinkedList.map((typeDeclaration, index: number) => (
          <div key={index}>
            <div className={styles.RadioGroupRow}>
              <RadioGroup.Item value={typeDeclaration.typeName} className={styles.RadioGroupItem}>
                <RadioGroup.Indicator className={styles.RadioGroupIndicator} />
              </RadioGroup.Item>
              <label className={styles.Label}>
                <SyntaxHighlighter language="c" style={github}>
                  {typeDeclaration.typeName}
                </SyntaxHighlighter>
              </label>
            </div>

            <div className={styles.configuratorField}>
              <span>Node Data</span>
              <ConfigurationSelect
                type={typeDeclaration.typeName}
                fields={typeDeclaration.possibleValues}
                handleUpdateAnnotation={handleUpdateNodeData}
              />
            </div>

            <div className={styles.configuratorField}>
              <span>Next Node</span>
              <ConfigurationSelect
                type={typeDeclaration.typeName}
                fields={typeDeclaration.possibleNexts}
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

// TODO: create type for typeDeclarations received from backend
const createPossibleLinkedListTypeDecls = (typeDeclarations: any[]) => {
  const possibleTypeDecls: PossibleLinkedListAnnotation[] = [];
  for (const typeDecl of typeDeclarations) {
    if (!('fields' in typeDecl)) {
      continue;
    }

    const possibleTypeDecl: PossibleLinkedListAnnotation = {
      typeName: typeDecl.name,
      possibleValues: [],
      possibleNexts: [],
    };
    for (const field of typeDecl.fields) {
      if (isNativeTypeName(field.type)) {
        possibleTypeDecl.possibleValues.push({
          name: field.name,
          typeName: field.type,
        });
      }
      if (
        isPointerType(field.type) &&
        isStructTypeName(field.type.slice(0, -1)) &&
        field.type.includes(typeDecl.name)
      ) {
        possibleTypeDecl.possibleNexts.push({
          name: field.name,
          typeName: field.type,
        });
      }
    }

    if (possibleTypeDecl.possibleValues.length >= 1 && possibleTypeDecl.possibleNexts.length >= 1) {
      possibleTypeDecls.push(possibleTypeDecl);
    }
  }

  return possibleTypeDecls;
};

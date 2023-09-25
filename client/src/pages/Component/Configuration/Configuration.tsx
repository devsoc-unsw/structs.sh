import { useEffect, useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import SyntaxHighlighter from 'react-syntax-highlighter';
import styles from 'styles/Configuration.module.css';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useGlobalStore } from '../../Store/globalStateStore';
import ConfigurationSelect from './ConfigurationSelect';
import { LinkedListAnnotation, DataStructureType } from '../../Types/annotationType';
import {
  StructType,
  Name,
  NativeTypeName,
  PointerType,
  BackendTypeDeclaration,
  isStructTypeName,
  isNativeTypeName,
  isPointerType,
} from '../../Types/backendType';

export type PossibleLinkedListAnnotation = {
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

// TODO: create type for typeDeclarations received from backend
const createPossibleLinkedListTypeDecls = (typeDeclarations: BackendTypeDeclaration[]) => {
  const possibleTypeDecls: PossibleLinkedListAnnotation[] = [];
  // for (const typeDecl of typeDeclarations)
  typeDeclarations.forEach((typeDecl) => {
    if (!('fields' in typeDecl)) {
      return;
    }
    if (!isStructTypeName(typeDecl.typeName)) {
      return;
    }

    const possibleTypeDecl: PossibleLinkedListAnnotation = {
      typeName: typeDecl.typeName,
      possibleValues: [],
      possibleNexts: [],
    };
    typeDecl.fields.forEach((field) => {
      if (isNativeTypeName(field.typeName)) {
        possibleTypeDecl.possibleValues.push({
          name: field.name,
          typeName: field.typeName,
        });
      }
      if (
        isPointerType(field.typeName) &&
        isStructTypeName(field.typeName.slice(0, -1)) &&
        field.typeName.includes(typeDecl.typeName)
      ) {
        possibleTypeDecl.possibleNexts.push({
          name: field.name,
          typeName: field.typeName,
        });
      }
    });

    if (possibleTypeDecl.possibleValues.length >= 1 && possibleTypeDecl.possibleNexts.length >= 1) {
      possibleTypeDecls.push(possibleTypeDecl);
    }
  });

  return possibleTypeDecls;
};

const Configuration = ({ typeDeclarations }: { typeDeclarations: BackendTypeDeclaration[] }) => {
  const [currNodeVariable, setCurrNodeVariable] = useState('');
  const [nodeAnnotations, setNodeAnnotations] = useState<Record<string, LinkedListAnnotation>>({});
  const [possibleTypeDeclsForLinkedList, setPossibleTypeDeclsForLinkedList] = useState<
    PossibleLinkedListAnnotation[]
  >([]);
  const { updateUserAnnotation, visualizer } = useGlobalStore();

  useEffect(() => {
    const possibleTypeDecls = createPossibleLinkedListTypeDecls(typeDeclarations);
    setPossibleTypeDeclsForLinkedList(possibleTypeDecls);
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
        type: DataStructureType.LinkedList,
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
      updateUserAnnotation({
        stackAnnotation: visualizer.userAnnotation.stackAnnotation,
        typeAnnotation: {
          ...visualizer.userAnnotation.typeAnnotation,
          [newNodeAnnotations[newNodeVariable].typeName]: newNodeAnnotations[newNodeVariable],
        },
      });
    } else {
      updateUserAnnotation({
        stackAnnotation: visualizer.userAnnotation.stackAnnotation,
        typeAnnotation: {
          ...visualizer.userAnnotation.typeAnnotation,
          [nodeAnnotations[newNodeVariable].typeName]: nodeAnnotations[newNodeVariable],
        },
      });
    }
  };

  useEffect(() => {
    if (possibleTypeDeclsForLinkedList.length > 0) {
      handleSelectNodeType(possibleTypeDeclsForLinkedList[0].typeName);
    } else {
      console.log('No possible linked list type declarations found!');
    }
  }, [possibleTypeDeclsForLinkedList]);

  const handleUpdateNodeAnnotation = (
    nodeVariable: string,
    newAnnotation: LinkedListAnnotation
  ) => {
    const updatedNodeAnnotations = { ...nodeAnnotations };
    updatedNodeAnnotations[nodeVariable] = newAnnotation;
    setNodeAnnotations(updatedNodeAnnotations);
    if (currNodeVariable === nodeVariable) {
      updateUserAnnotation({
        stackAnnotation: visualizer.userAnnotation.stackAnnotation,
        typeAnnotation: {
          ...visualizer.userAnnotation.typeAnnotation,
          [newAnnotation.typeName]: newAnnotation,
        },
      });
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
              <span className={styles.Label}>
                <SyntaxHighlighter language="c" style={github}>
                  {typeDeclaration.typeName}
                </SyntaxHighlighter>
              </span>
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

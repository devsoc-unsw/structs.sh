import { useEffect, useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import styles from 'styles/Configuration.module.css';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { AnnotationComponent, AnnotationProp } from './AnnotationComponentBase';
import { LinkedListAnnotation, PossibleLinkedListAnnotation } from '../../../Types/annotationType';
import { useGlobalStore } from '../../../Store/globalStateStore';
import {
  BackendTypeDeclaration,
  isNativeTypeName,
  isPointerType,
  isStructTypeName,
} from '../../../Types/backendType';
import ConfigurationSelect from '../ConfigurationSelect';

const createPossibleLinkedListTypeDecl = (
  typeDecl: BackendTypeDeclaration
): PossibleLinkedListAnnotation | null => {
  if (!('fields' in typeDecl)) {
    return null;
  }
  if (!isStructTypeName(typeDecl.typeName)) {
    return null;
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
    return possibleTypeDecl;
  }

  return null;
};

export const LinkedListNodeAnnotation: AnnotationComponent = ({ backendType }: AnnotationProp) => {
  const [nodeAnnotations, setNodeAnnotations] = useState<Record<string, LinkedListAnnotation>>({});
  const [possibleTypeDeclForLinkedList, setPossibleTypeDeclForLinkedList] =
    useState<PossibleLinkedListAnnotation>(createPossibleLinkedListTypeDecl(backendType));
  const { updateUserAnnotation, visualizer } = useGlobalStore();

  useEffect(() => {
    const possibleTypeDecls = createPossibleLinkedListTypeDecl(backendType);
    setPossibleTypeDeclForLinkedList(possibleTypeDecls);

    console.log('debug', possibleTypeDecls);
  }, [backendType]);

  const handleUpdateNodeAnnotation = (
    nodeVariable: string,
    newAnnotation: LinkedListAnnotation
  ) => {
    const updatedNodeAnnotations = { ...nodeAnnotations };
    updatedNodeAnnotations[nodeVariable] = newAnnotation;
    setNodeAnnotations(updatedNodeAnnotations);

    updateUserAnnotation({
      stackAnnotation: visualizer.userAnnotation.stackAnnotation,
      typeAnnotation: {
        ...visualizer.userAnnotation.typeAnnotation,
        [newAnnotation.typeName]: newAnnotation,
      },
    });
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

  if (!possibleTypeDeclForLinkedList) {
    return (
      <div className={styles.configuratorField}>
        <span>
          <span className={styles.highlightError}>Error:</span> No possible{' '}
          <span className={styles.highlightLinkedList}>linked list</span> annotation can be made.
        </span>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '10px' }}>
      <RadioGroup.Root className={styles.RadioGroupRoot} value="Stub">
        <div className={styles.configuratorField}>
          <span>Node Data</span>
          <ConfigurationSelect
            type={possibleTypeDeclForLinkedList.typeName}
            fields={possibleTypeDeclForLinkedList.possibleValues}
            handleUpdateAnnotation={handleUpdateNodeData}
          />
        </div>

        <div className={styles.configuratorField}>
          <span>Next Node</span>
          <ConfigurationSelect
            type={possibleTypeDeclForLinkedList.typeName}
            fields={possibleTypeDeclForLinkedList.possibleNexts}
            handleUpdateAnnotation={handleUpdateNodeNext}
          />
        </div>
      </RadioGroup.Root>
    </div>
  );
};

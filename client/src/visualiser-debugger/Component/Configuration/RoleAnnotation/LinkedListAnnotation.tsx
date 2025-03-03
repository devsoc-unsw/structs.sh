import { useEffect, useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import styles from 'styles/Configuration.module.css';
import { AnnotationComponent, AnnotationProp } from './AnnotationComponentBase';
import {
  DataStructureType,
  LinkedListAnnotation,
  PossibleLinkedListAnnotation,
} from '../../../Types/annotationType';
import { useGlobalStore } from '../../../Store/globalStateStore';
import {
  BackendTypeDeclaration,
  isNativeTypeName,
  isPointerType,
  isStructTypeName,
} from '../../../Types/backendType';
import ConfigurationSelect from '../ConfigurationSelect';

export const createPossibleLinkedListTypeDecl = (
  typeDecl: BackendTypeDeclaration
): PossibleLinkedListAnnotation | null => {
  if (!typeDecl.fields) {
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
  const [possibleTypeDeclForLinkedList, setPossibleTypeDeclForLinkedList] =
    useState<PossibleLinkedListAnnotation | null>(createPossibleLinkedListTypeDecl(backendType));
  const { updateUserAnnotation, visualizer } = useGlobalStore();
  const [nodeAnnotation, setNodeAnnotation] = useState<LinkedListAnnotation | null>(null);
  const handleUpdateNodeAnnotation = (newAnnotation: LinkedListAnnotation) => {
    updateUserAnnotation({
      stackAnnotation: visualizer.userAnnotation.stackAnnotation,
      typeAnnotation: {
        ...visualizer.userAnnotation.typeAnnotation,
        [newAnnotation.typeName]: newAnnotation,
      },
    });
  };
  const handleLinkedNodeAnnotation = (
    possibleTypeAnnotation: PossibleLinkedListAnnotation | null
  ) => {
    if (possibleTypeAnnotation === null) return;
    const linkedNodeAnnotation: LinkedListAnnotation = {
      typeName: backendType.typeName as `struct ${string}`,
      type: DataStructureType.LinkedList,
      value: {
        name: possibleTypeAnnotation.possibleValues[0].name,
        typeName: possibleTypeAnnotation.possibleValues[0].typeName,
      },
      next: {
        name: possibleTypeAnnotation.possibleNexts[0].name,
        typeName: possibleTypeAnnotation.possibleNexts[0].typeName,
      },
    };
    setNodeAnnotation(linkedNodeAnnotation);
    handleUpdateNodeAnnotation(linkedNodeAnnotation);
  };

  useEffect(() => {
    handleLinkedNodeAnnotation(possibleTypeDeclForLinkedList);
  }, [possibleTypeDeclForLinkedList]);

  useEffect(() => {
    const possibleTypeDecls = createPossibleLinkedListTypeDecl(backendType);
    setPossibleTypeDeclForLinkedList(possibleTypeDecls);
  }, [backendType]);

  const handleUpdateNodeData = (newNodeData: string, newNodeDataType: string) => {
    if (nodeAnnotation && isNativeTypeName(newNodeDataType)) {
      const newAnnotation: LinkedListAnnotation = {
        ...nodeAnnotation,
        value: {
          name: newNodeData,
          typeName: newNodeDataType,
        },
      };
      handleUpdateNodeAnnotation(newAnnotation);
      setNodeAnnotation(newAnnotation);
    }
  };

  const handleUpdateNodeNext = (newNodeNext: string, newNodeNextType: string) => {
    if (
      nodeAnnotation &&
      isPointerType(newNodeNextType) &&
      isStructTypeName(newNodeNextType.slice(0, -1))
    ) {
      const newAnnotation: LinkedListAnnotation = {
        ...nodeAnnotation,
        next: {
          name: newNodeNext,
          typeName: newNodeNextType,
        },
      };
      handleUpdateNodeAnnotation(newAnnotation);
      setNodeAnnotation(newAnnotation);
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
    <div style={{ paddingTop: '10px', fontSize: '0.8rem' }}>
      <RadioGroup.Root className={styles.RadioGroupRoot} value="Stub">
        <div className={styles.configuratorField}>
          <span>Node Data</span>
          <ConfigurationSelect
            fields={possibleTypeDeclForLinkedList.possibleValues}
            handleUpdateAnnotation={handleUpdateNodeData}
          />
        </div>

        <div className={styles.configuratorField}>
          <span>Next Node</span>
          <ConfigurationSelect
            fields={possibleTypeDeclForLinkedList.possibleNexts}
            handleUpdateAnnotation={handleUpdateNodeNext}
          />
        </div>
      </RadioGroup.Root>
    </div>
  );
};

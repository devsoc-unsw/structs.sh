import { BackendTypeDeclaration, isNativeTypeName, isPointerType, isStructTypeName } from 'visualiser-debugger/Types/backendType';
import styles from 'styles/Configuration.module.css';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { BinaryTreeAnnotation, DataStructureType, PossibleBinaryTreeAnnotation } from '../../../Types/annotationType';
import { AnnotationComponent, AnnotationProp } from './AnnotationComponentBase';
import { useEffect, useState } from 'react';
import { useGlobalStore } from 'visualiser-debugger/Store/globalStateStore';
import ConfigurationSelect from '../ConfigurationSelect';

export const createPossibleTreeTypeDecl = (
    typeDecl: BackendTypeDeclaration
) : PossibleBinaryTreeAnnotation | null => {
    if (!('fields' in typeDecl)) {
        return null;
    }

    if (!isStructTypeName(typeDecl.typeName)) {
        return null;
    }

    const possibleTypeDecl: PossibleBinaryTreeAnnotation = {
        typeName: typeDecl.typeName,
        possibleValues: [],
        possibleLefts: [],
        possibleRights: [],
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
            field.name.includes('left')
        ) {
            possibleTypeDecl.possibleLefts.push({
                name: field.name,
                typeName: field.typeName,
            });
        }
        if (
            isPointerType(field.typeName) &&
            isStructTypeName(field.typeName.slice(0, -1)) &&
            field.name.includes('right')
        ) {
            possibleTypeDecl.possibleRights.push({
                name: field.name,
                typeName: field.typeName,
            });
        }
    });

    if (
        possibleTypeDecl.possibleValues.length >= 1 &&
        possibleTypeDecl.possibleLefts.length >= 1 &&
        possibleTypeDecl.possibleRights.length >= 1
    ) {
        return possibleTypeDecl;
    }
    return null;
}

export const TreeNodeAnnotation: AnnotationComponent = ({ backendType }: AnnotationProp) => {
    const [possibleTypeDeclForTree, setPossibleTypeDeclForTree] = 
        useState<PossibleBinaryTreeAnnotation>(createPossibleTreeTypeDecl(backendType));
    const { updateUserAnnotation, visualizer } = useGlobalStore();
    const [nodeAnnotation, setNodeAnnotation] = useState<BinaryTreeAnnotation>(null);
    const handleUpdateNodeAnnotation = (newAnnotation: BinaryTreeAnnotation) => {
        updateUserAnnotation({
            stackAnnotation: visualizer.userAnnotation.stackAnnotation,
            typeAnnotation: {
                ...visualizer.userAnnotation.typeAnnotation,
                [backendType.typeName]: newAnnotation,
            },
        });
    }
    const handleTreeNodeAnnotation = (possibleTypeAnnotation: PossibleBinaryTreeAnnotation) => {
        if (possibleTypeAnnotation === null) return;
        setPossibleTypeDeclForTree(possibleTypeAnnotation);
        const newAnnotation: BinaryTreeAnnotation = {
            typeName: backendType.typeName as `struct ${string}`,
            type: DataStructureType.BinaryTree,
            value: {
                name: possibleTypeAnnotation.possibleValues[0].name,
                typeName: possibleTypeAnnotation.possibleValues[0].typeName,
            },
            left: {
                name: possibleTypeAnnotation.possibleLefts[0].name,
                typeName: possibleTypeAnnotation.possibleLefts[0].typeName,
            },
            right: {
                name: possibleTypeAnnotation.possibleRights[0].name,
                typeName: possibleTypeAnnotation.possibleRights[0].typeName,
            },
            
        }
        setNodeAnnotation(newAnnotation);
        handleUpdateNodeAnnotation(newAnnotation);
    }

    useEffect(() => { 
        handleTreeNodeAnnotation(possibleTypeDeclForTree);  
    } , [possibleTypeDeclForTree]);

    useEffect(() => { 
        const possibleTypeDecls = createPossibleTreeTypeDecl(backendType);
        setPossibleTypeDeclForTree(possibleTypeDecls);
    }, [backendType]);

    const handleUpdateNodeData = (newNodeData: string, newNodeDataType: string) => {
        if (isNativeTypeName(newNodeDataType)) {
            const newAnnotation: BinaryTreeAnnotation = {
                ...nodeAnnotation,
                value: {
                    name: newNodeData,
                    typeName: newNodeDataType,
                },
            };
            setNodeAnnotation(newAnnotation);
            handleUpdateNodeAnnotation(newAnnotation);
        }
    };

    const handleUpdateLeftData = (newLeftData: string, newLeftDataType: string) => {
        if (isPointerType(newLeftDataType) && isStructTypeName(newLeftDataType.slice(0, -1))) {
            const newAnnotation: BinaryTreeAnnotation = {
                ...nodeAnnotation,
                left: {
                    name: newLeftData,
                    typeName: newLeftDataType,
                },
            };
            setNodeAnnotation(newAnnotation);
            handleUpdateNodeAnnotation(newAnnotation);
        }
    }

    const handleUpdateRightData = (newRightData: string, newRightDataType: string) => {
        if (isPointerType(newRightDataType) && isStructTypeName(newRightDataType.slice(0, -1))) {
            const newAnnotation: BinaryTreeAnnotation = {
                ...nodeAnnotation,
                right: {
                    name: newRightData,
                    typeName: newRightDataType,
                },
            };
            setNodeAnnotation(newAnnotation);
            handleUpdateNodeAnnotation(newAnnotation);
        }
    }

    if (!possibleTypeDeclForTree) {
        return (
            <div className={styles.configuratorField}>
              <span>
                <span className={styles.highlightError}>Error:</span> No possible{' '}
                {/* where is the styles.highlightLinkedList */}
                <span className={styles.highlightLinkedList}>binary tree</span> annotation can be made.
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
                fields={possibleTypeDeclForTree.possibleValues}
                handleUpdateAnnotation={handleUpdateNodeData}
              />
            </div>
    
            <div className={styles.configuratorField}>
              <span>Left Child</span>
              <ConfigurationSelect
                fields={possibleTypeDeclForTree.possibleLefts}
                handleUpdateAnnotation={handleUpdateLeftData}
              />
            </div>
            <div className={styles.configuratorField}>
                <span>Right Child</span>
                <ConfigurationSelect
                    fields={possibleTypeDeclForTree.possibleRights}
                    handleUpdateAnnotation={handleUpdateRightData}
                />
            </div>
          </RadioGroup.Root>
        </div>
      );
}
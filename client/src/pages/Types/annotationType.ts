import { StructType, Name, PointerType, MemoryValue, IntType, NativeTypeName } from './backendType';

export enum DataStructureType {
  LinkedList,
  BinaryTree,
}
export interface DataStructureAnnotationBase {
  typeName: NativeTypeName;
  type: DataStructureType;
}

/**
 * Mapping from standard linked list node structure to the user's own defined linked list node struct
 *
 * Annotate on type definition, used for heap data.
 */
export interface LinkedListAnnotation extends DataStructureAnnotationBase {
  typeName: StructType['typeName'];
  type: DataStructureType.LinkedList;
  value: {
    typeName: NativeTypeName;
    name: Name;
  };
  next: {
    // Condition: Must be self-referencing
    typeName: PointerType['typeName'];
    name: Name;
  };
}

export interface BinaryTreeAnnotation extends DataStructureAnnotationBase {
  typeName: StructType['typeName'];
  type: DataStructureType.BinaryTree;
  value: {
    typeName: NativeTypeName;
    name: Name;
  };
  left: {
    // Condition: Must be self-referencing
    typeName: PointerType['typeName'];
    name: Name;
  };
  right: {
    // Condition: Must be self-referencing
    typeName: PointerType['typeName'];
    name: Name;
  };
}

export type DataStructureAnnotationConcrete = LinkedListAnnotation | BinaryTreeAnnotation;

/**
 * Local element annotation. Used for stack data.
 */
export interface LocalAnnotationBase {
  typeName: NativeTypeName;
}

export interface LinkedListNodePointer extends LocalAnnotationBase {
  typeName: PointerType['typeName'];
  /**
   * name might be "curr", "next", "prev", etc
   */
}
export interface ArrayElementPointer extends LocalAnnotationBase {
  typeName: IntType['typeName'];
  /**
   * name might be "i", "j", etc
   */
}

export type LocalAnnotationConcrete = ArrayElementPointer | LinkedListNodePointer;

/**
 * Map from variable names to user annotations of that
 */
export interface UserAnnotation {
  stackAnnotation: { [name: Name]: LocalAnnotationConcrete };
  typeAnnotation: { [name: Name]: DataStructureAnnotationConcrete };
}

/**
 * Type guard to check if a memory value is a linked list node
 */
export const isLinkedListNode = (
  memoryValue: MemoryValue,
  linkedListAnnotation: LinkedListAnnotation
) => {
  return 'typeName' in memoryValue && memoryValue.typeName === linkedListAnnotation.typeName;
};

export const isTreeNode = (
  memoryValue: MemoryValue,
  binaryTreeAnnotation: BinaryTreeAnnotation
) => {
  return 'typeName' in memoryValue && memoryValue.typeName === binaryTreeAnnotation.typeName;
};

import {
  StructType,
  NativeType,
  Name,
  PointerType,
  MemoryValue,
  IntType,
  NativeTypeName,
} from './backendType';

export interface DataStructureAnnotation {
  typeName: NativeTypeName;
}

/**
 * Mapping from standard linked list node structure to the user's own defined linked list node struct
 */
export interface LinkedListAnnotation extends DataStructureAnnotation {
  typeName: StructType['typeName'];
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

export interface BinaryTreeAnnotation extends DataStructureAnnotation {
  typeName: StructType['typeName'];
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

export interface LocalAnnotation {
  typeName: NativeTypeName;
}

export interface LinkedListNodePointer extends LocalAnnotation {
  typeName: PointerType['typeName'];
  /**
   * name might be "curr", "next", "prev", etc
   */
}
export interface ArrayElementPointer extends LocalAnnotation {
  typeName: IntType['typeName'];
  /**
   * name might be "i", "j", etc
   */
}

/**
 * Map from variable names to user annotations of that
 */
export interface LocalsAnnotations {
  [name: Name]: LocalAnnotation;
}

export interface DataStructureAnnotations {
  [name: Name]: DataStructureAnnotation;
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

/*

export type PointerAnnotation = {
  varName: string;
};

export type AnnotationVariableConcrete = PointerAnnotation;

export interface EditorAnnotation {
  [name: string]: AnnotationVariableConcrete;
}

export interface EditorAnnotation {
  [name: string]: any;
}

*/

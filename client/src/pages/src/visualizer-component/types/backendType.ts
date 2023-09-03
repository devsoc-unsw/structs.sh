/**
 * Backend data structure definition
 */
export type Addr = `0x${string}`;
export enum CType {
  DOUBLE_LINED_LIST_NODE = 'struct doubly_list_node',
  SINGLE_LINED_LIST_NODE = 'struct node',
  INT = 'int',
  DOUBLE = 'double',
  CHAR = 'char',
  INT_ARRAY = 'int_array',
  DOUBLE_ARRAY = 'double_array',
  CHAR_ARRAY = 'char_array',
  INT_ARRAY_ARRAY = 'int_array_array',
  DOUBLE_ARRAY_ARRAY = 'double_array_array',
  CHAR_ARRAY_ARRAY = 'char_array_array',
}

export type DoublePointerVariable = {
  value: string;
  prev: Addr;
  next: Addr;
};

export type SinglePointerVariable = {
  value: string;
  next: Addr;
};
export type IntVariable = number;
export type DoubleVariable = number;
export type CharVariable = string;

export type BackendVariable =
  | DoublePointerVariable
  | SinglePointerVariable
  | IntVariable
  | DoubleVariable
  | CharVariable;

export type BackendArrayVariable =
  | BackendVariableBaseInt[]
  | BackendVariableBaseDouble[]
  | BackendVariableBaseChar[];

export type IsPointerType = true | false;
export interface BackendVariableBase {
  addr: Addr;
  data:
    | Addr
    | BackendVariable
    | BackendArrayVariable
    | BackendVariableBaseIntArray[]
    | BackendVariableBaseDoubleArray[]
    | BackendVariableBaseCharArray[];
  type: CType;
  is_pointer: IsPointerType;
}

export interface BackendVariablePointer extends BackendVariableBase {
  data: Addr;
  type: CType;
  is_pointer: true;
}

export interface BackendVariableBaseInt extends BackendVariableBase {
  data: IntVariable;
  type: CType.INT;
  is_pointer: false;
}

export interface BackendVariableBaseDouble extends BackendVariableBase {
  data: DoubleVariable;
  type: CType.DOUBLE;
  is_pointer: false;
}

export interface BackendVariableBaseChar extends BackendVariableBase {
  data: CharVariable;
  type: CType.CHAR;
  is_pointer: false;
}

export interface BackendVariableBaseDoubleLinkedList extends BackendVariableBase {
  data: DoublePointerVariable;
  type: CType.DOUBLE_LINED_LIST_NODE;
  is_pointer: false;
}

export interface BackendVariableBaseSingleLinkedList extends BackendVariableBase {
  data: SinglePointerVariable;
  type: CType.SINGLE_LINED_LIST_NODE;
  is_pointer: false;
}

export interface BackendVariableBase2DArray extends BackendVariableBase {}

export interface BackendVariableBaseIntArray extends BackendVariableBase {
  data: BackendVariableBaseInt[];
  type: CType.INT_ARRAY;
  is_pointer: false;
}

export interface BackendVariableBaseCharArray extends BackendVariableBase {
  data: BackendVariableBaseChar[];
  type: CType.CHAR_ARRAY;
  is_pointer: false;
}

export interface BackendVariableBaseDoubleArray extends BackendVariableBase {
  data: BackendVariableBaseDouble[];
  type: CType.DOUBLE_ARRAY;
  is_pointer: false;
}

export interface BackendVariableBaseInt2DArray extends BackendVariableBase {
  data: BackendVariableBaseIntArray[];
  type: CType.INT_ARRAY_ARRAY;
  is_pointer: false;
}

export interface BackendVariableBaseDouble2DArray extends BackendVariableBase2DArray {
  data: BackendVariableBaseDoubleArray[];
  type: CType.DOUBLE_ARRAY_ARRAY;
  is_pointer: false;
}

export interface BackendVariableBaseChar2DArray extends BackendVariableBase2DArray {
  data: BackendVariableBaseDoubleArray[];
  type: CType.CHAR_ARRAY_ARRAY;
  is_pointer: false;
}

export type BackendVariableNonPointerConcrete =
  | BackendVariableBaseInt
  | BackendVariableBaseDouble
  | BackendVariableBaseChar
  | BackendVariableBaseDoubleLinkedList
  | BackendVariableBaseSingleLinkedList
  | BackendVariableBaseIntArray
  | BackendVariableBaseDoubleArray
  | BackendVariableBaseCharArray
  | BackendVariableBaseInt2DArray
  | BackendVariableBaseDouble2DArray
  | BackendVariableBaseChar2DArray;

// data: 0X78
// size: 3
// 0x78, 0x7C, 0x80, 0x84
export interface BackendVariableBasePointer extends BackendVariableBase {
  data: Addr;
  type: CType;
  is_pointer: true;
  size: number;
}

export type BackendVariableConcrete = BackendVariablePointer | BackendVariableNonPointerConcrete;

export interface BackendState {
  heap: { [address: Addr]: BackendVariableConcrete };
  stack: { [varName: string]: BackendVariableConcrete };
}

export interface BackendUpdate {
  modified: {
    [address: Addr]: BackendVariableConcrete;
  };
  removed: Addr[];
}

/**
 * Code editor definition for user's own defined struct
 */
/*export type LinkedListAnnotation = {
  linkedListStruct: string;
  value: {
    type: 'int';
    name: 'cockatoo';
    isPointer: false;
  };
  next: {
    type: 'struct pigeon';
    name: 'magpie';
    isPointer: true;
  };
}*/

export type PointerAnnotation = {
  varName: string;
};

export type AnnotationVariableConcrete = PointerAnnotation;

export interface EditorAnnotation {
  [name: string]: AnnotationVariableConcrete;
}

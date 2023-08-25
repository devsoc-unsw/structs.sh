/**
 *  Frontend data structure definition
 */
export enum EntityType {
  NODE = 'node',
  EDGE = 'edge',
}

export interface BaseEntity {
  type: EntityType;
  uid: string;
}

export interface NodeEntity extends BaseEntity {
  uid: string;
  type: EntityType.NODE;

  title: string;
  colorHex: string;
  size: number;

  edges: string[];

  x: number;
  y: number;
}

export interface EdgeEntity extends BaseEntity {
  uid: string;
  type: EntityType.EDGE;

  /**
   * Edge entity can figure out it's position from the two node
   */
  from: string;
  to: string;

  label: string;
  colorHex: string;
}

export type EntityConcrete = NodeEntity | EdgeEntity;

export interface MindMapGraph {
  rootNode: NodeEntity;
  cacheEntity: {
    [uid: string]: EntityConcrete;
  };
}

export interface GenericGraph {
  nodes: NodeEntity[];
  edges: EdgeEntity[];

  cacheEntity: {
    [uid: string]: EntityConcrete;
  };
}

/**
 * Doubtful about assumption, linked list won't be linked list at sometime,
 * so how about we use a generic graph!!
 */
export type FrontendLinkedListGraph = GenericGraph;

/**
 * Backend data structure definition
 */
export type Addr = `0x${string}`;
export enum CType {
  DOUBLE_LINED_LIST_NODE = 'struct doubly_list_node',
  SINGLE_LINED_LIST_NODE = 'struct single_list_node',
  INT = 'int',
  DOUBLE = 'double',

  CHAR = 'char',
}

export type DoublePointerVariable = {
  data: string;
  prev: Addr;
  next: Addr;
};

export type SinglePointerVariable = {
  data: string;
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

export type IsPointerType = true | false;
export interface BackendVariableBase {
  data: Addr | BackendVariable;
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

export type BackendVariableNonPointerConcrete =
  | BackendVariableBaseInt
  | BackendVariableBaseDouble
  | BackendVariableBaseChar
  | BackendVariableBaseDoubleLinkedList
  | BackendVariableBaseSingleLinkedList;

export interface BackendVariableBasePointer extends BackendVariableBase {
  data: Addr;
  type: CType;
  is_pointer: true;
}

export type BackendVariableConcrete = BackendVariablePointer | BackendVariableNonPointerConcrete;

export interface BackendStructure {
  [address: Addr]: BackendVariableConcrete;
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
export type LinkedListType = {
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
};

export interface EditorAnnotation {
  [name: string]: LinkedListType;
}

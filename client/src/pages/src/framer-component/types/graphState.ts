/**
 *  Frontend data structure definition
 */  

/**
 * Definition of Graph State My man
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
    [uid: string]: EntityConcrete
  }
}

export interface GenericGraph {
  nodes: NodeEntity[];
  edges: EdgeEntity[];

  cacheEntity: {
    [uid: string]: EntityConcrete
  }
}

/**
 * Doubtful about assumption, linked list won't be linked list at sometime, 
 * so how about we use a generic graph!!
 */
export interface FrontendLinkedListGraph extends GenericGraph {
  head: NodeEntity;
}


/**
 * Backend data structure definition
 */
export type Addr = `0x${string}`;
export enum CType {
  DOUBLE_LINED_LIST_NODE = 'struct doubly_list_node',
  INT = 'int',
  DOUBLE = 'double',
  CHAR = 'char',
}

export type DoublePointerVariable = {
  data: string,
  prev: Addr,
  next: Addr,
}
export type IntVariable = number;
export type DoubleVariable = number;
export type CharVariable = string;

export type BackendVariable = 
  { type: CType.DOUBLE_LINED_LIST_NODE, data: DoublePointerVariable } |
  { type: CType.INT, data: IntVariable } |
  { type: CType.DOUBLE, data: DoubleVariable } |
  { type: CType.CHAR, data: CharVariable };

export interface BackendVariableBasePointer {
  data: Addr;
  type: CType;
  is_pointer: true;
}

export interface BackendVariableBaseNonPointer {
  data: BackendVariable;
  type: CType;
  is_pointer: false;
}
export type BackendVariableBase = BackendVariableBasePointer | BackendVariableBaseNonPointer;

export interface BackendStructure {
  [address: Addr]: BackendVariableBase;
}

export interface BackendUpdate {
  modified: {
    [address: Addr]: BackendVariableBase;
  },
  removed: Addr[];
}

export interface BackendLinkedListNode {
  nodeId: Addr;
  value: string | number | null;
  isPointer: boolean;
  next: Addr | null;
}

export interface BackendLinkedList {
  nodes: BackendLinkedListNode[];
}

export interface ParsedBackendLinkedListUpdate {
  modified: BackendLinkedListNode[];
  deleted: string[];
}

/**
 * Code editor definition for user's own defined struct
 */
export type LinkedListType = {
  linkedListStruct: string;
  value: {
    type: 'int',
    name: 'cockatoo',
    isPointer: false,
  },
  next: {
    type: 'struct pigeon',
    name: 'magpie',
    isPointer: true,
  },
}

export interface EditorAnnotation {
  [name: string]: LinkedListType;
}
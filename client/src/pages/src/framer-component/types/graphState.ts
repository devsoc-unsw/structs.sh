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
  /**
   * I think in our system, will have two layer
   * 1. Background layer, where node represent like this
   * 2. Drawable Layer, where the node contains it's own drawing functionality, and also the background node
   */
  uid: string;  
  type: EntityType.NODE;
  
  /**
   * It's own property
   */
  title: string;
  colorHex: string;
  size: number;

  /**
   * As the node in graph
   */
  edges: string[];

  /**
   * As well as position, generate frontend graph require some smart algo
   * but can be served without a brain
   */
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
export interface BackendLinkedListNode {
  nodeId: Addr;
  value: string | number | null;
  next: Addr | null;
}

export interface BackendLinkedList {
  nodes: BackendLinkedListNode[];
}
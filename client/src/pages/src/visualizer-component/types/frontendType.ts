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

export const INITIAL_GRAPH = {
  nodes: [],
  edges: [],
  cacheEntity: {},
};
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

import { EdgeEntity } from './Entity/edgeEntity';
import { NodeEntity } from './Entity/nodeEntity';
import { PointerEntity } from './Entity/pointerEntity';

export type EntityConcrete = NodeEntity | EdgeEntity | PointerEntity;

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
export interface FrontendLinkedListGraph extends GenericGraph {
  pointers: PointerEntity[];
}

export interface FrontendTreeGraph extends GenericGraph {
  pointers: PointerEntity[];
}

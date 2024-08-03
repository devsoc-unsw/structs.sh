import { EdgeEntity } from '../Component/Visualizer/Entities/BaseEntity/edgeEntity';
import { NodeEntity } from '../Component/Visualizer/Entities/BaseEntity/nodeEntity';
import { PointerEntity } from '../Component/Visualizer/Entities/BaseEntity/pointerEntity';

export type EntityConcrete = NodeEntity | EdgeEntity | PointerEntity;

export interface GenericGraph {
  nodes: NodeEntity[];
  edges: EdgeEntity[];

  cacheEntity: {
    [uid: string]: EntityConcrete;
  };
}

export const INITIAL_GRAPH: GenericGraph = {
  nodes: [],
  edges: [],
  cacheEntity: {},
};

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

export type FrontendState = GenericGraph;

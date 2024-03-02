import { BaseEntity, EntityType } from './baseEntity';

export const DEFAULT_NODE_SIZE = 50;
export interface NodeEntity extends BaseEntity {
  type: EntityType.NODE;

  label: string;
  size: number;

  // David's comment: Serve as a shortcut for Node entity to verify it's connection with edge
  // we can prob store this in global state. This will bring second source of truth we have to maintain
  edgeUids: string[];

  x: number;
  y: number;
}

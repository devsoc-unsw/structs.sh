import { BaseEntity, EntityType } from './baseEntity';

export const DEFAULT_NODE_SIZE = 50;
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

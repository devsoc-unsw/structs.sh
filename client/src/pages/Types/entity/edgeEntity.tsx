import { BaseEntity, EntityType } from './baseEntity';

export interface EdgeEntity extends BaseEntity {
  type: EntityType.EDGE;

  /**
   * Edge entity can figure out it's position from the two node
   */
  fromNodeUid: string;
  toNodeUid: string;

  label: string;
}

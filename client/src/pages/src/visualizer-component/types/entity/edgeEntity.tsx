import { BaseEntity, EntityType } from './baseEntity';

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

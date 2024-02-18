import { BaseEntity, EntityType } from './baseEntity';

export interface PointerEntity extends BaseEntity {
  type: EntityType.POINTER;

  label: string;
  attachedUid: string;
}

import { BaseEntity, EntityType } from "./baseEntity";

export interface PointerEntity extends BaseEntity {
  uid: string;
  type: EntityType.POINTER;

  varName: string;
  attachedUid: string;
}
export enum EntityType {
  NODE = 'node',
  EDGE = 'edge',
  POINTER = 'pointer',
}

export interface BaseEntity {
  type: EntityType;
  uid: string;
}

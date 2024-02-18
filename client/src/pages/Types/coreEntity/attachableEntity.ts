import { assertUnreachable } from '../../Component/Visualizer/util/util';
import { EntityType } from '../entity/baseEntity';
import { NodeEntity } from '../entity/nodeEntity';
import { EntityConcrete } from '../frontendType';
import { Circle, ShapeType } from '../geometry/geometry';

/**
 * Attachable Entity refers to the type of entity that has a shape without infers from other entity.
 * An example is NodeEntity
 */
export type AttachableEntity = NodeEntity;
export function getAttachableEntityShape(entity: AttachableEntity): Circle {
  switch (entity.type) {
    case EntityType.NODE:
      return {
        type: ShapeType.Circle,
        center: {
          x: entity.x,
          y: entity.y,
        },
        radius: entity.size,
      };
      break;
    default:
      assertUnreachable(entity.type);
  }
  throw new Error('Unreachable');
}

export function isAttachableEntity(entity: EntityConcrete): entity is AttachableEntity {
  switch (entity.type) {
    case EntityType.NODE:
      return true;
    case EntityType.EDGE:
    case EntityType.POINTER:
      return false;
    default:
      assertUnreachable(entity);
      return false;
  }
}

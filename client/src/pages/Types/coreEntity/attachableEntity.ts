import { assertUnreachable } from '../../Component/Visualizer/util/util';
import { EntityType } from '../entity/baseEntity';
import { NodeEntity } from '../entity/nodeEntity';
import { Circle, ShapeType } from '../geometry/geometry';

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

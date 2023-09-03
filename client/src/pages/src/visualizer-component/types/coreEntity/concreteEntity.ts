import { assertUnreachable } from "../../util/util";
import { EntityType } from "../entity/baseEntity";
import { NodeEntity } from "../entity/nodeEntity";
import { EntityConcrete } from "../frontendType";
import { AttachableEntity } from "./attachableEntity";

export function isAttachableEntity(entity: EntityConcrete): entity is AttachableEntity {
  switch (entity.type) {
    case EntityType.NODE:
      return true;
    case EntityType.EDGE:
    case EntityType.POINTER:
      return false;
    default:
      assertUnreachable(entity);
  }
}
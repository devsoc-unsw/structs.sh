import { EdgeEntity } from '../../../Types/Entity/edgeEntity';
import { NodeEntity } from '../../../Types/Entity/nodeEntity';
import { PointerEntity } from '../../../Types/Entity/pointerEntity';
import { EntityConcrete, GenericGraph } from '../../../Types/frontendType';

/**
 * I have no idea why this file exists
 */
interface TransitionDetails {
  type?: 'spring' | 'tween';
  delay?: number;
  duration?: number;
  ease?: [number, number, number, number] | string;
  bounce?: number;
}
interface AnimationVariants {
  opacity?: number;
  pathLength?: number;
  transition?: TransitionDetails;
}

export interface DrawAnimation {
  animate: (i: number) => AnimationVariants;
  exit: AnimationVariants;
  enter: AnimationVariants;
}

export interface DrawablePropBase {
  entity: EntityConcrete;
}

export interface NumberHook {
  val: number;
}
export type MotionCoord = {
  x: NumberHook;
  y: NumberHook;
};
export interface NodeProp extends DrawablePropBase {
  entity: NodeEntity;
  coord: MotionCoord;
}
export interface EdgeProp extends DrawablePropBase {
  entity: EdgeEntity;
  graph: GenericGraph;
  from: MotionCoord;
  to: MotionCoord;
}
export interface PointerProp extends DrawablePropBase {
  entity: PointerEntity;
  attachedEntity: NodeEntity;
  pos: MotionCoord;
}

export type DrawablePropConcrete = NodeProp | EdgeProp | PointerProp;

export type DrawableComponentBase<T extends DrawablePropConcrete> = React.ForwardRefRenderFunction<
  SVGSVGElement,
  T
>;

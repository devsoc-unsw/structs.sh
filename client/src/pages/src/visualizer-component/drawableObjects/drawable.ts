import { EdgeEntity, EntityConcrete, GenericGraph, NodeEntity } from '../types/frontendType';

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
export type DrawablePropConcrete = NodeProp | EdgeProp;

export type DrawableComponentBase<T extends DrawablePropConcrete> = React.ForwardRefRenderFunction<
  SVGSVGElement,
  T
>;

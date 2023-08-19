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

export interface NodeProp extends DrawablePropBase {
  entity: NodeEntity;
}
export interface EdgeProp extends DrawablePropBase {
  entity: EdgeEntity;
  graph: GenericGraph;
}
export type DrawablePropConcrete = NodeProp | EdgeProp;

export type DrawableComponentBase<T extends DrawablePropConcrete> = React.ForwardRefRenderFunction<
  SVGSVGElement,
  T
>;

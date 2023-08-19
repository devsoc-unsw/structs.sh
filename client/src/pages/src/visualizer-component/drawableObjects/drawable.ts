import { FrontendLinkedListGraph, GenericGraph } from '../types/graphState';

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
  graph: GenericGraph;
  uid: string;
}

export interface NodeProp extends DrawablePropBase {
  graph: FrontendLinkedListGraph;
  uid: string;
}
export type EdgeProp = NodeProp;
export type DrawablePropConcrete = NodeProp | EdgeProp;

export type DrawableComponentBase<T extends DrawablePropConcrete> = React.ForwardRefRenderFunction<
  SVGSVGElement,
  T
>;

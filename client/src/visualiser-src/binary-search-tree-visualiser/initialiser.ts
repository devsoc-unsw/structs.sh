import { SVG } from '@svgdotjs/svg.js';
import AnimationController from '../controller/AnimationController';
import { Visualiser } from '../typedefs';
import BST from './data-structure/GraphicalBST';
import BSTAnimationProducer from './animation-producer/BSTAnimationProducer';
import { CODE_CANVAS } from 'utils/constants';

// for documentation read: https://compclub.atlassian.net/wiki/spaces/S/pages/2150892071/Documentation#Visualiser-Docs%3A

export interface BSTVisualiser extends Visualiser {
  insert: (val: number, updateSlider: (val: number) => void) => void;
  rotateLeft: (val: number, updateSlider: (val: number) => void) => void;
  rotateRight: (val: number, updateSlider: (val: number) => void) => void;
  inorderTraversal: (updateSlider: (val: number) => void) => void;
  preorderTraversal: (updateSlider: (val: number) => void) => void;
  postorderTraversal: (updateSlider: (val: number) => void) => void;
}

const initialise = (): any => {
  const bst: BST = new BST();
  const controller: AnimationController = new AnimationController();

  SVG(CODE_CANVAS).clear();

  const insert = (val: number, updateSlider: (val: number) => void) => {
    controller.finish();
    const animationSequence: BSTAnimationProducer = bst.insert(val);
    controller.constructTimeline(animationSequence, updateSlider);
  };

  const rotateLeft = (val: number, updateSlider: (val: number) => void) => {
    controller.finish();
    const animationSequence: BSTAnimationProducer = bst.rotateLeft(val);
    controller.constructTimeline(animationSequence, updateSlider);
  };

  const rotateRight = (val: number, updateSlider: (val: number) => void) => {
    controller.finish();
    const animationSequence: BSTAnimationProducer = bst.rotateRight(val);
    controller.constructTimeline(animationSequence, updateSlider);
  };

  const inorderTraversal = (updateSlider: (val: number) => void) => {
    controller.finish();
    const animationSequence: BSTAnimationProducer = bst.inorderTraversal();
    controller.constructTimeline(animationSequence, updateSlider);
  };

  const preorderTraversal = (updateSlider: (val: number) => void) => {
    controller.finish();
    const animationSequence: BSTAnimationProducer = bst.preorderTraversal();
    controller.constructTimeline(animationSequence, updateSlider);
  };

  const postorderTraversal = (updateSlider: (val: number) => void) => {
    controller.finish();
    const animationSequence: BSTAnimationProducer = bst.postorderTraversal();
    controller.constructTimeline(animationSequence, updateSlider);
  };

  const play = () => {
    controller.play();
  };

  const pause = () => {
    controller.pause();
  };

  const setTimeline = (val: number) => {
    controller.seekPercent(val);
  };

  const setSpeed = (val: number) => {
    controller.setSpeed(val);
  };

  const stepBack = () => {
    controller.pause();
    controller.stepBackwards();
  };

  const stepForward = () => {
    controller.pause();
    controller.stepForwards();
  };

  return {
    insert,
    rotateLeft,
    rotateRight,
    inorderTraversal,
    preorderTraversal,
    postorderTraversal,
    play,
    pause,
    setTimeline,
    setSpeed,
    stepBack,
    stepForward,
  };
};

export default initialise;

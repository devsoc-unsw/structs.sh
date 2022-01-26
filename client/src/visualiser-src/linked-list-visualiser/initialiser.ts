import { Runner } from '@svgdotjs/svg.js';
import LinkedListController from '../controller/linkedListController';
import LinkedList from './data-structure/GraphicalLinkedList';
import { defaultSpeed } from './util/constants';

/**
 * Initialises the visualiser and binds event handlers to the controller UI.
 */
const initialiser = (): any => {
  const linkedList: LinkedList = new LinkedList();
  const animationController = new LinkedListController();
  animationController.setSpeed(defaultSpeed);

  const appendNode = (val: number, updateSlider: (val: number) => void): void => {
    animationController.finish();
    // Generating the steps of the animation
    const sequence: Runner[][] = linkedList.append(val);
    // Playing the animation
    animationController.runSequence(sequence, updateSlider);
  };

  const deleteNode = (index: number, updateSlider: (val: number) => void): void => {
    animationController.finish();

    const sequence: Runner[][] = linkedList.delete(index);

    animationController.runSequence(sequence, updateSlider);
  };

  const searchList = (val: number, updateSlider: (val: number) => void): void => {
    animationController.finish();

    const sequence: Runner[][] = linkedList.search(val);

    animationController.runSequence(sequence, updateSlider);
  };

  const insertNode = (val: number, index: number, updateSlider: (val: number) => void): void => {
    animationController.finish();

    const sequence: Runner[][] = linkedList.insert(val, index);

    animationController.runSequence(sequence, updateSlider);
  };

  const play = () => {
    animationController.play();
  };

  const pause = () => {
    animationController.pause();
  };

  const stepBack = () => {
    animationController.gotoPrevious();
  };

  const stepForward = () => {
    animationController.gotoNext();
  };

  const setTimeline = (val: number) => {
    animationController.pause();
    animationController.seekPercent(val);
  };

  const setSpeed = (val: number) => {
    animationController.freeze();
    animationController.setSpeed(val);
  };

  const onFinishSetSpeed = () => {
    if (!animationController.isPaused) animationController.play();
  };

  return {
    appendNode,
    deleteNode,
    searchList,
    insertNode,
    play,
    pause,
    stepBack,
    stepForward,
    setTimeline,
    setSpeed,
    onFinishSetSpeed,
  };

  // Grabbing references to form buttons and attaching event handlers to them
  // const appendButton = document.querySelector('#appendButton');
  // const deleteButton = document.querySelector('#deleteButton');
  // const searchButton = document.querySelector('#searchButton');
  // const playButton = document.querySelector('#playButton');
  // const pauseButton = document.querySelector('#pauseButton');
  // const insertButton = document.querySelector('#insertButton');
  // const previousButton = document.querySelector('#previousSequenceButton');
  // const nextButton = document.querySelector('#nextSequenceButton');
  // const slider = document.querySelector('#timeline-slider') as HTMLInputElement;
  // const speedSlider = document.querySelector('#speed-slider') as HTMLInputElement;

  // appendButton.addEventListener('click', handleAppendClick);
  // deleteButton.addEventListener('click', handleDeleteClick);
  // searchButton.addEventListener('click', handleSearchClick);
  // insertButton.addEventListener('click', handleInsertClick);
  // playButton.addEventListener('click', handlePlayClick);
  // pauseButton.addEventListener('click', handlePauseClick);
  // previousButton.addEventListener('click', handleSelectPrevious);
  // nextButton.addEventListener('click', handleSelectNext);
  // slider.addEventListener('input', handleSliderChange);
  // speedSlider.addEventListener('input', handleSpeedChange);
  // speedSlider.addEventListener('change', handleSpeedChangeComplete);
};

export default initialiser;

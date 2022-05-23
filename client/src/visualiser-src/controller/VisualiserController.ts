import { Timeline, Runner } from '@svgdotjs/svg.js';
import AnimationProducer from '../common/AnimationProducer';
import GraphicalDataStructure from 'visualiser-src/common/GraphicalDataStructure';
import { defaultSpeed } from '../common/constants';
import GraphicalDataStructureFactory from 'visualiser-src/common/GraphicalDataStructureFactory';
import { Documentation } from 'visualiser-src/common/typedefs';

class VisualiserController {
  private dataStructure: GraphicalDataStructure;
  private currentTimeline: Timeline = new Timeline().persist(true);
  private timelineDuration: number = 0;
  private timestamps: number[] = [];
  private speed: number = 1;
  private isStepMode: boolean = false;

  public constructor(topicTitle?: string) {
    this.setSpeed(defaultSpeed);
    if (topicTitle !== undefined) {
      this.applyTopicTitle(topicTitle);
    }
  }

  public getCurrentTimeline(): Timeline {
    return this.currentTimeline;
  }

  public constructTimeline(
    animationProducer: AnimationProducer,
    updateSlider: (val: number) => void
  ): void {
    this.resetTimeline(updateSlider);

    if (animationProducer.allRunners.length === 0) return;

    animationProducer.allRunners.forEach((runners) => {
      runners.forEach((runner) => {
        this.currentTimeline.schedule(runner, this.timelineDuration + 25, 'absolute');
      });
      const maxRunner = runners.reduce(
        (prev: Runner, curr: Runner) => (prev.duration() < curr.duration() ? curr : prev),
        runners[0]
      );
      maxRunner.after(() => {
        if (this.isStepMode) {
          this.currentTimeline.pause();
        }
      });
      this.timestamps.push(this.timelineDuration + 1);
      this.timelineDuration += runners[0].duration() + 25;
    });
    this.timestamps.push(this.timelineDuration);
    this.currentTimeline.play();
  }

  public resetTimeline(updateSlider: (val: number) => void) {
    this.currentTimeline = new Timeline().persist(true);
    this.currentTimeline.on('time', (e: CustomEvent) => {
      // avoid division by 0
      if (this.timelineDuration !== 0) {
        updateSlider((Math.min(e.detail, this.timelineDuration) / this.timelineDuration) * 100);
      }
    });
    this.isStepMode = false;
    this.currentTimeline.speed(this.speed);
    this.timestamps = [];
    this.timelineDuration = 0;
  }

  public play(): void {
    this.isStepMode = false;
    this.currentTimeline.play();
  }

  public pause(): void {
    this.currentTimeline.pause();
  }

  public seekPercent(position: number): void {
    const timeSeek: number = (position * this.timelineDuration) / 100;
    this.currentTimeline.time(timeSeek);
    if (this.isStepMode) {
      this.pause();
      this.isStepMode = false;
    }
  }

  public setSpeed(speed: number): void {
    // we need to keep a member variable since
    // a new timeline is created for each animation sequence,
    // so the speed would be reset to 1
    this.speed = speed;

    // incase we are setting the speed without doing another operation
    this.currentTimeline.speed(this.speed);
  }

  // Finish playing the timeline
  public finish(): void {
    this.currentTimeline.finish();
  }

  public stepBackwards(): void {
    this.pause();
    this.currentTimeline.time(this.computePrevTimestamp());
  }

  public stepForwards(): void {
    this.isStepMode = true;
    this.currentTimeline.play();
  }

  public applyTopicTitle(topicTitle: string) {
    this.dataStructure = GraphicalDataStructureFactory.create(topicTitle);
  }
  private getErrorMessageIfInvalidInput(command: string, args: string[]): string {
    const expectedArgs = this.dataStructure.documentation[command].args;
    if (args.length !== expectedArgs.length) {
      return `Invalid arguments. Please provide ${args.join(', ')}`;
    }

    if (args.includes('')) return 'Argument(s) missing';
    if (!args.every((value) => /^\d+$/.test(value)))
      return 'Argument(s) must be a positive integer';

    const valueIndex = expectedArgs.indexOf('value');

    if (valueIndex !== -1) {
      if (Number(args[valueIndex]) < 0 || Number(args[valueIndex]) > 999)
        return 'Value must be between 0 and 999';
    }

    return '';
  }

  public doOperation(
    command: string,
    updateSlider: (val: number) => void,
    ...args: string[]
  ): string {
    const errMessage = this.getErrorMessageIfInvalidInput(command, args);
    if (errMessage !== '') {
      return errMessage;
    }

    this.finish();
    const animationProducer = eval('this.dataStructure[command](...args.map(arg => Number(arg)))') as AnimationProducer;
    this.constructTimeline(animationProducer, updateSlider);
    return '';
  }

  public get documentation(): Documentation {
    return this.dataStructure?.documentation;
  }

  private computePrevTimestamp(): number {
    let prevTimestamp = 0;
    this.timestamps.forEach((timestamp) => {
      if (timestamp + 25 < this.currentTime) {
        prevTimestamp = timestamp;
      }
    });
    return prevTimestamp;
  }

  private get currentTime() {
    return Math.min(this.currentTimeline.time(), this.timelineDuration);
  }
}

export default VisualiserController;

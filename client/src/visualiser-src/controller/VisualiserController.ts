import { Timeline, Runner } from '@svgdotjs/svg.js';
import GraphicalDataStructure from 'visualiser-src/common/GraphicalDataStructure';
import GraphicalDataStructureFactory from 'visualiser-src/common/GraphicalDataStructureFactory';
import { Documentation } from 'visualiser-src/common/typedefs';
import { defaultSpeed } from '../common/constants';
import AnimationProducer from '../common/AnimationProducer';

interface TimeEvent extends Event {
  detail?: number;
}

class VisualiserController {
  private dataStructure?: GraphicalDataStructure;

  private topicTitle?: string;

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

  // Return data in form of integer array
  public get data(): number[] {
    return this.dataStructure?.data || [];
  }

  // Return the current topic/data structure
  public get topic(): string | null {
    return this.topicTitle || null;
  }

  // Set data structure to loaded data
  public loadData(data: number[]): void {
    this.resetDataStructure();
    this.dataStructure?.load(data);
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

    animationProducer.allRunners.forEach((runnerInfo) => {
      if (runnerInfo.runners.length === 0) return;
      runnerInfo.runners.forEach((runner) => {
        this.currentTimeline.schedule(runner, this.timelineDuration + 25, 'absolute');
      });
      const maxRunner = runnerInfo.runners.reduce(
        (prev: Runner, curr: Runner) => (prev.duration() < curr.duration() ? curr : prev),
        runnerInfo.runners[0]
      );
      this.timelineDuration += maxRunner.duration() + 25;
      if (runnerInfo.isTimestamped) {
        maxRunner.after(() => {
          if (this.isStepMode) {
            this.currentTimeline.pause();
          }
        });
        this.timestamps.push(this.timelineDuration + 1);
      }
    });
    this.timestamps.push(this.timelineDuration);
    this.currentTimeline.play();
  }

  public resetTimeline(updateSlider: (val: number) => void) {
    this.currentTimeline = new Timeline().persist(true);
    this.currentTimeline.on('time', (evt: TimeEvent) => {
      // avoid division by 0
      if (this.timelineDuration !== 0 && evt.detail) {
        updateSlider((Math.min(evt.detail, this.timelineDuration) / this.timelineDuration) * 100);
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
    this.currentTimeline.time(this.computePrevTimestamp());
  }

  public stepForwards(): void {
    this.isStepMode = true;
    this.currentTimeline.play();
  }

  public applyTopicTitle(topicTitle: string) {
    this.topicTitle = topicTitle;
    this.dataStructure = GraphicalDataStructureFactory.create(topicTitle);
    this.currentTimeline.finish();
    this.currentTimeline.time(0);
    this.currentTimeline = new Timeline().persist(true);
  }

  private getErrorMessageIfInvalidInput(command: string, args: string[]): string {
    if (!this.dataStructure) {
      return 'Invalid data structure';
    }
    const expectedArgs = this.dataStructure.documentation[command].args;
    if (args.length !== expectedArgs.length) {
      return `Invalid arguments. Please provide ${args.join(', ')}`;
    }
    if (args.includes('') || (expectedArgs.length > 0 && args.some((arg) => !arg.match(/\d/)))) {
      return 'Argument(s) missing';
    }
    if (
      !args.every((value, idx) =>
        expectedArgs[idx].endsWith('s')
          ? value
              .split(/,| /g)
              .filter((str) => str !== '')
              .every((el) => /^\d+$/.test(el))
          : /^\d+$/.test(value)
      )
    ) {
      return 'Argument(s) must be a positive integer';
    }
    let valueIndex = expectedArgs.indexOf('value');
    valueIndex = valueIndex === -1 ? expectedArgs.indexOf('values') : valueIndex;
    if (
      valueIndex !== -1 &&
      !args[valueIndex]
        .split(/,|\s+/g)
        .filter((str) => str !== '')
        .every((arg) => Number(arg) >= 0 && Number(arg) <= 99)
    ) {
      return 'Values must be between 0 and 99';
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
    // @ts-ignore
    const animationProducer: AnimationProducer = this.dataStructure[command](
      ...args.map((arg, idx) => {
        if (this.dataStructure?.documentation[command].args[idx].endsWith('s')) {
          return arg
            .split(/,| /g)
            .filter((str) => str !== '')
            .map((el) => Number(el));
        }
        return Number(arg);
      })
    );
    this.constructTimeline(animationProducer, updateSlider);
    return '';
  }

  public get documentation(): Documentation {
    return this.dataStructure?.documentation || {};
  }

  public resetDataStructure(): void {
    if (this.topicTitle) {
      this.dataStructure = GraphicalDataStructureFactory.create(this.topicTitle);
    }
    this.currentTimeline.finish();
    this.currentTimeline.time(0);
    this.currentTimeline = new Timeline().persist(true);
  }

  public generateDataStructure(): void {
    this.resetDataStructure();
    this.dataStructure?.generate();
  }

  private computePrevTimestamp(): number {
    const sortedTimestamps = [...this.timestamps].sort((x, y) => y - x);
    let prevTimestamp = 0;
    for (let i = 0; i < this.timestamps.length; i += 1) {
      if (sortedTimestamps[i] + 25 < this.currentTime) {
        prevTimestamp = sortedTimestamps[i];
        break;
      }
    }
    return prevTimestamp;
  }

  private get currentTime() {
    return Math.min(this.currentTimeline.time(), this.timelineDuration);
  }
}

export default VisualiserController;

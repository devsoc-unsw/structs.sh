import { Timeline, Runner } from '@svgdotjs/svg.js';
import AnimationProducer from '../common/AnimationProducer';
import { defaultSpeed } from '../common/constants';

class AnimationController {
  private currentTimeline: Timeline = new Timeline().persist(true);

  private timelineDuration: number = 0;

  private timestamps: number[] = [];

  private speed: number = 1;

  private isStepMode: boolean = false;

  public constructor() {
    this.setSpeed(defaultSpeed);
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

export default AnimationController;

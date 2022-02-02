import { Timeline } from '@svgdotjs/svg.js';
import AnimationProducer from '../common/AnimationProducer';

// controls todo:
// [x] play/pause
// [x] step to the next or previous timestamp in the current timeline
// [ ] run a sequence in step mode or sequential mode
// [ ] control to skip the animation of a sequence

// eventually this file should be placed in a folder common for all data structures,
// not just for the linked list
class AnimationController {
  private currentTimeline: Timeline = new Timeline().persist(true);

  private timelineDuration: number = 0;

  private timestamps: number[] = [];

  private speed: number = 1;

  private isStepMode: boolean = false;

  public getCurrentTimeline(): Timeline {
    return this.currentTimeline;
  }

  public constructTimeline(animationProducer: AnimationProducer, updateSlider: (val: number) => void) {
    this.resetTimeline(updateSlider);

    for (const runners of animationProducer.allRunners) {
      for (const runner of runners) {
        this.currentTimeline.schedule(runner, this.timelineDuration, 'absolute');
      }
      runners[0].after(() => {
        if (this.isStepMode) {
          this.currentTimeline.pause();
        }
      });
      this.timestamps.push(this.timelineDuration);
      this.timelineDuration += runners[0].duration();
    }
    this.timestamps.push(this.timelineDuration);
    this.currentTimeline.play();
  }

  public resetTimeline(updateSlider: (val: number) => void) {
    this.currentTimeline = new Timeline().persist(true);
    this.currentTimeline.on('time', (e: CustomEvent) => {
      updateSlider((e.detail / this.timelineDuration) * 100);
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

  // TODO: this isn't 100% working
  public stepForwards(): void {
    this.isStepMode = true;
    this.currentTimeline.play();
  }

  private computePrevTimestamp(): number {
    for (const timestamp of [...this.timestamps].reverse()) {
      if (timestamp + 25 < this.currentTime) {
        return timestamp;
      }
    }
    return 0;
  }

  private get currentTime() {
    return this.currentTimeline.time() > this.timelineDuration ? this.timelineDuration : this.currentTimeline.time();
  }
}

export default AnimationController;

import { Timeline } from '@svgdotjs/svg.js';
import AnimationProducer from "../common/AnimationProducer";

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
    private timelineSlider = document.querySelector('#timelineSlider') as HTMLInputElement;
    private speed: number = 1;
    
    public getCurrentTimeline(): Timeline {
        return this.currentTimeline;
    }

    public constructTimeline(animationProducer: AnimationProducer, updateSlider: (val: number) => void) {
        this.resetTimeline(updateSlider);

        for (const runners of animationProducer.allRunners) {
            for (const runner of runners) {
                this.currentTimeline.schedule(runner, this.timelineDuration, 'absolute');
            }
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

        this.currentTimeline.speed(this.speed);
        this.timestamps = [];
        this.timelineDuration = 0;
    }

    public play(): void {
        this.currentTimeline.play();
    }

    public pause(): void {
        this.currentTimeline.pause();
    }

    public seekPercent(position: number): void {
        const timeSeek: number = (position * this.timelineDuration) / 100;

        this.currentTimeline.time(timeSeek);
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

    // TODO: this isn't 100% working
    public stepForwards(): void {
        this.currentTimeline.time(this.computeNextTimestamp());
    }

    private computeNextTimestamp(): number {
        for (let timestamp of this.timestamps) {
            if (timestamp > this.currentTime) {
                return timestamp;
            }
        }
        return this.timelineDuration;
    }

    private computePrevTimestamp(): number {
        let prev = 0;
        for (let timestamp of this.timestamps) {
            if (prev < this.currentTime && timestamp >= this.currentTime) {
                return prev;
            }

            prev = timestamp;
        }

        return 0;
    }

    private get currentTime() {
        return Math.round(Number(this.timelineSlider.value) * (this.timelineDuration / 100));
    }
}

export default AnimationController;

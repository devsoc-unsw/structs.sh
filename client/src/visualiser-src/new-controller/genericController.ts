import { Timeline } from '@svgdotjs/svg.js';
import BSTAnimationProducer from '../binary-search-tree-visualiser/animation-producer/BSTAnimationProducer';

// controls todo:
// [x] play/pause
// [ ] step to the next or previous timestamp in the current timeline
// [ ] run a sequence in step mode or sequential mode
// [ ] control to skip the animation of a sequence

// eventually this file should be placed in a folder common for all data structures,
// not just for the linked list
class AnimationController {
    private currentTimeline: Timeline = new Timeline().persist(true);
    private timelineDuration: number = 0;
    private timestamps: number[] = [];
    private timestampsIndex: number = 0;
    private timelineSlider = document.querySelector('#timelineSlider') as HTMLInputElement;

    constructor() {
        this.timelineSlider.addEventListener('input', (e: Event) => {
            this.seekPercent(Number(this.timelineSlider.value));
        })
    }

    public getCurrentTimeline(): Timeline {
        return this.currentTimeline;
    }

    public constructTimeline(animationProducer: BSTAnimationProducer, updateSlider: (val: number) => void) {
        this.currentTimeline = new Timeline().persist(true);

        this.currentTimeline.on('time', (e: CustomEvent) => {
            this.timelineSlider.value = String((e.detail / this.timelineDuration) * 100);
        });

        this.timestamps = [];
        this.timelineDuration = 0;
        this.timestampsIndex = 0;

        for (const animationGroup of animationProducer.getAnimationSequence()) {
            for (const runner of animationGroup) {
                this.currentTimeline.schedule(runner, this.timelineDuration, 'absolute');
            }

            this.timelineDuration += animationGroup[0].duration();
        }

        this.currentTimeline.play();
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
        this.currentTimeline.speed(speed);
    }

    // Finish playing the timeline
    public finish(): void {
        this.currentTimeline.finish();
    }

    public stepBackwards(): void {
        if (this.timestampsIndex === 0) {
            return;
        }

        this.timestampsIndex--;
        this.currentTimeline.time(this.timestamps[this.timestampsIndex]);
    }

    // TODO: this isn't 100% working
    public stepForwards(): void {
        if (this.timestampsIndex === this.timestamps.length - 1) {
            return;
        }

        this.timestampsIndex++;
        this.currentTimeline.time(this.timestamps[this.timestampsIndex]);
    }
}

export default AnimationController;

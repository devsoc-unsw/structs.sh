import { Timeline, Runner } from '@svgdotjs/svg.js';
import { Animation } from '../binary-search-tree-visualiser/util/typedefs';

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
            this.seekPercent(Number(this.timelineSlider));
        })
    }

    public getCurrentTimeline(): Timeline {
        return this.currentTimeline;
    }

    public constructTimeline(animationSequence: Animation[], updateSlider: (val: number) => void) {
        this.currentTimeline = new Timeline().persist(true);
        this.timestamps = [];
        this.timelineDuration = 0;
        this.timestampsIndex = 0;

        for (let i = 0; i < animationSequence.length; i++) {
            const animation = animationSequence[i];
            const attrs = {};

            // TODO: handle special case attributes like dx, dy, etc
            for (const attr in animation.attrs) {
                attrs[attr] = animation.attrs[attr];
            }

            for (let target in animation.targets) {
                const runner: Runner = animation.targets[target]
                    .animate(animation.duration, animation.delay, 'after')
                    .attr(attrs);

                runner.during(() => {
                    // progress corresponds to how many ms have passed in the animation
                    const progress = runner.progress() * runner.duration();
                    // this.slider.value = String(
                    //     ((this.timestamps[i] + progress) / this.timelineDuration) * 100
                    // );
                    updateSlider(
                        Number(((this.timestamps[i] + progress) / this.timelineDuration) * 100)
                    );
                    // TODO: put this in the after() function instead
                    this.timestampsIndex = i;
                });

                this.currentTimeline.schedule(runner, this.timelineDuration, 'absolute');
            }

            if (!animation.simultaneous) {
                this.timestamps.push(this.timelineDuration);
                this.timelineDuration += animation.duration;
            }
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

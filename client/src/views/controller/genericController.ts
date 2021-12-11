import anime, { AnimeTimelineInstance } from 'animejs';
import { AnimationInstruction } from '../linked-list-visualiser/util/typedefs';
import { fastestDuration } from '../linked-list-visualiser/util/constants';
// controls todo:
// [x] play/pause
// [ ] step to the next or previous timestamp in the current timeline
// [ ] run a sequence in step mode or sequential mode
// [ ] control to skip the animation of a sequence

// eventually this file should be placed in a folder common for all data structures,
// not just for the linked list
class AnimationController {
    private currentTimeline: AnimeTimelineInstance = anime.timeline();
    private timelineHistory: AnimeTimelineInstance[] = [];
    private timelineIndex: number = 0;
    private _isPaused: boolean = false;

    public getCurrentTimeline(): AnimeTimelineInstance {
        return this.currentTimeline;
    }

    public play(): void {
        this._isPaused = false;
        this.currentTimeline.play();
    }

    public pause(): void {
        this._isPaused = true;
        this.currentTimeline.pause();
    }

    public get isPaused(): boolean {
        return this._isPaused;
    }

    public seekPercent(position: number): void {
        this.currentTimeline.seek(this.currentTimeline.duration * (position / 100));
    }

    // Finish playing the timeline
    public finish(): void {
        this.currentTimeline.seek(this.currentTimeline.duration);
    }

    // this function runs a sequence of animations sequentially
    public runSequence(sequence: AnimationInstruction[], slider: HTMLInputElement): void {
        console.log(this);
        this.currentTimeline = anime.timeline({
            duration: fastestDuration,
            easing: 'easeOutExpo',
            update: function (anim) {
                slider.value = String(anim.progress);
            },
        });

        for (const seq of sequence) {
            if ('offset' in seq) {
                this.currentTimeline.add(seq.instructions, seq.offset);
            } else {
                this.currentTimeline.add(seq.instructions);
            }
        }

        this.timelineHistory.push(this.currentTimeline);
        this.timelineIndex++;
    }

    public runNextSequence(): void {
        if (this.timelineIndex === this.timelineHistory.length - 1) {
            console.log('cant run next sequence');
        }
    }

    public setSpeed(speed: number): void {
        // `anime.speed` is a readonly property. The following comments prevents typescript from enforcing this rule.
        // Source: https://stackoverflow.com/questions/51145180/how-to-use-ts-ignore-for-a-block
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        anime.speed = speed;
    }

    public freeze(): void {
        this.currentTimeline.pause();
    }

    public gotoPrevious(): void {
        this.currentTimeline.pause();
        this.currentTimeline = this.timelineHistory[this.timelineIndex - 1];
        this.seekPercent(0);
        this.timelineIndex--;
        this.currentTimeline = this.timelineHistory[this.timelineIndex - 1];
        this.seekPercent(0);
    }

    public gotoNext(): void {
        if (this.timelineIndex === this.timelineHistory.length) return;
        this.currentTimeline.pause();
        this.currentTimeline = this.timelineHistory[this.timelineIndex - 1];
        this.seekPercent(100);
        this.timelineIndex++;
        this.currentTimeline = this.timelineHistory[this.timelineIndex - 1];
        this.seekPercent(100);
    }
}

export default AnimationController;

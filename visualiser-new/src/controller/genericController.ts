import anime, { AnimeTimelineInstance } from 'animejs';
import { Animation } from '../linked-list-visualiser/typedefs';

// controls todo:
// [x] play/pause
// [ ] step to the next or previous timestamp in the current timeline
// [ ] run a sequence in step mode or sequential mode
// [ ] control to skip the animation of a sequence

// eventually this file should be placed in a folder common for all data structures,
// not just for the linked list
class AnimationController {
    private _inputElement: HTMLInputElement;
    constructor() {
        this._inputElement = document.querySelector('#inputValue');
    }
    private currentTimeline: AnimeTimelineInstance = anime.timeline();
    private timelineHistory: AnimeTimelineInstance[] = [];
    private timelineIndex: number = 0;

    public get inputValue() {
        return Number(this._inputElement.value);
    }

    public getCurrentTimeline(): AnimeTimelineInstance {
        return this.currentTimeline;
    }
    public play(): void {
        this.currentTimeline.play();
    }

    public pause(): void {
        this.currentTimeline.pause();
    }

    public seek(position: number): void {
        this.currentTimeline.seek(this.currentTimeline.duration * (position / 100))
    }

    // Finish playing the timeline
    public finish(): void {
        this.currentTimeline.seek(this.currentTimeline.duration);
    }
    // this function runs a sequence of animations sequentially
    // when stepSequence = false or pauses the timeline after each animation finishes
    public runSequeuce(sequence: Animation[], slider: HTMLInputElement): void {
        console.log(this);
        this.currentTimeline = anime.timeline({
            duration: 700,
            easing: 'easeOutExpo',
            update: function(anim) {
                slider.value = String(anim.progress);
              }
        });

        for (const seq of sequence) {
            if ('offset' in seq) {
                this.currentTimeline.add(seq, seq.offset);
            } else {
                this.currentTimeline.add(seq);
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
}

export default AnimationController;

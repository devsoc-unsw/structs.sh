import { Timeline } from '@svgdotjs/svg.js';

// controls todo:
// [x] play/pause
// [ ] step to the next or previous timestamp in the current timeline
// [ ] run a sequence in step mode or sequential mode
// [ ] control to skip the animation of a sequence

// eventually this file should be placed in a folder common for all data structures,
// not just for the linked list
class AnimationController {
    private currentTimeline: Timeline = new Timeline();

    public getCurrentTimeline(): Timeline {
        return this.currentTimeline;
    }

    public setCurrentTimeline(timeline: Timeline) {
        this.currentTimeline = timeline;
    }

    public play(): void {
        this.currentTimeline.play();
    }

    public pause(): void {
        this.currentTimeline.pause();
    }

    public seekPercent(position: number): void {
        this.currentTimeline.time(100);
    }

    // Finish playing the timeline
    public finish(): void {
        this.currentTimeline.finish();
    }
}

export default AnimationController;
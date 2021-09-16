import anime from "animejs"

// controls todo:
// [x] play/pause
// [ ] step to the next or previous timestamp in the current timeline
// [ ] run a sequence in step mode or sequential mode
// [ ] control to skip the animation of a sequence

// eventually this file should be placed in a folder common for all data structures,
// not just for the linked list
class AnimationController {
    constructor() {
        this.currentTimeline = anime.timeline()
        this.timelineHistory = []
        this.stepMode = false
        this.timelineIndex = 0
    }

    play() {
        this.currentTimeline.play()
    }

    pause() {
        this.currentTimeline.pause()
    }

    // this function runs a sequence of animations sequentially
    // when stepSequence = false or pauses the timeline after each animation finishes
    runSequeuce(sequence) {
        this.currentTimeline = anime.timeline({
            duration: 700,
            easing: 'easeOutExpo'
        })

        for (const seq of sequence) {
            console.log(seq)
            if (this.stepMode) {
                seq.complete = this.currentTimeline.pause
            }

            this.currentTimeline.add(seq)
        }

        this.timelineHistory.push(this.currentTimeline)
        this.timelineIndex++
    }

    runNextSequence() {
        if (this.timelineIndex == this.timelineHistory.length - 1) {
            console.log("cant run next sequence")
        }
    }
}

export default AnimationController;
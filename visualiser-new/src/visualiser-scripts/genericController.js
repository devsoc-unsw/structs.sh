import anime from "animejs"

// eventually this file should be placed in a folder common for all data structures,
// not just for the linked list
class AnimationController {
    constructor() {
        this.currentTimeline = anime.timeline()
        this.timelineHistory = []
        this.stepSequence = false

        // holds an array of timestamps which correspond to spots in the timeline that we would want to step to
        this.timestamps = []
    }

    play() {
        this.currentTimeline.play()
    }

    pause() {
        this.currentTimeline.pause()
    }

    // this function runs a sequence of animations sequentially
    // when stepSequence = false or pauses the timeline when we encounter
    // an animation that marks that a specific segment of animations
    // have been done
    runSequeuce(sequence) {
        this.currentTimeline = anime.timeline({
            duration: 700,
            easing: 'easeOutExpo'
        })

        for (const seq of sequence) {
            this.currentTimeline.add(seq)
        }

        this.timelineHistory.push(this.currentTimeline)
    }
}

export default AnimationController;
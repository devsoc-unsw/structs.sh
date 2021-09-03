class Animation {
    constructor() {
        this.timeline = null;
    }

    get timeline() {
        return this._timeline;
    }

    set timeline(newTimeline) {
        this._timeline = newTimeline;
    }

    playAnimation() {
        this.timeline.play();
    }

    pauseAnimation() {
        this.timeline.pause();
    }

    restartAnimation() {
        this.timeline.restart();
    }

    finishAnimation() {
        this.timeline.seek(this.timeline.duration);
    }
}

export default Animation;

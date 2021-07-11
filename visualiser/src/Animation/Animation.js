class Animation {
    constructor() {
        this.timeline = null;
    }

    getAnimation() {
        return this.timeline;
    }

    playAnimation() {
        this.timeline.play();
    }


    pauseAnimation() {
        this.timeline.play();
    }

    restartAnimation() {
        this.timeline.restart();
    }

    finishAnimation() {
        this.timeline.seek(this.timeline.duration);
    }
}

export default Animation;

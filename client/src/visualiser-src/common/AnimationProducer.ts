import { Runner } from "@svgdotjs/svg.js";

export default abstract class AnimationProducer {
    private _allRunners: Runner[][] = [];

    public get allRunners() {
        return this._allRunners;
    }
}
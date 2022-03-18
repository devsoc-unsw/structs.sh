import { Runner } from '@svgdotjs/svg.js';

export default abstract class AnimationProducer {
  private _allRunners: Runner[][] = [];

  public get allRunners() {
    return this._allRunners;
  }

  public addAnimation(animation: Runner[]) {
    if (animation.length > 0) {
      this.allRunners.push(animation);
    }
  }
}

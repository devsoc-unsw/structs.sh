import { Runner } from '@svgdotjs/svg.js';

export default abstract class AnimationProducer {
  private _allRunners: Runner[][] = [];

  // this is the current sequence of runners,
  // which gets pushed to allRunners when we call complete.
  // animations which are pushed to this array are performed
  // simulateously with all other animations in this array
  private _currentSequence: Runner[] = [];

  public get allRunners() {
    return this._allRunners;
  }

  public get currentSequence() {
    return this._currentSequence;
  }

  public addSingleAnimation(animation: Runner): void {
    this._allRunners.push([animation]);
  }

  public addSequenceAnimation(animation: Runner): void {
    this.currentSequence.push(animation);
  }

  public finishSequence(): void {
    if (this.currentSequence.length > 0) {
      this.allRunners.push(this.currentSequence);
    }

    this._currentSequence = [];
  }
}

import { SVG, Runner } from '@svgdotjs/svg.js';
import { CodeLine } from './typedefs';
import { showLineNumbers, CODE_CANVAS, CODE_CONTAINER } from './constants';

interface RunnerInfo {
  runners: Runner[];
  isTimestamped: boolean;
}
export default abstract class AnimationProducer {
  private _allRunners: RunnerInfo[] = [];

  // this is the current sequence of runners,
  // which gets pushed to allRunners when we call complete.
  // animations which are pushed to this array are performed
  // simulateously with all other animations in this array
  private _currentSequence: Runner[] = [];

  private _codeTargets: CodeLine[] = [];

  private _highlightedLines: number[] = [];

  public get allRunners() {
    return this._allRunners;
  }

  public get currentSequence() {
    return this._currentSequence;
  }

  public get codeTargets() {
    return this._codeTargets;
  }

  public set codeTargets(value: CodeLine[]) {
    this._codeTargets = value;
  }

  public get highlightedLines() {
    return this._highlightedLines;
  }

  public set highlightedLines(value: number[]) {
    this._highlightedLines = value;
  }

  public renderCode(code: string): void {
    // clear the canvas
    SVG(CODE_CANVAS).clear();
    this.highlightedLines = [];
    this.codeTargets = [];

    const lines: string[] = code.split('\n');

    // TODO: find simple way to vertically center text in svg rectangle
    lines.forEach((line, i) => {
      const codeLine: CodeLine = {
        rectTarget: SVG()
          .rect(450, 18)
          .move(-5, 18 * i)
          .fill('#14113C')
          .addTo(CODE_CANVAS),
        textTarget: SVG()
          .text(showLineNumbers ? String(i + 1).padEnd(4, ' ') + line : line.trim())
          .font({ family: 'CodeText', size: 10 })
          .fill('#FFFFFF')
          .attr('style', 'white-space: pre-wrap')
          .move(0, 18 * i + 2)
          .x(showLineNumbers ? 0 : line.search(/\S/) * 5)
          .addTo(CODE_CANVAS),
      };

      this.codeTargets.push(codeLine);
    });
    this.setContainerHeight();
  }

  // with highlightCode and highlightCodeMultiple
  // we treat line numbers as starting from 1, so
  // substract 1 from each index
  public highlightCode(line: number): void {
    // unhighlight previously highlighted lines
    this.unhighlightCodeMultiple();

    this.addSequenceAnimation(
      this.codeTargets[line - 1].rectTarget.animate(1).attr({
        fill: '#39AF8E',
        rx: '10',
        ry: '10',
      })
    );

    this.highlightedLines = [line];
  }

  // these 2 functions are used to "decorate" animation function so each animation function doesn't
  // have to do code highlighting itself or push an animation sequence itself, which gives us more flexibility.
  // - fn: specifies an animation function and gets executed
  // - args: allows us to pass a variable amount of arguments which then get passed as arguments
  // to fn
  public doAnimationAndHighlight(line: number, fn: any, ...args: any[]): void {
    this.doAnimationAndHighlightTimestamp(line, true, fn, ...args);
  }

  public doAnimationAndHighlightTimestamp(
    line: number,
    isTimestamped: boolean,
    fn: any,
    ...args: any[]
  ): void {
    this.highlightCode(line);
    fn.apply(this, args);
    this.finishSequence(isTimestamped);
  }

  public doAnimation(fn: any, ...args: any[]): void {
    fn.apply(this, args);

    // make sure that the animation function finishes the sequence if it
    // produced simultaneous animations
    this.finishSequence();
  }

  public doAnimationWithoutTimestamp(fn: any, ...args: any[]) {
    fn.apply(this, args);
    this.finishSequence(false);
  }

  public unhighlightCodeMultiple(): void {
    this.highlightedLines.forEach((line) => {
      this.addSequenceAnimation(
        this.codeTargets[line - 1].rectTarget.animate(1).attr({
          fill: '#14113C',
        })
      );
    });
  }

  public addSingleAnimation(animation: Runner): void {
    this._allRunners.push({ runners: [animation], isTimestamped: true });
  }

  public addSequenceAnimation(animation: Runner): void {
    this.currentSequence.push(animation);
  }

  public finishSequence(isTimestamped: boolean = true): void {
    if (this.currentSequence.length > 0) {
      this.allRunners.push({ runners: this.currentSequence, isTimestamped });
    }

    this._currentSequence = [];
  }

  // Modifies the height of the code snippet container to be
  // responsive to the number of lines of code required for the operation
  private setContainerHeight(): void {
    const codeContainer = document.getElementById(CODE_CONTAINER);
    if (codeContainer) {
      codeContainer.style.height = `${18 * this.codeTargets.length}px`;
    }
  }
}

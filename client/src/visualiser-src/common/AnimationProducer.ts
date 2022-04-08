import { Runner, Container } from '@svgdotjs/svg.js';
import { CodeLine } from './typedefs';
import { showLineNumbers } from './constants';

export default abstract class AnimationProducer {
  private _allRunners: Runner[][] = [];

  // this is the current sequence of runners,
  // which gets pushed to allRunners when we call complete.
  // animations which are pushed to this array are performed
  // simulateously with all other animations in this array
  private _currentSequence: Runner[] = [];

  public codeCanvas: Container;

  // TODO: move to AnimationProducer later
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

  public get highlightedLines() {
    return this._highlightedLines;
  }

  public set codeTargets(value: CodeLine[]) {
    this._codeTargets = value;
  }

  public set highlightedLines(value: number[]) {
    this._highlightedLines = value;
  }

  public renderCode(code: string): void {
    console.log(code);
    const lines: string[] = code.split('\n');

    // TODO: find simple way to vertically center text in svg rectangle
    lines.forEach((line, i) => {
      console.log(line);
      const codeLine: CodeLine = {
        textTarget: this.codeCanvas
          .text(showLineNumbers ? String(i + 1).padEnd(4, ' ') + line : line)
          .font({ family: 'CodeText', size: 10 })
          .attr('style', 'white-space: pre-wrap')
          .move(0, 18 * i + 6),
        rectTarget: this.codeCanvas
          .rect(1000, 20)
          .move(0, 18 * i)
          .back()
          .fill('#ebebeb'),
      };

      this.codeTargets.push(codeLine);
    });
  }

  // with highlightCode and highlightCodeMultiple
  // we treat line numbers as starting from 1, so
  // substract 1 from each index
  public highlightCode(line: number): void {
    // unhighlight previously highlighted lines
    this.unhighlightCodeMultiple();

    this.addSequenceAnimation(
      this.codeTargets[line - 1].rectTarget.animate(1).attr({
        fill: '#4beb9b',
      })
    );

    this.highlightedLines = [line];

    this.finishSequence();
  }

  public highlightCodeMultiple(lines: number[]): void {
    // unhighlight previously highlighted lines
    this.unhighlightCodeMultiple();

    lines.forEach((line) => {
      this.addSequenceAnimation(
        this.codeTargets[line - 1].rectTarget.animate(1).attr({
          fill: '#4beb9b',
        })
      );
    });

    this.highlightedLines = lines;

    this.finishSequence();
  }

  public unhighlightCodeMultiple(): void {
    this.highlightedLines.forEach((line) => {
      this.addSequenceAnimation(
        this.codeTargets[line - 1].rectTarget.animate(1).attr({
          fill: '#ebebeb',
        })
      );
    });
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

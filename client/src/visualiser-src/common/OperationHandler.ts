import AnimationProducer from './AnimationProducer';
import VisualiserController from 'visualiser-src/controller/VisualiserController';
class OperationHandler {
  private visualiserController = new VisualiserController();
  public play() {
    this.visualiserController.play();
  }

  public pause() {
    this.visualiserController.pause();
  }

  public stepBack() {
    this.visualiserController.stepBackwards();
  }

  public stepForward() {
    this.visualiserController.stepForwards();
  }

  public setTimeline(val: number) {
    this.visualiserController.seekPercent(val);
  }

  public setSpeed(val: number) {
    this.visualiserController.setSpeed(val);
  }

  public doOperation(command: string, updateSlider: (val: number) => void, ...args: number[]) {
    this.visualiserController.finish();
    const animationProducer = eval('this[command](...args)') as AnimationProducer;
    this.visualiserController.constructTimeline(animationProducer, updateSlider);
  }
}

export default OperationHandler;

import AnimationController from "./genericController";

class LinkedListController extends AnimationController {
  private _inputElement: HTMLInputElement;
  constructor() {
    super();
    this._inputElement = document.querySelector('#inputValue');
  }

  public get inputValue(): number {
      return Number(this._inputElement.value);
  }
}

export default LinkedListController;
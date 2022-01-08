import AnimationController from "./genericController";

class LinkedListController extends AnimationController {
  private _inputElement: HTMLInputElement;
  private _altInputElement: HTMLInputElement;
  constructor() {
    super();
    this._inputElement = document.querySelector('#inputValue');
    this._altInputElement = document.querySelector('#altInputValue');
  }

  public get inputValue(): number {
    return Number(this._inputElement.value);
  }

  public get altInputValue(): number {
    return Number(this._altInputElement.value);
  }
}

export default LinkedListController;
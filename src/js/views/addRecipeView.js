import View from './View';

class AddRecipeView extends View {
  _parentEL = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  _message = `Recipe was successfully uploaded`;

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  // Always import code in controller
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  // Always import code in controller
  _addHandlerHideWindow() {
    [this._btnClose, this._overlay].forEach(el =>
      el.addEventListener('click', this.toggleWindow.bind(this))
    );
  }

  addHandlerUpload(subscriberFct) {
    this._parentEL.addEventListener('submit', e => {
      e.preventDefault();

      // access to form data - we pass a form element - "this._parentEl"
      const dataArray = [...new FormData(this._parentEL)];
      // convert entries to object ['a', '12'] => {a: 12}
      const data = Object.fromEntries(dataArray);
      subscriberFct(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();

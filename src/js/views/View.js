import icons from 'url:../../img/icons.svg'; // Parcel 2
import { ERROR_MSG } from '../config';

export default class View {
  _data;
  _errorMessage = ERROR_MSG;

  /**
   * Render object to the DOM
   * @param {Object | Object[]} data The data to be render
   * @param {boolean} [render=true] If false create markup string instead rendering to the DOM
   *
   * @returns {undefined | string} A markup is return if render = false
   * @this {Object} View Instance
   * @author Daniel
   * @todo remove console log
   */
  render(data, render = true) {
    // Guard Clause
    if (!data || (Array.isArray(data) && !data.length))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentEL.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // Virtual DOM : New DOM, convert the string in real DOM objects - Virtual DOM
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // Select all elements of new DOM
    const newElements = Array.from(newDOM.querySelectorAll('*')); // node list - converted to Array
    // Select current elements
    const currentElements = Array.from(this._parentEL.querySelectorAll('*'));

    // Compare two DOM - iterate two arrays same time
    newElements.forEach((newEl, i) => {
      const currentEL = currentElements[i];

      // Method compare two nodes and elements that are actually text
      // Code executed only on Elements that contain text
      if (
        !newEl.isEqualNode(currentEL) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        currentEL.textContent = newEl.textContent;
      }

      // Update change Attributes
      if (!newEl.isEqualNode(currentEL)) {
        // loop over attributes
        Array.from(newEl.attributes).forEach(attr =>
          currentEL.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentEL.innerHTML = '';
  }

  renderSpinner() {
    const markup = `<div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;

    this._clear();
    this._parentEL.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
      <p>${message}</p>
    </div>`;

    this._clear();
    this._parentEL.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `<div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentEL.insertAdjacentHTML('afterbegin', markup);
  }
}

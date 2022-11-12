import View from './View';
import preview from './Preview';

class BookmarksView extends View {
  _parentEL = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it 😁';
  _message = '';

  _generateMarkup() {
    return this._data.map(bookmark => preview.render(bookmark, false)).join('');
  }

  addHandlerRender(subscriberFct) {
    window.addEventListener('load', subscriberFct);
  }
}

export default new BookmarksView();

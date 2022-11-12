import preview from './Preview';
import View from './View';

class ResultsView extends View {
  _parentEL = document.querySelector('.results');

  _generateMarkup() {
    return this._data.map(bookmark => preview.render(bookmark, false)).join('');
  }
}

export default new ResultsView();

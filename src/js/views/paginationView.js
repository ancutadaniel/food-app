import icons from 'url:../../img/icons.svg'; // Parcel 2
import { RES_PER_PAGE } from '../config';
import View from './View';

class PaginationView extends View {
  _parentEL = document.querySelector('.pagination');

  addHandlerPagination(subscriberFct) {
    this._parentEL.addEventListener('click', e => {
      // event delegation - closest search up in the three
      const btn = e.target.closest('.btn--inline'); // select the closest element to the click

      if (!btn) return;

      subscriberFct(+btn.dataset.page);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(this._data.results.length / RES_PER_PAGE);
    const currentPage = this._data.page;

    // Page 1, and there are other page
    if (currentPage === 1 && numPages > 1) {
      return `
        <button class="btn--inline pagination__btn--next" data-page="${
          currentPage + 1
        }">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button> 
        `;
    }

    // Page 1, and there are NO other page
    if (currentPage === 1 && numPages === 1) {
      return '';
    }

    // Last Page
    if (currentPage === numPages && numPages > 1) {
      return `
        <button class="btn--inline pagination__btn--prev" data-page="${
          currentPage - 1
        }">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button> 
        `;
    }

    // Other Pages
    if (currentPage < numPages) {
      return ` 
        <button class="btn--inline pagination__btn--prev" data-page="${
          currentPage - 1
        }">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
        <button class="btn--inline pagination__btn--next" data-page="${
          currentPage + 1
        }">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`;
    }
  }
}

export default new PaginationView();

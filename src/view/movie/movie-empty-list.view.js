import AbstractView from '../../framework/view/abstract-view';
import {FilterType} from '../../common/constants';

const NoTasksTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
  [FilterType.HISTORY]: 'There are no watched movies now',
};

const createEmptyListTemplate = (filterType) => `
  <div class="films-list">
    <h2 class="films-list__title">${NoTasksTextType[filterType]}</h2>
  </div>
`;

export class MovieEmptyListView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType);
  }
}

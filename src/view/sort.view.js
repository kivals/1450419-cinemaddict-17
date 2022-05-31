import AbstractView from '../framework/view/abstract-view';

const createSortItemTemplate = (sortName) =>
  `<li><a href="#" class="sort__button">${sortName}</a></li>`;

const createSortTemplate = (sortList) => {
  const sortItemsTemplate = sortList.map(createSortItemTemplate).join('');

  return `
    <ul class="sort">
      ${sortItemsTemplate}
    </ul>`;
};

export default class SortView extends AbstractView {
  #sortList = null;

  constructor(sortList) {
    super();
    this.#sortList = sortList;
  }

  get template() {
    return createSortTemplate(this.#sortList);
  }
}

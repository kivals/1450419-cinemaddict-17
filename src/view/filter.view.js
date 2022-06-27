import AbstractView from '../framework/view/abstract-view';

const createNavItemTemplate = (name, count, type, currentFilterType) => {
  const countTemplate = count !== undefined ? `<span class="main-navigation__item-count">${count}</span>` : '';
  return `
    <a href="#${type}"
      data-filter="${type}"
      class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">
        ${name} ${countTemplate}
    </a>
  `;
};

const createNavTemplate = (navigationItems, currentFilterType) => {
  const navigationItemsTemplate = navigationItems
    .map(({name, count, type}) => createNavItemTemplate(name, count, type, currentFilterType))
    .join('');
  return `
      <nav class="main-navigation">
        ${navigationItemsTemplate}
      </nav>
  `;
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilterType = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createNavTemplate(this.#filters, this.#currentFilterType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const filterType = evt.target.dataset.filter;
    this._callback.filterTypeChange(filterType);
  };
}

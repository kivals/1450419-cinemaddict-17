import AbstractView from '../framework/view/abstract-view';
import {toUpperCaseFirstLetter} from '../common/utils';

const createNavItemTemplate = (name, count) => {
  const countTemplate = count !== undefined ? `<span class="main-navigation__item-count">${count}</span>` : '';
  return `<a href="#${name}" class="main-navigation__item">${toUpperCaseFirstLetter(name)} ${countTemplate}</a>`;
};

const createNavTemplate = (navigationItems) => {
  const navigationItemsTemplate = navigationItems
    .map(({navigationName, count}) => createNavItemTemplate(navigationName, count))
    .join('');

  return `
      <nav class="main-navigation">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        ${navigationItemsTemplate}
      </nav>
  `;
};

export default class NavigationView extends AbstractView {
  #navigation = null;

  constructor(navigation) {
    super();
    this.#navigation = navigation;
  }

  get template() {
    return createNavTemplate(this.#navigation);
  }
}

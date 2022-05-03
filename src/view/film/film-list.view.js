import { createElement } from '../../render';

export default class FilmListView {
  getTemplate() {
    return `
      <section class="films-list"></section>
    `;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

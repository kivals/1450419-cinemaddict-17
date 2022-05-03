import { createElement } from '../../render';

export default class FilmContainerView {
  getTemplate() {
    return `
        <section class="films"></section>
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

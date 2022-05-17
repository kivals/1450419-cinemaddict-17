import {createElement} from '../../render';

export default class MovieShowMoreBtnView {
  #element = null;

  #getTemplate() {
    return '<button class="films-list__show-more">Show more</button>';
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.#getTemplate());
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

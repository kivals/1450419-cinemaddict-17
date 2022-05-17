import {createElement} from '../../render';

export class NoMovieView {
  #element = null;

  getTemplate() {
    return '<h2 class="films-list__title">There are no movies in our database</h2>';
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

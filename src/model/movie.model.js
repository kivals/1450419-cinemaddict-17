import { generateMovie } from '../mock/movie.mock';
import Observable from '../framework/observable';

export default class MovieModel extends Observable {
  #movies = Array.from({length: 11}, generateMovie);

  get movies() {
    return this.#movies;
  }

  updateMovie(updateType, update) {
    const index = this.#movies.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexciting movie');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}

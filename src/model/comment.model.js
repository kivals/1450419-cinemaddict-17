import {getComments} from '../mock/comment.mock';
import Observable from '../framework/observable';

export default class CommentModel extends Observable {
  #movieModel = null;
  #comments = [];

  constructor(movieModel) {
    super();
    this.#movieModel = movieModel;
    const filmIds = movieModel.movies.map((movie) => movie.id);
    this.#comments = getComments(filmIds);
  }

  getCommentsByMovie(movieId) {
    return this.#comments.filter((comment) => comment.filmId === movieId);
  }

  addComment(updateType, comment) {
    console.log("model");
    console.log(updateType);
    console.log(comment);
    this.#comments.push(comment);
    this._notify(updateType, comment);
  }

  deleteComment(update) {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType, update);
  }


}

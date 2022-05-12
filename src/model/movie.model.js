import { generateMovie } from '../mock/movie.mock';
import {getRandomInteger} from '../common/utils';

export default class MovieModel {
  #commentModel;
  #movies = [];

  constructor(commentModel) {
    this.#commentModel = commentModel;
    this.#movies = this.#mergeMoviesAndComments();
  }

  /**
   * Получить набор комментариев для фильма
   * @param commentsIds идентификаторы комментариев
   * @returns список объектов-комментарии
   */
  getMovieComments(commentsIds = []) {
    return this.#commentModel.getComments().filter((comment) => commentsIds.indexOf(comment.id) !== -1);
  }

  getMovies() {
    return this.#movies;
  }

  /**
   * Mock-метод объединяющий сущности Комментарии и Фильмы
   * @returns объект, описывающий фильм с набором комметариев в виде id
   */
  #mergeMoviesAndComments() {
    const movies = Array.from({length: 9}, generateMovie);
    const comments = [...this.#commentModel.getComments()];

    return movies.map((movie) => {
      const movieCommentsIds = [];

      if (comments.length !== 0) {
        const countComments = getRandomInteger(0, 10);

        for (let i = 0; i < countComments; i++) {
          const ranIndex = getRandomInteger(0, comments.length - 1);
          movieCommentsIds.push(comments[ranIndex].id);

          comments.splice(ranIndex, 1);

          if (comments.length === 0) { break; }
        }
      }
      return {
        ...movie,
        comments: movieCommentsIds
      };
    });
  }
}

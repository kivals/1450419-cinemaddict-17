import { generateMovie } from '../mock/movie.mock';
import {getRandomInteger} from '../common/utils';

export default class MovieModel {
  constructor(commentModel) {
    this.commentModel = commentModel;
    this.movies = this.mergeMoviesAndComments();
  }

  mergeMoviesAndComments() {
    const movies = Array.from({length: 9}, generateMovie);
    const comments = [...this.commentModel.getComments()];

    return movies.map((movie) => {
      const movieCommentsIds = [];

      if (comments.length !== 0) {
        const countComments = getRandomInteger(0, 100);

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

  getMovies() {
    return this.movies;
  }
}

import MovieContainerView from '../view/movie/movie-container.view';
import { render } from '../framework/render';
import { MovieEmptyListView } from '../view/movie/movie-empty-list.view';
import { MovieListView } from '../view/movie/movie-list.view';

export default class MoviePresenter {
  #movieContainerComp = new MovieContainerView();
  #moviesWrapperHtml = null;
  #movieModel = null;
  #movieList = [];

  constructor(moviesWrapperHtml, movieModel) {
    this.#moviesWrapperHtml = moviesWrapperHtml;
    this.#movieModel = movieModel;
  }

  init() {
    this.#movieList = [...this.#movieModel.getMovies()];
    this.#renderMovieContainer();
  }

  #renderMovieContainer() {
    const moviesData = this.#movieList.map((movie) => ({
      ...movie,
      comments: this.#movieModel.getMovieComments(movie.comments)
    }));
    const movieListComp = !moviesData.length ?
      new MovieEmptyListView() : new MovieListView(moviesData);

    render(this.#movieContainerComp, this.#moviesWrapperHtml);
    render(movieListComp, this.#movieContainerComp.element);
  }
}

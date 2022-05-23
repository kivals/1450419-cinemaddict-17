import MovieContainerView from '../view/movie/movie-container.view';
import { render } from '../render';
import { render as newRender } from '../framework/render';
import MovieListView from '../view/movie/movie-list.view';

export default class MoviePresenter {
  #movieContainerComp = new MovieContainerView();
  #movieContainer = null;
  #movieModel = null;
  #movieList = [];

  constructor(movieContainer, movieModel) {
    this.#movieContainer = movieContainer;
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
    const movieListComp = new MovieListView(moviesData);
    newRender(this.#movieContainerComp, this.#movieContainer);
    // render(movieListComp, this.#movieContainerComp.getElement());
  }
}

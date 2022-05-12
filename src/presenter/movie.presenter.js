import MovieContainerView from '../view/movie/movie-container.view';
import { render } from '../render';
import MovieListView from '../view/movie/movie-list.view';
import MovieCardView from '../view/movie/movie-card.view';
import MoviePopupView from '../view/movie/movie-popup.view';

export default class MoviePresenter {
  #movieContainerComp = new MovieContainerView();
  #movieListComp = new MovieListView();
  #movieContainer = null;
  #movieModel = null;
  #movieList = [];

  constructor(movieContainer, movieModel) {
    this.#movieContainer = movieContainer;
    this.#movieModel = movieModel;
  }

  init() {
    this.#movieList = [...this.#movieModel.getMovies()];
    render(this.#movieContainerComp, this.#movieContainer);
    render(this.#movieListComp, this.#movieContainerComp.getElement());
    this.#renderMovies();
  }

  /**
   * Отрисовать список карточек фильмов
   */
  #renderMovies() {
    this.#movieList.forEach((movie) => {
      const comments = this.#movieModel.getMovieComments(movie.comments);
      this.#renderMovieCard(movie, comments);
    });
  }

  /**
   * Отрисовка карточки фильма
   * @param movie фильм
   * @param comments комментарии фильма
   */
  #renderMovieCard = (movie, comments) => {
    const movieCardComp = new MovieCardView(movie);

    movieCardComp.getElement().addEventListener('click', () => {
      const moviePopupComp = new MoviePopupView(movie, comments);
      moviePopupComp.showPopup();
    });

    render(movieCardComp, this.#movieContainerComp.getElement());
  };

}

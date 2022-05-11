import MovieContainerView from '../view/movie/movie-container.view';
import { render } from '../render';
import MovieListView from '../view/movie/movie-list.view';
import MovieCardView from '../view/movie/movie-card.view';
import MoviePopupView from '../view/movie/movie-popup.view';

export default class MoviePresenter {
  movieContainer = new MovieContainerView();
  movieList = new MovieListView();

  init(wrapper, model) {
    this.wrapper = wrapper;
    this.movieModel = model;

    this.movies = [...this.movieModel.getMovies()];

    render(this.movieContainer, this.wrapper);
    render(this.movieList, this.movieContainer.getElement());

    this.movies.forEach((movie) => {
      this.renderMovie(movie);
    });
  }

  renderMovie = (movie) => {
    const movieCardComp = new MovieCardView(movie);

    movieCardComp.getElement().addEventListener('click', () => {
      const moviePopupComp = new MoviePopupView(movie);
      moviePopupComp.showPopup();
    });
    render(movieCardComp, this.movieContainer.getElement());
  };

}

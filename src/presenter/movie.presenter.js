import MovieContainerView from '../view/movie/movie-container.view';
import { render } from '../render';
import MovieListView from '../view/movie/movie-list.view';
import MovieCardView from '../view/movie/movie-card.view';

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
      render(new MovieCardView(movie), this.movieContainer.getElement());
    });
  }
}

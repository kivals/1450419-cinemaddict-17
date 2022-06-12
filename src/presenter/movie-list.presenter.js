import MoviesView from '../view/movie/movies.view';
import { render } from '../framework/render';
import SortView from '../view/sort.view';
import {sortTypes} from '../common/constants';
import {MovieListView} from '../view/movie/movie-list.view';
import {MoviePresenter} from './movie.presenter';
import {MoviesContainerView} from '../view/movie/movies-container.view';
import MovieShowMoreBtnView from '../view/movie/movie-show-more-btn.view';
import {updateItem} from '../common/utils';

const MOVIE_COUNT_PER_STEP = 5;

export default class MovieListPresenter {
  #renderedMovieCount = MOVIE_COUNT_PER_STEP;

  #mainHtml = null;
  #movieModel = null;
  #movieList = [];
  #moviePresenterMap = new Map();

  #moviesComp = new MoviesView();
  #showMoreButtonComp = new MovieShowMoreBtnView();
  #movieListComp = new MovieListView();
  #moviesListContainerComp = new MoviesContainerView();

  constructor(moviesWrapperHtml, movieModel) {
    this.#mainHtml = moviesWrapperHtml;
    this.#movieModel = movieModel;
  }

  init() {
    this.#movieList = [...this.#movieModel.getMovies()];
    this.#renderMovieContainer();
  }

  #renderMovieContainer() {
    render(this.#moviesComp, this.#mainHtml);
    this.#renderSort();
    this.#renderMovieList();
  }

  #renderSort() {
    render(new SortView(sortTypes), this.#moviesComp.element);
  }

  #renderMovieList() {
    render(this.#movieListComp, this.#moviesComp.element);
    render(this.#moviesListContainerComp, this.#movieListComp.element);
    this.#renderMovies(0, Math.min(this.#movieList.length, MOVIE_COUNT_PER_STEP));
    this.#renderShowMoreButton();
  }

  #renderMovies(from, to) {
    this.#movieList
      .slice(from, to)
      .forEach((movie) => this.#renderMovie(movie));
  }

  #renderMovie(movie) {
    const comments = this.#movieModel.getMovieComments(movie.comments);
    const moviePresenter = new MoviePresenter(this.#moviesListContainerComp, this.#onChangeMovie);
    moviePresenter.init(movie, comments);
    this.#moviePresenterMap.set(movie.id, moviePresenter);
  }

  #renderShowMoreButton() {
    render(this.#showMoreButtonComp, this.#movieListComp.element);
    this.#showMoreButtonComp.setClickHandler(this.#onClickShowMore);
  }

  #onClickShowMore = () => {
    this.#movieList
      .slice(this.#renderedMovieCount, this.#renderedMovieCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie));

    this.#renderedMovieCount += MOVIE_COUNT_PER_STEP;

    if (this.#renderedMovieCount >= this.#movieList.length) {
      this.#showMoreButtonComp.removeElement();
    }
  };

  #onChangeMovie = (updatedMovie) => {
    this.#movieList = updateItem(this.#movieList, updatedMovie);
    const comments = this.#movieModel.getMovieComments(updatedMovie.comments);
    this.#moviePresenterMap.get(updatedMovie.id).init(updatedMovie, comments);
  };
}

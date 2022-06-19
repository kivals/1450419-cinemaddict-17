import MoviesView from '../view/movie/movies.view';
import {remove, render} from '../framework/render';
import SortView from '../view/sort.view';
import {MovieListView} from '../view/movie/movie-list.view';
import {MoviePresenter} from './movie.presenter';
import {MoviesContainerView} from '../view/movie/movies-container.view';
import MovieShowMoreBtnView from '../view/movie/movie-show-more-btn.view';
import {sortByDate, sortByRating, updateItem} from '../common/utils';
import {SortDirection, SortType} from '../common/constants';

const MOVIE_COUNT_PER_STEP = 5;

export default class MovieListPresenter {
  #renderedMovieCount = MOVIE_COUNT_PER_STEP;

  #mainHtml = null;
  #movieModel = null;
  #movieList = [];
  #sourceMovieList = [];
  #moviePresenterMap = new Map();
  #currentSortType = SortType.DEFAULT;
  #currentSortDirection = SortDirection.UP;

  #moviesComp = new MoviesView();
  #showMoreButtonComp = new MovieShowMoreBtnView();
  #movieListComp = new MovieListView();
  #moviesListContainerComp = new MoviesContainerView();
  #sortComp = new SortView();

  constructor(moviesWrapperHtml, movieModel) {
    this.#mainHtml = moviesWrapperHtml;
    this.#movieModel = movieModel;
  }

  init() {
    this.#movieList = [...this.#movieModel.getMovies()];
    this.#sourceMovieList = [...this.#movieList];

    this.#renderMovieContainer();
  }

  #renderMovieContainer() {
    render(this.#moviesComp, this.#mainHtml);
    this.#renderSort();
    this.#renderMovieList();
  }

  #renderSort() {
    render(this.#sortComp, this.#moviesComp.element);
    this.#sortComp.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderMovieList() {
    render(this.#movieListComp, this.#moviesComp.element);
    render(this.#moviesListContainerComp, this.#movieListComp.element);
    this.#renderMovies(0, Math.min(this.#movieList.length, MOVIE_COUNT_PER_STEP));

    if (this.#movieList.length > MOVIE_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
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
    this.#sourceMovieList = updateItem(this.#sourceMovieList, updatedMovie);
    const comments = this.#movieModel.getMovieComments(updatedMovie.comments);
    this.#moviePresenterMap.get(updatedMovie.id).init(updatedMovie, comments);
  };

  #handleSortTypeChange = (sortType) => {
    let sortDirection = this.#currentSortDirection;

    if (this.#currentSortType === sortType) {
      if (sortType === SortType.DEFAULT) {
        return;
      }
      sortDirection = this.#currentSortDirection === SortDirection.UP ? SortDirection.DOWN : SortDirection.UP;
    }
    this.#sortTasks(sortType, sortDirection);
    this.#clearMovieList();
    this.#renderMovieList();
  };

  #clearMovieList() {
    this.#moviePresenterMap.forEach((presenter) => presenter.destroy());
    this.#moviePresenterMap.clear();
    this.#renderedMovieCount = MOVIE_COUNT_PER_STEP;
    remove(this.#showMoreButtonComp);
  }

  #sortTasks = (sortType, sortDirection) => {
    switch (sortType) {
      case SortType.DATE:
        this.#movieList.sort(sortByDate(sortDirection));
        break;
      case SortType.RATING:
        this.#movieList.sort(sortByRating(sortDirection));
        break;
      default:
        this.#movieList = [...this.#sourceMovieList];
    }

    this.#currentSortType = sortType;
    this.#currentSortDirection = sortDirection;
  };
}

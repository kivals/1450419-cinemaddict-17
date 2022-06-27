import MoviesView from '../view/movie/movies.view';
import {remove, render, RenderPosition} from '../framework/render';
import SortView from '../view/sort.view';
import {MovieListView} from '../view/movie/movie-list.view';
import {MoviePresenter} from './movie.presenter';
import {MoviesContainerView} from '../view/movie/movies-container.view';
import MovieShowMoreBtnView from '../view/movie/movie-show-more-btn.view';
import {sortByDate, sortByRating} from '../common/utils';
import {FilterType, SortDirection, SortType, UpdateType, UserAction} from '../common/constants';
import MoviePopupView from '../view/movie/movie-popup.view';
import {filter} from '../common/filter';
import {MovieEmptyListView} from "../view/movie/movie-empty-list.view";

const MOVIE_COUNT_PER_STEP = 5;

export default class MovieListPresenter {
  #renderedMovieCount = MOVIE_COUNT_PER_STEP;

  #mainHtml = null;

  #movieModel = null;
  #commentsModel = null;
  #filterModel = null;

  #moviePresenterMap = new Map();
  #currentSortType = SortType.DEFAULT;
  #currentSortDirection = SortDirection.UP;
  #openedPopupId = null;
  #filterType = FilterType.ALL;

  #moviesComp = new MoviesView();
  #showMoreButtonComp = new MovieShowMoreBtnView();
  #movieListComp = new MovieListView();
  #moviesListContainerComp = new MoviesContainerView();
  #sortComp = new SortView();
  #noMoviesComp = null;

  constructor(moviesWrapperHtml, movieModel, commentsModel, filterModel) {
    this.#mainHtml = moviesWrapperHtml;
    this.#movieModel = movieModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#movieModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderMovieContainer();
  }

  get movies() {
    this.#filterType= this.#filterModel.filter;
    const movies = this.#movieModel.movies;
    const filteredMovies = filter[this.#filterType](movies);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredMovies.sort(sortByDate(this.#currentSortDirection));
      case SortType.RATING:
        return filteredMovies.sort(sortByRating(this.#currentSortDirection));
    }

    return filteredMovies;
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#movieModel.updateMovie(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#moviePresenterMap.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        debugger;
        if (MoviePopupView.isShow) {
          this.#openedPopupId = data.id;
        }
        this.#clearMovieList();
        this.#renderMovieList();
        break;
      case UpdateType.MAJOR:
        this.#clearMovieList();
        this.#renderMovieList({resetRenderedMovieCount: true, resetSortType: true});
        break;
    }
  };

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
    const movies = this.movies;
    const movieCount = movies.length;

    if (movieCount === 0) {
      this.#renderNoMovies();
      return;
    }

    render(this.#movieListComp, this.#moviesComp.element);
    render(this.#moviesListContainerComp, this.#movieListComp.element);

    this.#renderMovies(movies.slice(0, Math.min(movieCount, this.#renderedMovieCount)));

    if (movies.length > MOVIE_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderMovies(movies) {
    movies.forEach((movie) => this.#renderMovie(movie));
  }

  #renderMovie(movie) {
    const comments = this.#commentsModel.getCommentsByMovie(movie.id);/*this.#movieModel.getMovieComments(movie.comments);*/
    const isOpenPopup = this.#openedPopupId === movie.id;
    const moviePresenter = new MoviePresenter(this.#moviesListContainerComp, this.#handleViewAction);
    moviePresenter.init(movie, comments, isOpenPopup);
    this.#moviePresenterMap.set(movie.id, moviePresenter);
  }

  #renderShowMoreButton() {
    render(this.#showMoreButtonComp, this.#movieListComp.element);
    this.#showMoreButtonComp.setClickHandler(this.#onClickShowMore);
  }

  #renderNoMovies() {
    this.#noMoviesComp = new MovieEmptyListView(this.#filterType);
    render(this.#noMoviesComp, this.#movieListComp.element, RenderPosition.AFTERBEGIN);
  }

  #onClickShowMore = () => {
    this.movies
      .slice(this.#renderedMovieCount, this.#renderedMovieCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie));

    this.#renderedMovieCount += MOVIE_COUNT_PER_STEP;

    if (this.#renderedMovieCount >= this.movies.length) {
      this.#showMoreButtonComp.removeElement();
    }
  };

  #handleSortTypeChange = (sortType) => {
    //сбрасываем, чтобы не открывалось попал окно
    this.#openedPopupId = null;
    let sortDirection = this.#currentSortDirection;

    if (this.#currentSortType === sortType) {
      if (sortType === SortType.DEFAULT) {
        return;
      }
      sortDirection = this.#currentSortDirection === SortDirection.UP ? SortDirection.DOWN : SortDirection.UP;
    }
    this.#currentSortType = sortType;
    this.#currentSortDirection = sortDirection;
    this.#clearMovieList({resetRenderedMovieCount: true});
    this.#renderMovieList();
  };

  #clearMovieList({resetRenderedMovieCount = false, resetSortType = false} = {}) {
    const movieCount = this.movies.length;

    this.#moviePresenterMap.forEach((presenter) => presenter.destroy());
    this.#moviePresenterMap.clear();
    MoviePopupView.isShow = false;
    // remove(this.#sortComp);
    remove(this.#showMoreButtonComp);
    if (this.#noMoviesComp) {
      remove(this.#noMoviesComp);
    }

    if (resetRenderedMovieCount) {
      this.#renderedMovieCount = MOVIE_COUNT_PER_STEP;
    } else {
      // На случай, если перерисовка списка вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this.#renderedMovieCount = Math.min(movieCount, this.#renderedMovieCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }
}

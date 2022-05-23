import {createElement, render, RenderPosition} from '../../render';
import { render as newRender} from '../../framework/render';
import MovieShowMoreBtnView from './movie-show-more-btn.view';
import {NoMovieView} from './no-movie.view';
import MovieCardView from './movie-card.view';
import MoviePopupView from './movie-popup.view';

const MOVIE_COUNT_PER_STEP = 5;

export default class MovieListView {
  #element = null;
  #showMoreButtonComp = new MovieShowMoreBtnView();
  #cardsContainer = null;

  #movies = [];
  #renderedMovieCount = MOVIE_COUNT_PER_STEP;

  constructor(movies = []) {
    this.#movies = movies;
    this.#render();
  }

  #render() {
    if (this.#movies.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderCards();
      this.#renderShowMoreBtn();
    }

  }

  #renderEmptyList() {
    this.#element = createElement(this.#getEmptyContainerTemplate());
    render(new NoMovieView(), this.#element);
  }

  #renderCards() {
    this.#element = createElement(this.#getTemplate());

    this.#cardsContainer = this.#element.querySelector('.films-list__container');

    for (let i = 0; i < Math.min(this.#movies.length, MOVIE_COUNT_PER_STEP); i++) {
      this.#renderMovie(this.#movies[i]);
    }

    this.#element.insertAdjacentElement(RenderPosition.BEFOREEND, this.#cardsContainer);
  }

  #renderShowMoreBtn() {
    if (this.#movies.length > MOVIE_COUNT_PER_STEP) {
      render(this.#showMoreButtonComp, this.#element);

      this.#showMoreButtonComp.getElement().addEventListener('click', this.#onShowMoreClick);
    }
  }

  #renderMovie(movie) {
    render(this.#getMovieCardItem(movie), this.#cardsContainer);
  }

  #getMovieCardItem(movie) {
    const movieCardComp = new MovieCardView(movie);

    movieCardComp.getElement().addEventListener('click', () => {
      const moviePopupComp = new MoviePopupView(movie);
      moviePopupComp.showPopup();
    });

    return movieCardComp;
  }

  #getEmptyContainerTemplate() {
    return '<div class="films-list"></div>';
  }

  #getTemplate() {
    return `
    <div class="films-list">
       <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
       <div class="films-list__container"></div>
    </div>
    `;
  }

  #onShowMoreClick = (event) => {
    event.preventDefault();
    this.#movies
      .slice(this.#renderedMovieCount, this.#renderedMovieCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie));

    this.#renderedMovieCount += MOVIE_COUNT_PER_STEP;

    if (this.#renderedMovieCount >= this.#movies.length) {
      this.#showMoreButtonComp.getElement().remove();
      this.#showMoreButtonComp.removeElement();
    }
  };

  getElement() {
    return this.#element;
  }

  removeElement() {
    this.element = null;
  }
}

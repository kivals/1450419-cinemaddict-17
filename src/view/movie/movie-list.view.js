import AbstractView from '../../framework/view/abstract-view';
import { render } from '../../framework/render';
import MovieCardView from './movie-card.view';
import MoviePopupView from './movie-popup.view';
import MovieShowMoreBtnView from './movie-show-more-btn.view';

const createListTemplate = () => `
 <div class="films-list">
       <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
       <div class="films-list__container"></div>
    </div>
 `;

const MOVIE_COUNT_PER_STEP = 5;

export class MovieListView extends AbstractView {
  #movies = [];
  #renderedMovieCount = MOVIE_COUNT_PER_STEP;
  #cardsContainerHtml = null;
  #showMoreButtonComp = new MovieShowMoreBtnView();

  constructor(movies = []) {
    super();
    this.#movies = movies;
    this.#cardsContainerHtml = this.element.querySelector('.films-list__container');
    this.#renderMovieCards();
    this.#renderShowMoreBtn();
  }

  get template() {
    return createListTemplate();
  }

  #renderMovieCards() {
    for (let i = 0; i < Math.min(this.#movies.length, MOVIE_COUNT_PER_STEP); i++) {
      this.#renderMovie(this.#movies[i]);
    }
  }

  #renderMovie(movie) {
    const movieCardComp = new MovieCardView(movie);
    movieCardComp.setClickHandler(this.#onClickCard(movie));
    render(movieCardComp, this.#cardsContainerHtml);
  }

  #renderShowMoreBtn() {
    if (this.#movies.length > MOVIE_COUNT_PER_STEP) {
      this.#showMoreButtonComp.setClickHandler(this.#onClickShowMore);
      render(this.#showMoreButtonComp, this.element);
    }
  }

  #onClickCard = (movie) => () => {
    const moviePopupComp = new MoviePopupView(movie);
    moviePopupComp.showPopup();
  };

  #onClickShowMore = () => {
    this.#movies
      .slice(this.#renderedMovieCount, this.#renderedMovieCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie));

    this.#renderedMovieCount += MOVIE_COUNT_PER_STEP;

    if (this.#renderedMovieCount >= this.#movies.length) {
      this.#showMoreButtonComp.removeElement();
    }
  };
}

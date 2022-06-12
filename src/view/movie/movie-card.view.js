import {convertMinutesToHours, humanizeDate} from '../../common/utils';
import AbstractView from '../../framework/view/abstract-view';

export const USER_ACTIONS = {
  WATCHLIST: 'watchlist',
  ALREADY_WATCHED: 'alreadyWatched',
  FAVORITE: 'favorite'
};

const createCardTemplate = (movie) => {
  const { title, totalRating, release, poster, genre, runtime, description, comments, userDetails } = movie;

  const releaseYear = release.date ?
    humanizeDate(movie.release.date, 'YYYY') : '';

  const duration = convertMinutesToHours(Number(runtime));

  return `
      <article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${totalRating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${releaseYear}</span>
              <span class="film-card__duration">${duration}</span>
              <span class="film-card__genre">${genre}</span>
            </p>
            <img src="${poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${description}</p>
            <span class="film-card__comments">${comments.length} comments</span>
          </a>
          <div class="film-card__controls">
            <button
                data-key="${USER_ACTIONS.WATCHLIST}"
                class="film-card__controls-item film-card__controls-item--add-to-watchlist ${userDetails.watchlist ? 'film-card__controls-item--active' : ''}"
                type="button">Add to watchlist</button>
            <button
                data-key="${USER_ACTIONS.ALREADY_WATCHED}"
                class="film-card__controls-item film-card__controls-item--mark-as-watched ${userDetails.alreadyWatched ? 'film-card__controls-item--active' : ''}"
                type="button">Mark as watched</button>
            <button
                data-key="${USER_ACTIONS.FAVORITE}"
                class="film-card__controls-item film-card__controls-item--favorite ${userDetails.favorite ? 'film-card__controls-item--active' : ''}"
                type="button">Mark as favorite</button>
          </div>
        </article>
    `;
};

export default class MovieCardView extends AbstractView {
  #movie = [];
  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createCardTemplate(this.#movie);
  }

  setOpenPopupHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#openPopupHandler);
  };

  setAddToWatchlistHandler = (callback) => {
    this._callback.addToWatchlist = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#addToWatchListHandler);
  };

  setAlreadyWatchedHandler = (callback) => {
    this._callback.alreadyWatched = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#alreadyWatchedHandler);
  };

  setAddToFavoriteHandler = (callback) => {
    this._callback.addToFavorite = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#addToFavoriteHandler);
  };

  #openPopupHandler = (evt) => {
    evt.preventDefault();
    if (!evt.target.closest('.film-card__controls')){
      this._callback.click();
    }
  };

  #addToWatchListHandler = (evt) => {
    evt.preventDefault();
    this._callback.addToWatchlist();
  };

  #alreadyWatchedHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatched();
  };

  #addToFavoriteHandler = (evt) => {
    evt.preventDefault();
    this._callback.addToFavorite();
  };
}

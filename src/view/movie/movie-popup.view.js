import { convertMinutesToHours, humanizeDate } from '../../common/utils';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view';

const createPopupTemplate = (movie) => {
  const {
    title,
    alternativeTitle,
    totalRating,
    director,
    writers,
    actors,
    poster,
    genresTemplate,
    description,
    releaseDate,
    duration,
    userDetailsButtonsTemplate,
  } = movie;

  return `
      <section class="film-details">
        <form class="film-details__inner" action="" method="get">
          <div class="film-details__top-container">
            <div class="film-details__close">
              <button class="film-details__close-btn" type="button">close</button>
            </div>
            <div class="film-details__info-wrap">
              <div class="film-details__poster">
                <img class="film-details__poster-img" src="${poster}" alt="">

                <p class="film-details__age">18+</p>
              </div>

              <div class="film-details__info">
                <div class="film-details__info-head">
                  <div class="film-details__title-wrap">
                    <h3 class="film-details__title">${title}</h3>
                    <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                  </div>

                  <div class="film-details__rating">
                    <p class="film-details__total-rating">${totalRating}</p>
                  </div>
                </div>

                <table class="film-details__table">
                  <tr class="film-details__row">
                    <td class="film-details__term">Director</td>
                    <td class="film-details__cell">${director}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Writers</td>
                    <td class="film-details__cell">${writers.join(',')}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Actors</td>
                    <td class="film-details__cell">${actors.join(',')}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Release Date</td>
                    <td class="film-details__cell">${releaseDate}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Runtime</td>
                    <td class="film-details__cell">${duration}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Country</td>
                    <td class="film-details__cell">USA</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Genres</td>
                    <td class="film-details__cell">
                      ${genresTemplate}
                    </td>
                  </tr>
                </table>

                <p class="film-details__film-description">
                  ${description}
                </p>
              </div>
            </div>

            <section class="film-details__controls">
                ${userDetailsButtonsTemplate}
            </section>
          </div>

          <div class="film-details__bottom-container">
          </div>
        </form>
      </section>
    `;
};

export default class MoviePopupView extends AbstractStatefulView {
  static openedPopupId = null;

  constructor(movie) {
    super();
    this._state = MoviePopupView.parseMovieToState({...movie});
  }

  get template() {
    const genresTemplate = this.#getGenresTemplate();
    const userDetailsButtonsTemplate = this.#getUserDetailsButtons();

    return createPopupTemplate({
      ...this._state,
      genresTemplate,
      userDetailsButtonsTemplate,
    });
  }

  static parseMovieToState(movie) {
    const releaseDate = movie.release.date ? humanizeDate(movie.release.date, 'DD MMMM YYYY') : '';
    const duration = convertMinutesToHours(Number(movie.runtime));

    return {
      ...movie,
      releaseDate,
      duration,
    };
  }

  /**
   * Отрисовать блок с жанрами
   * @returns разметка с жанрами
   */
  #getGenresTemplate() {
    return this._state.genre.map((genre) => (`<span class="film-details__genre">${genre}</span>`)).join('');
  }

  #getUserDetailsButtons() {
    const addToWatchlistBtn =
      `<button type="button" class="film-details__control-button film-details__control-button--watchlist ${this._state.userDetails?.watchlist ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>`;
    const alreadyWatchBtn =
      `<button type="button" class="film-details__control-button film-details__control-button--watched ${this._state.userDetails?.alreadyWatched ? 'film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>`;
    const addToFavoritesBtn =
      `<button type="button" class="film-details__control-button film-details__control-button--favorite ${this._state.userDetails?.favorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>`;

    return [addToWatchlistBtn, alreadyWatchBtn, addToFavoritesBtn].join('');
  }

  setAddToWatchlistHandler = (callback) => {
    this._callback.addToWatchlist = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#addToWatchListHandler);
  };

  setAlreadyWatchedHandler = (callback) => {
    this._callback.alreadyWatched = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#alreadyWatchedHandler);
  };

  setAddToFavoriteHandler = (callback) => {
    this._callback.addToFavorite = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#addToFavoriteHandler);
  };

  setClosePopupHandler = (callback) => {
    this._callback.closePopup = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closePopupHandler);
  };

  _restoreHandlers = () => {
    this.setAddToWatchlistHandler(this._callback.addToWatchlist);
    this.setAlreadyWatchedHandler(this._callback.alreadyWatched);
    this.setAddToFavoriteHandler(this._callback.addToFavorite);
    this.setClosePopupHandler(this._callback.closePopup);
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

  #closePopupHandler = (evt) => {
    evt.preventDefault();
    this._callback.closePopup();
  };

  destroyComponent() {
    this.element.remove();
    super.removeElement();
  }
}

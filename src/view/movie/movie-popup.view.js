import { convertMinutesToHours, humanizeDate } from '../../common/utils';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view';
import {SMILES} from '../../common/constants';

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
    commentsTemplate,
    userDetailsButtonsTemplate,
    emojiTemplate,
    chosenEmojiTemplate,
    commentsCount,
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
            <section class="film-details__comments-wrap">
              <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

              <ul class="film-details__comments-list">
                ${commentsTemplate}
              </ul>

              <div class="film-details__new-comment">
                <div class="film-details__add-emoji-label">
                    ${chosenEmojiTemplate}
                </div>

                <label class="film-details__comment-label">
                  <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                </label>

                <div class="film-details__emoji-list">
                    ${emojiTemplate}
                </div>
              </div>
            </section>
          </div>
        </form>
      </section>
    `;
};

export default class MoviePopupView extends AbstractStatefulView {
  static isShow = false;
  #scrollPosition = 0;

  constructor(movie, comments) {
    super();
    this._state = MoviePopupView.parseMovieToState({...movie, comments});

    this.#setInnerHandlers();
  }

  get template() {
    const genresTemplate = this.#getGenresTemplate();
    const commentsTemplate = this.#getCommentsTemplate();
    const userDetailsButtonsTemplate = this.#getUserDetailsButtons();
    const emojiTemplate = this.#getEmojiTemplate();
    const chosenEmojiTemplate = this.#getEmojiImgTemplate(this._state.userEmoji);

    return createPopupTemplate({
      ...this._state,
      genresTemplate,
      commentsTemplate,
      userDetailsButtonsTemplate,
      emojiTemplate,
      chosenEmojiTemplate,
    });
  }

  static parseMovieToState(movie) {
    const releaseDate = movie.release.date ? humanizeDate(movie.release.date, 'DD MMMM YYYY') : '';
    const duration = convertMinutesToHours(Number(movie.runtime));
    const userEmoji = '';
    const commentsCount = movie.comments.length;

    return {
      ...movie,
      commentsCount,
      releaseDate,
      duration,
      userEmoji,
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

  /**
   * Отрисовать блок комментариев
   * @returns разметка с комментариями
   */
  #getCommentsTemplate() {
    return this._state.comments.map((comment) => {
      const commentDate = humanizeDate(comment.date, 'YYYY/MM/DD hh:mm');
      const emojiTemplate = this.#getEmojiImgTemplate(comment.emotion);
      return `
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          ${emojiTemplate}
        </span>
        <div>
          <p class="film-details__comment-text">${comment.comment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${comment.author}</span>
            <span class="film-details__comment-day">${commentDate}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>
      `;
    }).join('');
  }

  #getEmojiTemplate() {
    return SMILES.map((smile) => (
      `
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" ${smile === this._state.userEmoji ? 'checked' : ''} id="emoji-${smile}" value="${smile}">
      <label class="film-details__emoji-label" for="emoji-${smile}">
        <img src="./images/emoji/${smile}.png" width="30" height="30" alt="emoji">
      </label>
      `
    )).join('');
  }

  #setInnerHandlers() {
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('click', this.#setEmojiHandler);
  }

  #getEmojiImgTemplate(emoji) {
    return emoji ? `<img src="./images/emoji/${emoji}.png" data-emoji="${emoji}" width="55" height="55" alt="emoji-${emoji}">` : '';
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

  setAddCommentHandler = (callback) => {
    this._callback.addComment = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('keypress', this.#addCommentHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setAddToWatchlistHandler(this._callback.addToWatchlist);
    this.setAlreadyWatchedHandler(this._callback.alreadyWatched);
    this.setAddToFavoriteHandler(this._callback.addToFavorite);
    this.setClosePopupHandler(this._callback.closePopup);
    this.setAddCommentHandler(this._callback.addComment);
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

  #setEmojiHandler = (evt) => {
    evt.preventDefault();
    const label = evt.target.closest('.film-details__emoji-label');
    const input = document.getElementById(label.attributes.getNamedItem('for').value);

    this.#scrollPosition = this.element.scrollTop;

    this.updateElement({
      userEmoji: input?.value,
    });

    // Восстанавливаем положение скролла
    this.element.scrollTop = this.#scrollPosition;
  };

  #addCommentHandler = (evt) => {
    if ((evt.keyCode === 10 || evt.keyCode === 13) && evt.ctrlKey) {
      const emotion = this.element.querySelector('.film-details__add-emoji-label > img')?.dataset.emoji;
      const comment = evt.target.value;

      if (emotion && comment) {
        this._callback.addComment({
          author: 'Новый автор',
          comment,
          emotion,
          filmId: this._state.id,
        });
      }
    }
    //
  };

  destroyComponent() {
    this.element.remove();
    super.removeElement();
  }
}

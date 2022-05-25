import { convertMinutesToHours, humanizeDate } from '../../common/utils';
import AbstractView from '../../framework/view/abstract-view';

const createPopupTemplate = (movie) => {
  const {
    title,
    alternativeTitle,
    totalRating,
    director,
    writers,
    actors,
    poster,
    genres,
    description,
    releaseDate,
    duration,
    comments
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
                      ${genres}
                    </td>
                  </tr>
                </table>

                <p class="film-details__film-description">
                  ${description}
                </p>
              </div>
            </div>

            <section class="film-details__controls">
              <button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
              <button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched" id="watched" name="watched">Already watched</button>
              <button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
            </section>
          </div>

          <div class="film-details__bottom-container">
            <section class="film-details__comments-wrap">
              <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">4</span></h3>

              <ul class="film-details__comments-list">
                ${comments}
              </ul>

              <div class="film-details__new-comment">
                <div class="film-details__add-emoji-label"></div>

                <label class="film-details__comment-label">
                  <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                </label>

                <div class="film-details__emoji-list">
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                  <label class="film-details__emoji-label" for="emoji-smile">
                    <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                  <label class="film-details__emoji-label" for="emoji-sleeping">
                    <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                  <label class="film-details__emoji-label" for="emoji-puke">
                    <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                  <label class="film-details__emoji-label" for="emoji-angry">
                    <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                  </label>
                </div>
              </div>
            </section>
          </div>
        </form>
      </section>
    `;
};

export default class MoviePopupView extends AbstractView {
  static #isShow = false;
  #movie = null;

  constructor(movie) {
    super();
    this.#movie = movie;
    this.#initEventListeners();
  }

  get template() {
    const releaseDate = this.#movie.release.date ?
      humanizeDate(this.#movie.release.date, 'DD MMMM YYYY') : '';
    const duration = convertMinutesToHours(Number(this.#movie.runtime));
    const genres = this.#getGenresTemplate();
    const comments = this.#getCommentsTemplate();

    return createPopupTemplate({
      ...this.#movie,
      releaseDate,
      duration,
      genres,
      comments,
    });
  }

  showPopup() {
    if (!MoviePopupView.#isShow) {
      document.body.append(this.element);
      document.body.classList.toggle('hide-overflow');
      MoviePopupView.#isShow = true;
    }
  }

  /**
   * Отрисовать блок с жанрами
   * @returns разметка с жанрами
   */
  #getGenresTemplate() {
    return this.#movie.genre.map((genre) => (`<span class="film-details__genre">${genre}</span>`)).join('');
  }

  /**
   * Отрисовать блок комментариев
   * @returns разметка с комментариями
   */
  #getCommentsTemplate() {
    return this.#movie.comments.map((comment) => {
      const commentDate = humanizeDate(comment.date, 'YYYY/MM/DD');
      return `
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
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

  #initEventListeners() {
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closePopup);
    document.addEventListener('keydown', this.#onEscKeydown);
  }

  #onEscKeydown = (event) => {
    if (event.code === 'Escape') {
      this.#closePopup();
    }
  };

  #closePopup = () => {
    this.#removeElement();
    MoviePopupView.#isShow = false;
    document.body.classList.toggle('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeydown);
  };

  #removeElement() {
    this.element.remove();
    super.removeElement();
  }
}

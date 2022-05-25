import {convertMinutesToHours, humanizeDate} from '../../common/utils';
import AbstractView from '../../framework/view/abstract-view';

const createCardTemplate = (movie) => {
  const { title, totalRating, release, poster, genre, runtime, description, comments } = movie;

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
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
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

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}

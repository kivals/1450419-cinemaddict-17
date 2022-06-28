import AbstractView from '../../framework/view/abstract-view';
import {humanizeDate} from '../../common/utils';
import he from 'he';

const createCommentTemplate = (comment) => {
  const commentDate = humanizeDate(comment.date, 'YYYY/MM/DD hh:mm');
  return `
    <li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
          </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${commentDate}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
};

export class CommentView extends AbstractView {
  #comment = null;

  constructor(comment) {
    super();
    this.#comment = comment;
  }

  get template() {
    return createCommentTemplate(this.#comment);
  }

  setDeleteHandler(callback) {
    this._callback.deleteHandler = callback;
    this.element.querySelector('.film-details__comment-delete')
      .addEventListener('click', this.#deleteHandler);
  }

  #deleteHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteHandler(this.#comment);
  };
}

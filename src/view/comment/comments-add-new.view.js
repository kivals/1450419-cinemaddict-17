import AbstractView from '../../framework/view/abstract-view';
import {SMILES} from '../../common/constants';
import he from 'he';

const createComponentTemplate = (emojiTemplate, chosenEmoji, text = '') => `
    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">
         ${chosenEmoji}
      </div>

      <label class="film-details__comment-label">
        <textarea
            class="film-details__comment-input"
            placeholder="Select reaction below and write comment here"
            name="comment">${he.encode(text)}</textarea>
      </label>

      <div class="film-details__emoji-list">
          ${emojiTemplate}
      </div>
    </div>
  `;

export class CommentsAddNewView extends AbstractView {
  #currentComment = '';
  #currentEmoji = '';

  constructor(emoji = '', commentText = '') {
    super();
    this.#currentEmoji = emoji;
    this.#currentComment = commentText;
    this.#setInnerHandlers();
  }

  get template() {
    const emojiTemplate = this.#getEmojiTemplate();
    const chosenEmojiTemplate = this.#getEmojiImgTemplate(this.#currentEmoji);

    return createComponentTemplate(emojiTemplate, chosenEmojiTemplate, this.#currentComment);
  }

  #setInnerHandlers() {
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('keydown', this.#addCommentHandler);
  }

  #getEmojiImgTemplate(emoji) {
    return emoji ? `<img src="./images/emoji/${emoji}.png" data-emoji="${emoji}" width="55" height="55" alt="emoji-${emoji}">` : '';
  }

  #getEmojiTemplate() {
    return SMILES.map((smile) => (
      `
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" ${smile === this.#currentEmoji ? 'checked' : ''} id="emoji-${smile}" value="${smile}">
      <label class="film-details__emoji-label" for="emoji-${smile}">
        <img src="./images/emoji/${smile}.png" width="30" height="30" alt="emoji">
      </label>
      `
    )).join('');
  }

  setChangeEmojiHandler(callback) {
    this._callback.changeEmoji = callback;
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('click', this.#setEmojiHandler);
  }

  setSubmitCommentHandler(callback) {
    this._callback.submitComment = callback;
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('keydown', this.#addCommentHandler);
  }

  #setEmojiHandler = (evt) => {
    evt.preventDefault();
    const label = evt.target.closest('.film-details__emoji-label');
    const input = document.getElementById(label.attributes.getNamedItem('for').value);
    const newEmoji = input?.value;
    if (newEmoji !== this.#currentEmoji) {
      this._callback.changeEmoji({emoji: input?.value, text: this.#currentComment});
    }
  };

  #addCommentHandler = (evt) => {
    if ((evt.keyCode === 10 || evt.keyCode === 13) && evt.ctrlKey) {
      if (!this.#currentEmoji || !evt.target.value) {
        return;
      }
      this._callback.submitComment({emoji: this.#currentEmoji, text: evt.target.value});
      return;
    }

    this.#currentComment = evt.target.value;
  };
}

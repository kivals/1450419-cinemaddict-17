import AbstractView from '../../framework/view/abstract-view';
const createContainerTemplate = () => `
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">4</span></h3>
 `;

export class CommentsTitleView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createContainerTemplate();
  }
}

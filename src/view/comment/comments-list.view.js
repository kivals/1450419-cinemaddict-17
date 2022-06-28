import AbstractView from '../../framework/view/abstract-view';

const createContainerTemplate = () => `
       <ul class="film-details__comments-list"></ul>
 `;

export class CommentsListView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createContainerTemplate();
  }
}

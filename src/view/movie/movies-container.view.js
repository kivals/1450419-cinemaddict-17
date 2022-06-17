import AbstractView from '../../framework/view/abstract-view';

const createContainerTemplate = () => `
       <div class="films-list__container"></div>
 `;

export class MoviesContainerView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createContainerTemplate();
  }
}

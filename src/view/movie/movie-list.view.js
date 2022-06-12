import AbstractView from '../../framework/view/abstract-view';

const createListTemplate = () => `
 <section class="films-list">
    </section>
 `;

export class MovieListView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createListTemplate();
  }
}

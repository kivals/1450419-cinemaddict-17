import AbstractView from '../../framework/view/abstract-view';

const createEmptyListTemplate = () => `
  <div class="films-list">
    <h2 class="films-list__title">There are no movies in our database</h2>
  </div>
`;

export class MovieEmptyListView extends AbstractView {
  get template() {
    return createEmptyListTemplate();
  }
}

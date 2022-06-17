import AbstractView from '../../framework/view/abstract-view';

const createMovieContainerTemplate = () => '<section class="films"></section>';

export default class MoviesView extends AbstractView {
  get template() {
    return createMovieContainerTemplate();
  }
}

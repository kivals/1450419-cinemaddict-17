import FilmContainerView from '../view/film/film-container.view';
import { render } from '../render';
import FilmListView from '../view/film/film-list.view';
import FilmCardView from '../view/film/film-card.view';

export default class FilmsPresenter {
  filmContainer = new FilmContainerView();
  filmList = new FilmListView();

  init(wrapper) {
    this.wrapper = wrapper;

    render(this.filmContainer, this.wrapper);
    render(this.filmList, this.filmContainer.getElement());
    for (let i = 0; i < 5; i++) {
      render(new FilmCardView(), this.filmContainer.getElement());
    }
  }
}

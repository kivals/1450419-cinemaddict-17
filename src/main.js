import ProfileView from './view/profile.view';
import { render } from './render';
import NavigationView from './view/navigation.view';
import SortView from './view/sort.view';
import FilmsPresenter from './presenter/films.presenter';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const filmsPresenter = new FilmsPresenter();

render(new ProfileView(), siteHeaderElement);
render(new NavigationView(), siteMainElement);
render(new SortView(), siteMainElement);

filmsPresenter.init(siteMainElement);

import ProfileView from './view/profile.view';
import { render } from './framework/render';
import MovieListPresenter from './presenter/movie-list.presenter';
import MovieModel from './model/movie.model';
import CommentModel from './model/comment.model';
import FilterModel from './model/filter.model';
import FilterPresenter from './presenter/filter.presenter';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const moviesModel = new MovieModel();
const commentModel = new CommentModel(moviesModel);
const filterModel = new FilterModel();

const movieListPresenter = new MovieListPresenter(siteMainElement, moviesModel, commentModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);

render(new ProfileView(), siteHeaderElement);

movieListPresenter.init();
filterPresenter.init();

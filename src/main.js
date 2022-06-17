import ProfileView from './view/profile.view';
import { render } from './framework/render';
import NavigationView from './view/navigation.view';
import MovieListPresenter from './presenter/movie-list.presenter';
import MovieModel from './model/movie.model';
import CommentModel from './model/comment.model';
import {generateNavList} from './mock/navigation';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const navList = generateNavList();

const commentModel = new CommentModel();
const moviesModel = new MovieModel(commentModel);

const moviePresenter = new MovieListPresenter(siteMainElement, moviesModel);

render(new ProfileView(), siteHeaderElement);

render(new NavigationView(navList), siteMainElement);

moviePresenter.init();

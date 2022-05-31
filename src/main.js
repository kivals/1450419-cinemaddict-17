import ProfileView from './view/profile.view';
import { render } from './framework/render';
import NavigationView from './view/navigation.view';
import SortView from './view/sort.view';
import MoviePresenter from './presenter/movie.presenter';
import MovieModel from './model/movie.model';
import CommentModel from './model/comment.model';
import {generateNavList} from './mock/navigation';
import {sortTypes} from './common/constants';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const navList = generateNavList();

const commentModel = new CommentModel();
const moviesModel = new MovieModel(commentModel);

const moviePresenter = new MoviePresenter(siteMainElement, moviesModel);

render(new ProfileView(), siteHeaderElement);

render(new NavigationView(navList), siteMainElement);
render(new SortView(sortTypes), siteMainElement);
moviePresenter.init();

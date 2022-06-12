import MovieCardView from '../view/movie/movie-card.view';
import {remove, render, replace} from '../framework/render';
import MoviePopupView from '../view/movie/movie-popup.view';

export class MoviePresenter {
  #movieContainer = null;
  #movie = null;
  #comments = null;

  #movieCardComp = null;
  #moviePopupComp = null;

  #changeMovie = null;

  constructor(movieContainer, changeMovie) {
    this.#movieContainer = movieContainer;
    this.#changeMovie = changeMovie;
  }

  init(movie, comments) {
    this.#movie = movie;
    this.#comments = comments;

    const prevMovieCardComp = this.#movieCardComp;
    const prevMoviePopupComp = this.#moviePopupComp;

    this.#movieCardComp = new MovieCardView(movie);
    this.#moviePopupComp = new MoviePopupView(movie, comments);

    this.#initMovieCardListeners();
    this.#initPopupListeners();

    if (!prevMovieCardComp) {
      this.#renderMovie();
      return;
    }

    replace(this.#movieCardComp, prevMovieCardComp);
    replace(this.#moviePopupComp, prevMoviePopupComp);
    remove(prevMovieCardComp);
    remove(prevMoviePopupComp);
  }

  #initMovieCardListeners() {
    this.#movieCardComp.setOpenPopupHandler(this.#onPopupShow);
    this.#movieCardComp.setAddToWatchlistHandler(this.#onWatchlistClick);
    this.#movieCardComp.setAlreadyWatchedHandler(this.#onAlreadyWatched);
    this.#movieCardComp.setAddToFavoriteHandler(this.#onAddToFavorite);
  }

  #initPopupListeners() {
    this.#moviePopupComp.setAddToWatchlistHandler(this.#onWatchlistClick);
    this.#moviePopupComp.setAlreadyWatchedHandler(this.#onAlreadyWatched);
    this.#moviePopupComp.setAddToFavoriteHandler(this.#onAddToFavorite);
    this.#moviePopupComp.setClosePopupHandler(this.#onPopupClose);
  }

  #renderMovie() {
    render(this.#movieCardComp, this.#movieContainer.element);
  }

  #onPopupShow = () => {
    if (!MoviePopupView.isShow) {
      document.body.append(this.#moviePopupComp.element);
      document.body.classList.toggle('hide-overflow');
      document.addEventListener('keydown', this.#onEscKeydown);
      this.#initPopupListeners();
      MoviePopupView.isShow = true;
    }
  };

  #onPopupClose = () => {
    document.removeEventListener('keydown', this.#onEscKeydown);
    document.body.classList.remove('hide-overflow');
    this.#moviePopupComp.removeElement();
    MoviePopupView.isShow = false;
  }

  #onEscKeydown = (evt) => {
    evt.preventDefault();
    if (evt.code === 'Escape') {
      this.#onPopupClose();
    }
  }

  #onWatchlistClick = () => {
    const userDetails = {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist };
    this.#changeMovie({...this.#movie, userDetails});
  };

  #onAlreadyWatched = () => {
    const userDetails = {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched };
    this.#changeMovie({...this.#movie, userDetails});
  };

  #onAddToFavorite = () => {
    const userDetails = {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite };
    this.#changeMovie({...this.#movie, userDetails});
  };
}

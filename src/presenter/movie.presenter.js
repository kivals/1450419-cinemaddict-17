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
    console.log('init');
    this.#movie = movie;
    this.#comments = comments;

    const prevMovieCardComp = this.#movieCardComp;
    const prevMoviePopupComp = this.#moviePopupComp;

    this.#movieCardComp = new MovieCardView(movie);
    this.#moviePopupComp = new MoviePopupView(movie, comments);

    this.#movieCardComp.setOpenPopupHandler(this.#onPopupShow);
    this.#movieCardComp.setAddToWatchlistHandler(this.#onWatchlistClick);
    this.#movieCardComp.setAlreadyWatchedHandler(this.#onAlreadyWatched);
    this.#movieCardComp.setAddToFavoriteHandler(this.#onAddToFavorite);

    this.#moviePopupComp.setAddToWatchlistHandler(this.#onWatchlistClick);
    this.#moviePopupComp.setAlreadyWatchedHandler(this.#onAlreadyWatched);
    this.#moviePopupComp.setAddToFavoriteHandler(this.#onAddToFavorite);

    if (!prevMovieCardComp) {
      this.#renderMovie();
      return;
    }
    console.log('RERENDER');

    replace(this.#movieCardComp, prevMovieCardComp);
    replace(this.#moviePopupComp, prevMoviePopupComp);
    remove(prevMovieCardComp);
    remove(prevMoviePopupComp);
  }

  #renderMovie() {
    render(this.#movieCardComp, this.#movieContainer.element);
  }

  #onPopupShow = () => {
    this.#moviePopupComp.showPopup();
  };

  #onWatchlistClick = () => {
    console.log('EVENT WatchlistClick');
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

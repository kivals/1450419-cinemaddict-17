import {FilterType} from './constants';

export const filter = {
  [FilterType.ALL]: (movies) => movies,
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.userDetails.watchlist === true),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.history === true),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.userDetails.favorite === true),
};

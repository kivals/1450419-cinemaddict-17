import ApiService from '../framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class MovieApiService extends ApiService {

  get movies() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateMovie = async (movie) => {
    const response = await this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  };

  #adaptToServer = (movie) => {
    const filmInfo = {
      ...movie,
      'alternative_title': movie.alternativeTitle,
      'total_rating': movie.totalRating,
      'age_rating': movie.ageRating,
      'release': {
        'date': movie.release.date,
        'release_country': movie.release.releaseCountry,
      }
    };

    const userDetails = {
      'watchlist': movie.userDetails.watchlist,
      'already_watched': movie.userDetails.alreadyWatched,
      'watching_date': movie.userDetails.watchingDate,
      'favorite': movie.userDetails.favorite,
    };

    return {
      id: movie.id,
      comments: movie.comments,
      'film_info': filmInfo,
      'user_details': userDetails
    };
  };
}

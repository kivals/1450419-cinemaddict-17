import Observable from '../framework/observable';
import {UpdateType} from '../common/constants';

export default class MovieModel extends Observable {
  #moviesApiService = null;
  #movies = [];

  constructor(moviesApiService) {
    super();
    this.#moviesApiService = moviesApiService;
  }

  get movies() {
    return this.#movies;
  }

  async init() {
    try {
      const movies = await this.#moviesApiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
    } catch(err) {
      debugger;
      this.#movies = [];
    }
    this._notify(UpdateType.INIT);
  }

  updateMovie(updateType, update) {
    const index = this.#movies.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexciting movie');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  #adaptToClient(movie) {
    const adaptedMovie = {
      ...movie['film_info'],
      alternativeTitle: movie['film_info']['alternative_title'],
      totalRating: movie['film_info']['total_rating'],
      ageRating: movie['film_info']['age_rating'],
      release: {
        date: movie['film_info']['release']['date'],
        releaseCountry: movie['film_info']['release']['release_country']
      },
      userDetails: {
        watchlist: movie['user_details']['watchlist'],
        alreadyWatched: movie['user_details']['already_watched'],
        watchingDate: movie['user_details']['watching_date'],
        favorite: movie['user_details']['favorite'],
      },
      comments: movie.comments,
      id: movie.id,
    };

    delete adaptedMovie['alternative_title'];
    delete adaptedMovie['total_rating'];
    delete adaptedMovie['age_rating'];

    return adaptedMovie;
  }

/*{
  "id": "0",
  "comments": [
    $Comment.id$, $Comment.id$
  ],
  "film_info": {
    "title": "A Little Pony Without The Carpet",
    "alternative_title": "Laziness Who Sold Themselves",
    "total_rating": 5.3,
    "poster": "images/posters/blue-blazes.jpg",
    "age_rating": 0,
    "director": "Tom Ford",
    "writers": [
      "Takeshi Kitano"
    ],
    "actors": [
      "Morgan Freeman"
    ],
    "release": {
      "date": "2019-05-11T00:00:00.000Z",
      "release_country": "Finland"
    },
    "runtime": 77,
    "genre": [
      "Comedy"
    ],
    "description": "Oscar-winning film, a war drama about two young people, from the creators of timeless classic \"Nu, Pogodi!\" and \"Alice in Wonderland\", with the best fight scenes since Bruce Lee."
  },
  "user_details": {
    "watchlist": false,
    "already_watched": true,
    "watching_date": "2019-04-12T16:12:32.554Z",
    "favorite": false
  }
}*/
}

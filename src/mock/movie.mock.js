import {
  getRandomBoolean,
  getRandomInteger,
  getRandomValueFromArray
} from '../common/utils';
import {nanoid} from 'nanoid';

const posters = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const generateRuntime = () => getRandomInteger(10, 380);
const generateTotalRating = () => getRandomInteger(1, 10, 0.1);
const generatePoster = () => (`images/posters/${getRandomValueFromArray(posters)}`);

export const generateMovie = () => ({
  id: nanoid(),
  title: 'A Little Pony Without The Carpet',
  alternativeTitle: 'Laziness Who Sold Themselves',
  totalRating: generateTotalRating(),
  poster: generatePoster(),
  ageRating: 0,
  director: 'Tom Ford',
  writers: ['Takeshi Kitano'],
  actors: ['Morgan Freeman'],
  release: {
    date: '2019-05-11T00:00:00.000Z',
    releaseCountry: 'Finland'
  },
  runtime: generateRuntime(),
  genre: [
    'Comedy',
    'Fights',
    'Horror'
  ],
  description: 'Oscar-winning movie, a war drama about two young people, from the creators of timeless classic "Nu, Pogodi!" and "Alice in Wonderland", with the best fight scenes since Bruce Lee.',
  userDetails: {
    watchlist: getRandomBoolean(),
    alreadyWatched: getRandomBoolean(),
    watchingDate: '2019-04-12T16:12:32.554Z',
    favorite: getRandomBoolean()
  }
});

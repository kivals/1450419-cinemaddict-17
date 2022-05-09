import {getRandomInteger} from '../common/utils';

const generateRuntime = () => getRandomInteger(10, 380);
const generateTotalRating = () => getRandomInteger(1, 10, 0.1);

export const generateMovie = () => ({
  title: 'A Little Pony Without The Carpet',
  alternativeTitle: 'Laziness Who Sold Themselves',
  totalRating: generateTotalRating(),
  poster: 'images/posters/blue-blazes.jpg',
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
    'Comedy'
  ],
  description: 'Oscar-winning movie, a war drama about two young people, from the creators of timeless classic "Nu, Pogodi!" and "Alice in Wonderland", with the best fight scenes since Bruce Lee.'
});

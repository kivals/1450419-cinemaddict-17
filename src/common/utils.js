import dayjs from 'dayjs';
import {SortDirection} from './constants';

export const getRandomInteger = (min = 0, max = 1, interval = 1) => {
  const r = Math.floor(Math.random() * (max - min + interval) / interval);
  const result = r * interval + min;
  return interval < 1 ? result.toFixed(1) : result;
};

export const getRandomBoolean = () => Math.random() < .5;

export const humanizeDate = (date, format) => (dayjs(date).format(format));

export const getRandomValueFromArray = (array = []) => {
  if (array.length === 1) {
    return array[0];
  }
  const ranIndex = getRandomInteger(0, array.length - 1);
  return array[ranIndex];
};

export const getId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const convertMinutesToHours = (minutes) => {
  const hours = Math.floor(minutes / 60 );
  const min = minutes % 60;

  return hours ? `${hours}h ${min}m` : `${min}m`;
};

export const toUpperCaseFirstLetter = (string) => string[0].toUpperCase() + string.slice(1);

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const sortByDate = (direction) => (movieA, movieB) => direction === SortDirection.UP ?
  dayjs(movieA.release.date).diff(dayjs(movieB.release.date)) :
  dayjs(movieB.release.date).diff(dayjs(movieA.release.date));

export const sortByRating = (direction) => (movieA, movieB) => direction === SortDirection.UP ?
  movieA.totalRating - movieB.totalRating :
  movieB.totalRating - movieA.totalRating;


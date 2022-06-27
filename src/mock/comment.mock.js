import { SMILES } from '../common/constants';
import {getId, getRandomValueFromArray} from '../common/utils';

const generateSmile = () => (getRandomValueFromArray(SMILES));

export const getComments = (filmIds) => {
  const result = [];
  for (let i = 0; i < 10; i++) {
    result.push({
      id: getId(),
      author: 'Ilya O\'Reilly',
      comment: 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
      date: '2019-05-11T16:12:32.554Z',
      emotion: generateSmile(),
      filmId: getRandomValueFromArray(filmIds)
    });
  }
  return result;
};

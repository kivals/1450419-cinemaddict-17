import {navigationTypes} from '../common/constants';

export const generateNavList = () => navigationTypes.map((nav) => ({
  navigationName: nav,
  count: 147
}));

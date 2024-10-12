import memoizeOne from 'memoize-one';
import { api } from './http';
import { MainApiImpl } from './main';

const apiInstance = () => ({
  main: new MainApiImpl(api)
});

export const createApi = memoizeOne(apiInstance);
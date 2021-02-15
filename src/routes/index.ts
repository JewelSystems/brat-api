import { Application } from 'express';
import auth from './auth';
import user from './user';

const routes = (app: Application) => {
  auth(app);
  user(app);
};

export default routes;
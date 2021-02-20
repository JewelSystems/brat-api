import { Application, Request, Response } from 'express';
import API from '../api/auth';

let auth = (app: Application) => {
  app.post('/login', async (req: Request, res: Response) => {
    let response = await API.login(req.body.username, req.body.password);
    res.status(response.status).send(response.body);
  });
};

export default auth;

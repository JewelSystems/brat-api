import { Application, Request, Response } from 'express';
import API from '../api/user';

interface IResponse {
  status: number,
  body: {
    success?: string,
    error?: string
  }
}

let user = (app: Application) => {
  app.post('/user', async (req: Request, res: Response) => {
    let response: IResponse = await API.create(
      req.body.first_name, 
      req.body.last_name, 
      req.body.username, 
      req.body.nickname,
      req.body.email, 
      req.body.password, 
      req.body.gender, 
      req.body.birthday,
      req.body.phone_number,
      req.body.stream_link,
      req.body.twitch,
      req.body.twitter,
      req.body.facebook,
      req.body.instagram,
      req.body.youtube
    );
    
    res.status(response.status).send(response.body);
  });

  app.get('/user/:id', async (req, res) => {  
    let response = await API.get(req.params.id);
    res.status(response.status).send(response.body);
  });

};

export default user;
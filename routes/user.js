const API = require('../api/user');

module.exports = (app) => {
  app.post('/user', async (req, res) => {
    let response = await API.signup(
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

  app.put('/user/:id', async (req, res) => {  
    let response = await API.update(
      req.params.id,
      req.body.first_name, 
      req.body.last_name, 
      req.body.username, 
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

  app.delete('/user/:id', async (req, res) => {  
    let response = await API.delete(req.params.id);
    res.status(response.status).send(response.body);
  });
};


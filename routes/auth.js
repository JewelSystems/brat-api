const API = require('../api/auth');

module.exports = (app) => {

  // TODO / delete
  app.get('/',  (req, res) => {
    res.send('Hello World!');
  });

  app.post('/login', async (req, res) => {
    let response = await API.login(req.body.username, req.body.password);
    res.status(response.status).send(response.body);
  });
};
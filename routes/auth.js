const API = require('../api/auth');

module.exports = (app) => {
  app.post('/login', async (req, res) => {
    let response = await API.login(req.body.username, req.body.password);
    res.status(response.status).send(response.body);
  });
};
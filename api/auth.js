const Controller = require('../controller/auth');

exports.login = async function(username, password) {
  if (!username || !password) {
    return {
      status: 403,
      body: {
        error: "Missing username/password"
      }
    };
  }
  let response = await Controller.login(username, password);
  if (response.error) {
    return {
      status: 403,
      body: {
        error: response.error
      }
    };
  }
  return {
    status: 200,
    body: {
      token: response.token
    }
  };
};
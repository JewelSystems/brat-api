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
      id: response.id,
      token: response.token
    }
  };
};

exports.checkToken = async function(token){
  //Missing token]
  if(!token){
    return {"status": 403, "msg": "Missing token"};
  }
  let response = await Controller.redisAuthCheck(token);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  return {"status": 200, "msg": "authLogin", user: response.user, permissions: response.permissions};
};
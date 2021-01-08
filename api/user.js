const Controller = require('../controller/user');

exports.signup = async function(first_name, last_name, username, email, password, gender, birthday, phone_number, stream_link, twitch, twitter, facebook, instagram, youtube) {
  //Missing params TODO
  if (!username) {
    return {
      status: 403,
      body: {
        error: "Missing params"
      }
    };
  }
  //Request errors
  let response = await Controller.signup(first_name, last_name, username, email, password, gender, birthday, phone_number, stream_link, twitch, twitter, facebook, instagram, youtube);
  if (response.error) {
    return {
      status: 403,
      body: {
        error: response.error
      }
    };
  }
  //Successful request
  return {
    status: 200,
    body: {
      res: response.success
    }
  };
};

exports.get = async function(params) {
  //Missing params
  if (!params) {
    return {
      status: 403,
      body: {
        error: "Missing params"
      }
    };
  }
  let response = await Controller.get(params.id);
  if (response.error) {
    return {
      status: 403,
      body: {
        error: response.error
      }
    };
  }
  //Successful request
  return{
    status: 200,
    body: {
      res: response.success
    }
  }
};

exports.update = async function(params, first_name, last_name, username, email, password, gender, birthday, phone_number, stream_link, twitch, twitter, facebook, instagram, youtube) {
  //Missing params TODO
  if (!params) {
    return {
      status: 403,
      body: {
        error: "Missing params"
      }
    };
  }
  if(await Controller.checkUsername(params.id, username)){
    return {
      status: 403,
      body: {
        error: "Username already exists"
      }
    };
  }
  let response = await Controller.update(params.id, first_name, last_name, username, email, password, gender, birthday, phone_number, stream_link, twitch, twitter, facebook, instagram, youtube);
  if (response.error) {
    return {
      status: 403,
      body: {
        error: response.error
      }
    };
  }
  //Successful request
  return{
    status: 200,
    body: {
      res: response.success
    }
  }
};



exports.delete = async function(params) {
  //Missing params
  if (!params) {
    return {
      status: 403,
      body: {
        error: "Missing params"
      }
    };
  }
  let response = await Controller.delete(params.id);
  if (response.error) {
    return {
      status: 403,
      body: {
        error: response.error
      }
    };
  }
  //Successful request
  return{
    status: 200,
    body: {
      res: response.success
    }
  }
};
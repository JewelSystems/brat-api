const Controller = require('../controller/user');
const userSchema  = require('../schemas/UserSchema');

exports.signup = async function(first_name, last_name, username, nickname, email, password, gender, birthday, phone_number, stream_link, twitch, twitter, facebook, instagram, youtube) {
  // Schema Validation
  try{
    await userSchema.signup.validateAsync({
      first_name: first_name,
      last_name: last_name,
      username: username,
      nickname: nickname,
      email: email,
      password: password,
      gender: gender,
      birthday: birthday,
      phone_number: phone_number,
      stream_link: stream_link,
      twitch: twitch,
      twitter: twitter,
      facebook: facebook,
      instagram: instagram,
      youtube: youtube,
    });
  }catch(error){
    // Joi Schema validation error
    return {
      status: 403,
      body: {
        error: error
      }
    };
  }
  // Verify if user already exists
  if (await Controller.checkUsername(username)) {
    return {
      status: 403,
      body: {
        error: "Username already exists"
      }
    };
  }
  //Request errors
  let response = await Controller.signup(first_name, last_name, username, nickname, email, password, gender, birthday, phone_number, stream_link, twitch, twitter, facebook, instagram, youtube);
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

exports.get = async function(id) {
  //Missing id
  if (!id) {
    return {
      status: 403,
      body: {
        error: "Missing id"
      }
    };
  }
  // Verify if id exists
  if (! await Controller.checkId(id)) {
    return {
      status: 403,
      body: {
        error: "User not found"
      }
    };
  }
  let response = await Controller.get(id);
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
      res: response.success,
    }
  };
};

exports.update = async function(id, first_name, last_name, username, nickname, email, password, gender, birthday, phone_number, stream_link, twitch, twitter, facebook, instagram, youtube) {
  //Missing id
  if (!id) {
    return {
      status: 403,
      body: {
        error: "Missing id"
      }
    };
  }
  // Schema Validation
  try{
    await userSchema.signup.validateAsync({
      first_name: first_name,
      last_name: last_name,
      username: username,
      nickname: nickname,
      email: email,
      password: password,
      gender: gender,
      birthday: birthday,
      phone_number: phone_number,
      stream_link: stream_link,
      twitch: twitch,
      twitter: twitter,
      facebook: facebook,
      instagram: instagram,
      youtube: youtube,
    });
  }catch(error){
    // Joi Schema validation error
    return {
      status: 403,
      body: {
        error: error
      }
    };
  }
  // Verify if user exists
  if (! await Controller.checkUsername(username)) {
    return {
      status: 403,
      body: {
        error: "Username not found"
      }
    };
  }
  // Verify if id exists
  if (! await Controller.checkId(id)) {
    return {
      status: 403,
      body: {
        error: "User not found"
      }
    };
  }

  let response = await Controller.update(id, first_name, last_name, username, nickname, email, password, gender, birthday, phone_number, stream_link, twitch, twitter, facebook, instagram, youtube);
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
      res: response.success,
    }
  };
};

exports.delete = async function(id) {
  //Missing id
  if (!id) {
    return {
      status: 403,
      body: {
        error: "Missing id"
      }
    };
  }
  // Verify if id exists
  if (! await Controller.checkId(id)) {
    return {
      status: 403,
      body: {
        error: "User not found"
      }
    };
  }
  let response = await Controller.delete(id);
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
      res: response.success,
    }
  };
};

exports.getUsers = async function() {
  let response = await Controller.getUsers();
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "listUsers", data:[response.success]};
};

exports.getUserRuns = async function(id) {
  let response = await Controller.getUserRuns(id);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "listUserRuns", data:[response.success]};
};
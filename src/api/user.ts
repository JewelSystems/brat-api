import userSchema from '../schemas/UserSchema';
import Controller from '../controller/user';

export default {
  async create(
    firstName: string, 
    lastName: string, 
    username: string, 
    nickname: string,  
    email: string,  
    password: string, 
    gender: string,  
    birthday: string, 
    phoneNumber: string, 
    streamLink: string, 
    twitch: string, 
    twitter: string, 
    facebook: string, 
    instagram: string, 
    youtube: string) {
    //Schema Validation
    try{
      await userSchema.signup.validateAsync({
        first_name: firstName,
        last_name: lastName,
        username: username,
        nickname: nickname,
        email: email,
        password: password,
        gender: gender,
        birthday: birthday,
        phone_number: phoneNumber,
        stream_link: streamLink,
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
    let response = await Controller.create(
      firstName, 
      lastName, 
      username, 
      nickname, 
      email, 
      password, 
      gender, 
      birthday, 
      phoneNumber, 
      streamLink, 
      twitch, 
      twitter, 
      facebook, 
      instagram, 
      youtube);

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
  },

  async get(id: string){
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
  },

  async getUserRuns(id: string){
    let response = await Controller.getUserRuns(id);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "listUserRuns", data:[response.success]};
  },

  async getUsers() {
    let response = await Controller.getUsers();
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "listUsers", data:[response.success]};
  }

};
import Controller from '../controller/auth';

interface IResponse {
  status: number;
  body: {
    success?: string;
    error?: string;
    id?: number;
    token?: string;
  }
}

interface APIResponse{
  status: number;
  msg: string;
  data?: any;
  user?: string;
  permissions?: any;
}

export  default{
  async login(username: string, password: string): Promise<IResponse>{
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
  },

  async checkToken(token: string): Promise<APIResponse>{
    //Missing token
    if(!token){
      return {"status": 403, "msg": "Missing token"};
    }
    let response = await Controller.redisAuthCheck(token);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    return {"status": 200, "msg": "authLogin", user: response.user, permissions: response.permissions};
  }
};
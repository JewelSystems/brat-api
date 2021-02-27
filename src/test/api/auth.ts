process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'brat-test';
import { assert } from 'chai';
import API from '../../api/auth';
import { getRepository, Repository } from 'typeorm';
import User from '../../models/User';
import userCtrl from '../../controller/user';

let userRepo: Repository<User>;

describe('AuthAPI', async function(){
  before(async function() {
    userRepo = getRepository(User);
  
    await getRepository(User)
      .createQueryBuilder("user")
      .delete()
      .from(User)
      .execute();
  });
  afterEach(async function() {
    await getRepository(User)
      .createQueryBuilder("user")
      .delete()
      .from(User)
      .execute();
  });
  describe('API.login', async function(){
    it('API.login should return an user token', async function(){
      await userCtrl.create(
        'Nome', 
        'Sobrenome', 
        'Usuario', 
        'Nickname', 
        'email@email.com', 
        '12345678', 
        'M', 
        '2000-01-01', 
        '021999999999', 
        'http://www.streamlink.com', 
        'http://www.twitch.com', 
        'http://www.twitter.com', 
        'http://www.facebook.com', 
        'http://www.instagram.com', 
        'http://www.youtube.com');

      const resp = await API.login('Usuario', '12345678');

      const token = resp.body.token;
      const userId = (await userRepo.findOneOrFail({ first_name: "Nome" })).id;
  
      assert.equal(JSON.stringify(resp), JSON.stringify({
        "status":200,
        "body":{
          "id":String(userId),
          "token": token
        }
      }));
    });
    it('API.login should return an error if there is no data', async function(){
      const resp = JSON.stringify(await API.login('',''));
      assert.equal(resp, JSON.stringify({"status":403,"body":{"error":"Missing username/password"}}));
    });
    it('API.login should return an error if the user does not exist', async function(){
      const resp = JSON.stringify(await API.login('aaa','12345678'));
      assert.equal(resp, JSON.stringify({"status":403,"body":{"error":"User not found"}}));
    });
    it('API.login should return an error if the username and password does not match', async function(){
      await userCtrl.create(
        'Nome', 
        'Sobrenome', 
        'Usuario', 
        'Nickname', 
        'email@email.com', 
        '12345678', 
        'M', 
        '2000-01-01', 
        '021999999999', 
        'http://www.streamlink.com', 
        'http://www.twitch.com', 
        'http://www.twitter.com', 
        'http://www.facebook.com', 
        'http://www.instagram.com', 
        'http://www.youtube.com');

      const resp = JSON.stringify(await API.login('Usuario','87654321'));
      assert.equal(resp, JSON.stringify({"status":403,"body":{"error":"Username and password does not match"}}));
    });
  });
  describe('API.checkToken', async function(){
    it('API.checkToken should return an error if there is no data', async function(){
      const resp = JSON.stringify(await API.checkToken(''));
      assert.equal(resp, JSON.stringify({"status":403,"msg":"Missing token"}));
    });
    it('API.checkToken should return an error if a unexistent token is used', async function(){
      const resp = JSON.stringify(await API.checkToken('aaa'));
      assert.equal(resp, JSON.stringify({"status":403,"msg":"Token not found"}));
    });
    it('API.checkToken should return a successful message if the token was found', async function(){
      await userCtrl.create(
        'Nome', 
        'Sobrenome', 
        'Usuario', 
        'Nickname', 
        'email@email.com', 
        '12345678', 
        'M', 
        '2000-01-01', 
        '021999999999', 
        'http://www.streamlink.com', 
        'http://www.twitch.com', 
        'http://www.twitter.com', 
        'http://www.facebook.com', 
        'http://www.instagram.com', 
        'http://www.youtube.com');

      const token = (await API.login('Usuario', '12345678')).body.token;

      const resp = JSON.stringify(await API.checkToken(String(token)));

      const user = await userRepo.findOneOrFail({ first_name:"Nome" });

      assert.equal(resp, JSON.stringify({"status":200,"msg":"authLogin","user":user.id,"permissions":["None"]}));
    });
  });
});
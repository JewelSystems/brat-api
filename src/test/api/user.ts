process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'brat-test';
import { assert } from 'chai';
import API from '../../api/user';
import { createConnection, getConnection, getRepository, Repository } from 'typeorm';
import User from '../../models/User';
import UserPermissionCtrl from '../../controller/userPermission';
import RunCtrl from '../../controller/run';
import EventCtrl from '../../controller/event';
import Run from '../../models/Run';
import Event from '../../models/Event';
import Game from '../../models/Game';

let userRepo: Repository<User>;

describe('UserAPI', async function(){
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

    await getRepository(Event)
      .createQueryBuilder("event")
      .delete()
      .from(Event)
      .execute();
  
    await getRepository(Run)
      .createQueryBuilder("run")
      .delete()
      .from(Run)
      .execute();
  
    await getRepository(Game)
      .createQueryBuilder("game")
      .delete()
      .from(Game)
      .execute();
  });


  describe('API.create', async function(){
    it('API.create should successfully create an User', async function(){
      const resp = JSON.stringify(await API.create(
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
        'http://www.youtube.com'));

      await userRepo.findOneOrFail({ 'first_name': 'Nome' });

      assert.equal(resp, JSON.stringify({"status":200,"body":{"res":"Creation success"}}));
    });
    it('API.create should return a JOI error', async function(){
      const resp = JSON.stringify(await API.create(
        'Nome', 
        'Sobrenome', 
        'Usuario', 
        'Nickname', 
        'emailemail.com', 
        '12345678', 
        'M', 
        '2000-01-01', 
        '021999999999', 
        'http://www.streamlink.com', 
        'http://www.twitch.com', 
        'http://www.twitter.com', 
        'http://www.facebook.com', 
        'http://www.instagram.com', 
        'http://www.youtube.com'));
      
      assert.equal(resp, JSON.stringify({
        "status":403,
        "body":{
          "error":{
            "_original":{
              "first_name":"Nome",
              "last_name":"Sobrenome",
              "username":"Usuario",
              "nickname":"Nickname",
              "email":"emailemail.com",
              "password":"12345678",
              "gender":"M",
              "birthday":"2000-01-01",
              "phone_number":"021999999999",
              "stream_link":"http://www.streamlink.com",
              "twitch":"http://www.twitch.com",
              "twitter":"http://www.twitter.com",
              "facebook":"http://www.facebook.com",
              "instagram":"http://www.instagram.com",
              "youtube":"http://www.youtube.com"
            },
            "details":[
              {
                "message":"\"email\" must be a valid email",
                "path":["email"],
                "type":"string.email",
                "context":{
                  "value":"emailemail.com",
                  "invalids":["emailemail.com"],
                  "label":"email",
                  "key":"email"
                }
              }
            ]
          }
        }
      }));
    });
    it('API.create should return a error, because the user already exists', async function(){
      await API.create(
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
      
      const resp = JSON.stringify(await API.create(
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
        'http://www.youtube.com'));

      assert.equal(resp, JSON.stringify({"status":403,"body":{"error":"Username already exists"}}));
    });
  });
  describe('API.getUserRuns', async function(){
    it('API.getUserRuns should return the runs of an user', async function(){
      await API.create(
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

      const userId = (await userRepo.findOneOrFail({ 'first_name': 'Nome' })).id;

      const eventId = (await EventCtrl.create('Evento', 'www.donation.com.br', '2021-01-01', '2021-02-01')).success.id;
      await EventCtrl.updateEventState(eventId);

      await RunCtrl.createRunNGame(String(userId), '100%', 600, '1000', "PC", "Game1", "2000", []);
      await RunCtrl.createRunNGame(String(userId), '100%', 600, '1000', "PC", "Game2", "2000", []);

      const resp = JSON.stringify(await API.getUserRuns(String(userId)));

      assert.equal(resp, JSON.stringify(
        {
          "status":200,
          "msg":"listUserRuns",
          "data":
          [
            [
              {"event":"Evento","game":"Game1","category":"100%","platform":"PC","time_slot":"1000","waiting":0,"reviewed":0,"approved":0},
              {"event":"Evento","game":"Game2","category":"100%","platform":"PC","time_slot":"1000","waiting":0,"reviewed":0,"approved":0}
            ]
          ]
        }));
    });
    it('API.getUserRuns should return an error if a unexistent user is used', async function(){
      const resp = JSON.stringify(await API.getUserRuns(''));
      assert.equal(resp, JSON.stringify({"status":403,"msg":"Server error"}));
    });
  });
  describe('API.get', async function(){
    it('API.get should return an user', async function(){
      await API.create(
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

      const userId = (await userRepo.findOneOrFail({ 'first_name': 'Nome' })).id;

      const resp = JSON.stringify(await API.get(String(userId)));

      assert.equal(resp, JSON.stringify({
        "status":200,
        "body":{
          "res":
          [
            {
              "id":String(userId),
              "first_name":"Nome",
              "last_name":"Sobrenome",
              "username":"Usuario",
              "email":"email@email.com",
              "gender":"M",
              "phone_number":"021999999999",
              "stream_link":"http://www.streamlink.com",
              "twitch":"http://www.twitch.com",
              "twitter":"http://www.twitter.com",
              "facebook":"http://www.facebook.com",
              "instagram":"http://www.instagram.com",
              "youtube":"http://www.youtube.com",
              "permissions":"None"
            }
          ]
        }
      }));
    });
    it('API.get should return an error if missing id', async function(){
      const resp = JSON.stringify(await API.get(""));

      assert.equal(resp, JSON.stringify({"status":403,"body":{"error":"Missing id"}}));
    });
    it('API.get should return an error if an unexistend id is passed', async function(){
      const resp = JSON.stringify(await API.get("-1"));

      assert.equal(resp, JSON.stringify({"status":403,"body":{"error":"User not found"}}));
    });
    it('API.get should return an error if the user does not have any permission', async function(){
      await API.create(
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

      const userId = (await userRepo.findOneOrFail({ 'first_name': 'Nome' })).id;

      await UserPermissionCtrl.removePermission(String(userId), String(userId), "None");

      const resp = JSON.stringify(await API.get(String(userId)));

      assert.equal(resp, JSON.stringify({"status":403,"body":{"error":"Server error"}}));
    });
  });
  describe('API.getUsers', async function(){
    it("API.getUsers should return the existent users and it's permissions", async function(){
      await API.create(
        'Nome1', 
        'Sobrenome', 
        'Usuario1', 
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
    
      await API.create(
        'Nome2', 
        'Sobrenome', 
        'Usuario2', 
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

      const user1 = await userRepo.findOneOrFail({ username: 'Usuario1' });
      const user2 = await userRepo.findOneOrFail({ username: 'Usuario2' });

      await UserPermissionCtrl.addPermission(String(user1.id), String(user1.id), 'Admin');

      const resp = JSON.stringify(await API.getUsers());

      assert.equal(resp, JSON.stringify({
        "status":200,
        "msg":"listUsers",
        "data":[
          [
            {"id":String(user1.id),"first_name":"Nome1","last_name":"Sobrenome","username":"Usuario1","email":"email@email.com","permissions":["None","Admin"]},
            {"id":String(user2.id),"first_name":"Nome2","last_name":"Sobrenome","username":"Usuario2","email":"email@email.com","permissions":["None"]}
          ]
        ]
      }));
    });
    it("API.getUsers should return an error if there is no connection", async function(){
      await getConnection().close();

      const resp = JSON.stringify(await API.getUsers());
      assert.equal(resp, JSON.stringify({"status":403,"msg":"Server error"}));

      await createConnection();
    });
  });
});
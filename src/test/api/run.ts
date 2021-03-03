process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'brat-test';
import { assert } from 'chai';
import API from '../../api/run';
import { createConnection, getConnection, getRepository, Repository } from 'typeorm';
import Run from '../../models/Run';
import User from '../../models/User';
import Game from '../../models/Game';
import Event from '../../models/Event';
import UserController from '../../controller/user';
import GameController from '../../controller/game';
import EventController from '../../controller/event';
import BidwarOption from '../../models/BidwarOption';


let runRepo: Repository<Run>;
let userRepo: Repository<User>;
let eventRepo: Repository<Event>;
let userId: string;
let gameId: string;

describe('RunAPI', async function(){
  before(async function() {
    runRepo = getRepository(Run);
  
    await getRepository(Event)
      .createQueryBuilder("event")
      .delete()
      .from(Event)
      .execute();

    await getRepository(User)
      .createQueryBuilder("user")
      .delete()
      .from(User)
      .execute();

    await getRepository(Run)
      .createQueryBuilder("run")
      .delete()
      .from(Run)
      .execute();

    await UserController.create('Nome', 'Sobrenome', 'Usuario', 'Nickname', 'email@email.com', '12345678', 'M', '2000/01/01', '021999999999', '', '', '', '', '', '');

    userRepo = getRepository(User);
    const user = (await userRepo.find())[0];
    userId = String(user.id);

    await GameController.create('Jogo', '2000');
    gameId = (await GameController.getGames()).success[0].id;

    const eventId = (await EventController.create('Evento', 'www.donation.com.br', '2021-01-01', '2021-02-01')).success.id;
    await EventController.updateEventState(eventId);
  });
  afterEach(async function() {
    await getRepository(Run)
      .createQueryBuilder("run")
      .delete()
      .from(Run)
      .execute();
  });

  after(async function(){
    await getRepository(User)
      .createQueryBuilder("user")
      .delete()
      .from(User)
      .execute();
      
    await getRepository(Game)
      .createQueryBuilder("game")
      .delete()
      .from(Game)
      .execute();

    await getRepository(Event)
      .createQueryBuilder("event")
      .delete()
      .from(Event)
      .execute();

    await getRepository(BidwarOption)
      .createQueryBuilder("bidwar_option")
      .delete()
      .from(BidwarOption)
      .execute();
  });

  describe('API.create', async function(){
    it('API.create should create a new run', async function(){
      const resp = JSON.stringify(await API.create(userId, gameId, "100%", 600, '0001', 'PC', [
        {"type": 'private', "comment": "comment", "name": "name", options:[
          {"name": "option1"},
          {"name": "option2"},
          {"name": "option3"},
        ]},
        {"type": 'public', "comment": "comment", "name": "name", options:[]},
        {"type": 'none', "comment": "comment", "name": "name", options:[]}
      ]));
      assert.equal(resp, JSON.stringify({"status":200,"msg":"createRun","data":["Creation success"]}));
    });
    it('API.create should return an error if missing data', async function(){
      const resp = JSON.stringify(await API.create('', '', '', 600, '', '', []));
      assert.equal(resp, JSON.stringify({"status":403,"msg":"Server error"}));
    });
  });
  describe('API.createRunNGame', async function(){
    it("API.createRunNGame should create a new run and it's game", async function(){
      const resp = JSON.stringify(await API.createRunNGame(userId, '100%', 600, '1000', "PC", "Game", "2000", []));
      assert.equal(resp, JSON.stringify({"status":200,"msg":"createRunNGame","data":["Creation success"]}));
    });
    it("API.createRunNGame should return an error if there's no connection", async function(){
      await getConnection().close();

      const resp = JSON.stringify(await API.createRunNGame('', '', 600, '', "", "", "", []));
      assert.equal(resp, JSON.stringify({"status":403,"msg":"Server error"}));

      await createConnection();
    });
  });
});
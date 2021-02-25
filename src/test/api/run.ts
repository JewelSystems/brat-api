/*
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'brat-test';
import { assert } from 'chai';
import API from '../../api/run';
import { createConnection, getConnection, getRepository, Repository } from 'typeorm';
import Run from '../../models/Run';
import UserController from '../../controller/user';
import User from '../../models/User';
import GameController from '../../controller/game';
import Game from '../../models/Game';

let runRepo: Repository<Run>;
let userRepo: Repository<User>;
let userId: string;
let gameId: string;

describe.only('RunAPI', async function(){
  before(async function() {
    runRepo = getRepository(Run);
  
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
  });

  describe('API.create', async function(){
    it('API.create should return a new run', async function(){
      const resp = JSON.stringify(await API.create(userId, gameId, "100%", 600, '0001', 'PC', []));
      assert.equal(resp, '');
    });
  });
});
*/
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'brat-test';
import { assert } from 'chai';
import API from '../../api/game';
import { createConnection, getConnection, getRepository, Repository } from 'typeorm';
import Game from '../../models/Game';

let gameRepo: Repository<Game>;

describe('GameAPI', async function(){
  before(async function() {
    gameRepo = getRepository(Game);
  
    await getRepository(Game)
      .createQueryBuilder("game")
      .delete()
      .from(Game)
      .execute();
  });

  afterEach(async function() {
    await getRepository(Game)
      .createQueryBuilder("game")
      .delete()
      .from(Game)
      .execute();
  });

  describe('API.create', async function(){
    it('API.create should create a new game', async function(){
      const resp = JSON.stringify(await API.create("Jogo", "2000"));

      const game = await gameRepo.findOne({
        'name': 'Jogo',
      });

      assert.equal(resp, JSON.stringify({"status":200,"msg":"createGame","data":[{"name":"Jogo","year":"2000","id":Number(game?.id)}],"type":"adminBroadcast"}));

    });
    it('API.create should return an error if there is no connections', async function(){
      await getConnection().close();

      const resp = JSON.stringify(await API.create("Jogo", "2000"));
      assert.equal(resp, JSON.stringify({"status": 403, "msg": "Server error"}));
      
      await createConnection();
    });
  });
  describe('API.getGames', async function(){
    it('API.getGames should return the existent games', async function(){
      const game1 = (await API.create('Jogo1', '2000')).data[0];
      const game2 = (await API.create('Jogo2', '2000')).data[0];
    
      const resp = JSON.stringify(await API.getGames());

      assert.equal(resp, JSON.stringify({"status":200,"msg":"listGames","data":[
        [
          {"id":String(game1.id),"name":game1.name,"year":game1.year},
          {"id":String(game2.id),"name":game2.name,"year":game2.year}
        ]
      ]}));
    });
    it('API.getGames should return an error if there is no connections', async function(){
      await getConnection().close();

      const resp = JSON.stringify(await API.getGames());
      assert.equal(resp, JSON.stringify({ status: 403, msg: 'Server error' }));

      await createConnection();
    });
  });
  describe('API.update', async function(){
    it('API.update should return a success message', async function(){
      const game = (await API.create('Jogo', '2000')).data[0];

      const resp = JSON.stringify(await API.update(String(game.id), 'Jogo2', '2001'));

      assert.equal(resp, JSON.stringify({"status":200,"msg":"updateGame","data":["Update success"]}));
    });
    it('API.update should return an error if there is no connections', async function(){
      await getConnection().close();

      const resp = JSON.stringify(await API.update('0', 'Jogo2', '2001'));
      assert.equal(resp, JSON.stringify({"status":403,"msg":"Server error"}));

      await createConnection();
    });
  });
});
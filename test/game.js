const assert = require('chai').assert;
const API = require('../api/game');
const Game = require('../models/Game');

beforeEach(async function() {
  await Game.destroy({where: {}});
});

describe('GameAPI', function(){
  describe('API Create', function(){
    it('API.create should return a successful response', async function(){
      const resp = JSON.stringify(await API.create("Jogo", "2000"));
      assert.equal(resp, JSON.stringify({"status": 200, "msg": "createGame", data:["Creation success"]}));
    });
    it('API.create should return a server error when the year is bigger than 4', async function(){
      const resp = JSON.stringify(await API.create("Jogo", "12345"));
      assert.equal(resp, JSON.stringify({"status": 403, "msg": "Server error"}));
    });
  });
  describe('Api get', function(){
    it('API.get should return the requested game', async function(){
      const game = await Game.create({name: "Jogo", year: "2000"});
      const resp = JSON.stringify(await API.get(game.id));
      assert.equal(resp, JSON.stringify({"status": 200, "msg": "getGame", data:[{"id":game.id, "name":"Jogo", "year":"2000"}]}));
    });
  });
});
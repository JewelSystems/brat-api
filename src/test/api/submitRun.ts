process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'brat-test';
import { assert } from 'chai';
import API from '../../api/submitRun';
import { createConnection, getConnection, getRepository, Repository } from 'typeorm';
import SubmitRun from '../../models/SubmitRun';
import User from '../../models/User';
import Event from '../../models/Event';
import Run from '../../models/Run';
import UserController from '../../controller/user';
import GameController from '../../controller/game';
import EventController from '../../controller/event';
import RunController from '../../controller/run';
import Game from '../../models/Game';
import BidwarOption from '../../models/BidwarOption';
import RunIncentive from '../../models/RunIncentive';

let submitRunRepo: Repository<SubmitRun>;
let userRepo: Repository<User>;
let runRepo: Repository<Run>;
let runIncentiveRepo: Repository<RunIncentive>;
let bidwarOptionRepo: Repository<BidwarOption>;

let userId: string;
let gameId: string;
let runId: string;
let submitRunId: string;
let incentiveIds: string[] = [];
let optionIds: string[] = [];

describe.only('submitRunAPI', async function(){
  before(async function() {
    submitRunRepo = getRepository(SubmitRun);
    userRepo = getRepository(User);
    runRepo = getRepository(Run);
    runIncentiveRepo = getRepository(RunIncentive);
    bidwarOptionRepo = getRepository(BidwarOption);
  
    await getRepository(SubmitRun)
      .createQueryBuilder("submit_run")
      .delete()
      .from(SubmitRun)
      .execute();
    
        
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

    await RunController.create(userId, gameId, "100%", 600, '0001', 'PC', [
      {"type": 'private', "comment": "comment1", "name": "name1", options:[
        {"name": "option1"},
        {"name": "option2"},
        {"name": "option3"},
      ]},
      {"type": 'public', "comment": "comment2", "name": "name2", options:[]},
      {"type": 'none', "comment": "comment3", "name": "name3", options:[]}
    ]);

    runId = String((await runRepo.find())[0].id);
    submitRunId = String((await submitRunRepo.find())[0].id);
    
    const incentives = await runIncentiveRepo.find();
    for(let incentive of incentives){
      incentiveIds.push(String(incentive.id));
    }

    const options = await bidwarOptionRepo.find();
    for(let option of options){
      optionIds.push(String(option.id));
    }

  });

  after(async function() {
    await getRepository(SubmitRun)
      .createQueryBuilder("submit_run")
      .delete()
      .from(SubmitRun)
      .execute();

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
  describe('API.getSubmitRuns', async function(){
    it('API.getSubmitRuns should return current submitted runs', async function(){
      const resp = JSON.stringify(await API.getSubmitRuns());

      assert.equal(resp, JSON.stringify(
        {
          "status":200,
          "msg":"getSubmitRuns",
          "data":
          [
            [
              {
                "id":submitRunId,"event_name":"Evento","game_name":"Jogo","category":"100%","platform":"PC","time_slot":"0001","reviewed":0,"approved":0,"waiting":0,"runner":"Nickname",
                "incentives":
                [
                  {"id":incentiveIds[0],"run_id":runId,"type":"private","comment":"comment1","name":"name1",
                    "BidwarOptions":
                    [
                      {"id":optionIds[0],"option":"option1","incentive_id":incentiveIds[0]},
                      {"id":optionIds[1],"option":"option2","incentive_id":incentiveIds[0]},
                      {"id":optionIds[2],"option":"option3","incentive_id":incentiveIds[0]}
                    ]},
                  {"id":incentiveIds[1],"run_id":runId,"type":"public","comment":"comment2","name":"name2",
                    "BidwarOptions":[]},
                  {"id":incentiveIds[2],"run_id":runId,"type":"none","comment":"comment3","name":"name3",
                    "BidwarOptions":[]}
                ],"approved_incentives":{},"goals":{}
              }
            ]
          ]}));
    });
  });

});
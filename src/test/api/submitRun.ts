process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'brat-test';
import { assert } from 'chai';
import API from '../../api/submitRun';
import { createConnection, getConnection, getRepository, Repository } from 'typeorm';
import SubmitRun from '../../models/SubmitRun';
import User from '../../models/User';
import Event from '../../models/Event';
import Run from '../../models/Run';
import Game from '../../models/Game';
import BidwarOption from '../../models/BidwarOption';
import RunIncentive from '../../models/RunIncentive';
import UserController from '../../controller/user';
import GameController from '../../controller/game';
import EventController from '../../controller/event';
import RunController from '../../controller/run';
import EventRun from '../../models/EventRun';
import EventRunIncentive from '../../models/EventRunIncentive';

let submitRunRepo: Repository<SubmitRun>;
let userRepo: Repository<User>;
let runRepo: Repository<Run>;
let runIncentiveRepo: Repository<RunIncentive>;
let bidwarOptionRepo: Repository<BidwarOption>;
let eventRunRepo: Repository<EventRun>;

let userId: string;
let gameId: string;
let eventId: string;
let runId: string;
let eventRunId: string;
let submitRunId: string;
let incentiveIds: string[] = [];
let optionIds: string[] = [];

describe('submitRunAPI', async function(){
  before(async function() {
    submitRunRepo = getRepository(SubmitRun);
    userRepo = getRepository(User);
    runRepo = getRepository(Run);
    runIncentiveRepo = getRepository(RunIncentive);
    bidwarOptionRepo = getRepository(BidwarOption);
    eventRunRepo = getRepository(EventRun);
      
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

    eventId = (await EventController.create('Evento', 'www.donation.com.br', '2021-01-01', '2021-02-01')).success.id;
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

  describe('API.update', async function(){
    it('API.update should update a scheduled item state', async function(){
      const resp = JSON.stringify(await API.update(submitRunId, true, true, false));

      eventRunId = String((await eventRunRepo.find())[0].id);

      assert.equal(resp, JSON.stringify(
        {
          "status":200,
          "msg":"updateSubmitRuns",
          "data":
          [
            {
              "id":submitRunId,"reviewed":true,"approved":true,"waiting":false,"event_run":{"event_id":String(eventId),"run_id":String(runId),"date":"01-01-2021","id":Number(eventRunId)}
            }
          ]
          ,"type":"adminBroadcast"
        }));
    });
    it('API.update should return an error if a inexistent run was given', async function(){
      const resp = JSON.stringify(await API.update('', true, true, false));
      assert.equal(resp, JSON.stringify({"status":403,"msg":"Server error"}));
    });
  });

  describe('API.updateSubmitRunNRunIncentives', async function(){
    it("API.updateSubmitRunNRunIncentives should be able to change a submitted run state and update it's incentives states", async function(){
      const incentives = 
      [
        {
          id: incentiveIds[0],
          run_id: runId,
          type: "private",
          comment: "comment1",
          name: "name1",
          options: 
          [
            {
              id: optionIds[0],
              name: "option1",
            },
            {
              id: optionIds[1],
              name: "option2",
            },
            {
              id: optionIds[2],
              name: "option3",
            },
          ],
          goal: 0
        }
      ];

      const resp = JSON.stringify(await API.updateSubmitRunNRunIncentives(submitRunId, true, true, false, incentives));

      assert.equal(resp, `{"status":200,"msg":"updateSubmitRunsNRunIncentives","data":[{"id":"${submitRunId}","reviewed":true,"approved":true,"waiting":false,"approved_incentives":{"${incentiveIds[0]}":true,"${incentiveIds[1]}":false,"${incentiveIds[2]}":false},"goals":{}}],"type":"adminBroadcast"}`);
    });
    it("API.updateSubmitRunNRunIncentives should return return an error if missing data", async function(){
      const incentives = 
      [
        {
          id: incentiveIds[0],
          run_id: runId,
          type: "private",
          comment: "comment1",
          name: "name1",
          options: 
          [
            {
              id: optionIds[0],
              name: "option1",
            },
            {
              id: optionIds[1],
              name: "option2",
            },
            {
              id: optionIds[2],
              name: "option3",
            },
          ],
          goal: 0
        }
      ];

      const resp = JSON.stringify(await API.updateSubmitRunNRunIncentives('', true, true, false, incentives));

      assert.equal(resp, JSON.stringify({"status":403,"msg":"Server error"}));
    });
  });

  describe('API.refuseSubmitRunNRemoveIncentives', async function(){
    it('API.refuseSubmitRunNRemoveIncentives should refuse all incentives of certain submitted run', async function(){
      const resp = JSON.stringify(await API.refuseSubmitRunNRemoveIncentives(submitRunId, true, false, false));

      assert.equal(resp, JSON.stringify(
        {
          "status":200,
          "msg":"updateSubmitRunNRemoveIncentives",
          "data":
          [
            {
              "id":String(submitRunId),
              "reviewed":true,
              "approved":false,
              "waiting":false
            }
          ]
          ,"type":"adminBroadcast"
        }));
    });
    it('API.refuseSubmitRunNRemoveIncentives should return an error if a unexistent id is used', async function(){
      const resp = JSON.stringify(await API.refuseSubmitRunNRemoveIncentives('', true, false, false));
      assert.equal(resp, JSON.stringify({"status":403,"msg":"Server error"}));
    });
  });
    
  describe('API.getSubmitRuns', async function(){
    it('API.getSubmitRuns should return current submitted runs', async function(){
      const resp = JSON.stringify(await API.getSubmitRuns());

      const temp = `{"status":200,"msg":"getSubmitRuns","data":[[{"id":"${submitRunId}","event_name":"Evento","game_name":"Jogo","category":"100%","platform":"PC","time_slot":"0001","reviewed":1,"approved":0,"waiting":0,"runner":"Nickname","incentives":[{"id":"${incentiveIds[0]}","run_id":"${runId}","type":"private","comment":"comment1","name":"name1","BidwarOptions":[{"id":"${optionIds[0]}","option":"option1","incentive_id":"${incentiveIds[0]}"},{"id":"${optionIds[1]}","option":"option2","incentive_id":"${incentiveIds[0]}"},{"id":"${optionIds[2]}","option":"option3","incentive_id":"${incentiveIds[0]}"}]},{"id":"${incentiveIds[1]}","run_id":"${runId}","type":"public","comment":"comment2","name":"name2","BidwarOptions":[]},{"id":"${incentiveIds[2]}","run_id":"${runId}","type":"none","comment":"comment3","name":"name3","BidwarOptions":[]}],"approved_incentives":{"${incentiveIds[0]}":"false","${incentiveIds[1]}":"false","${incentiveIds[2]}":"false"},"goals":{}}]]}`;

      assert.equal(resp, temp);
    });
    it('API.getSubmitRuns should return an error if there is no connection', async function(){
      await getConnection().close();

      const resp = JSON.stringify(await API.getSubmitRuns());

      await createConnection();

      assert(resp, JSON.stringify({"status":403,"msg":"Server error"}));

    });
  });
});
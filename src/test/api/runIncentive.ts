process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'brat-test';
import { assert } from 'chai';
import API from '../../api/runIncentive';
import { getRepository, Repository } from 'typeorm';
import RunIncentive from '../../models/RunIncentive';
import UserController from '../../controller/user';
import User from '../../models/User';
import GameController from '../../controller/game';
import EventController from '../../controller/event';
import runAPI from '../../api/run';
import Game from '../../models/Game';
import Event from '../../models/Event';
import BidwarOption from '../../models/BidwarOption';
import EventScheduleCtrl from '../../controller/eventSchedule';
import SubmitRunCtrl from '../../controller/submitRun';
import SubmitRun from '../../models/SubmitRun';
import Run from '../../models/Run';
import EventRun from '../../models/EventRun';

let runIncentiveRepo: Repository<RunIncentive>;
let userRepo: Repository<User>;
let bidwarOptionRepo: Repository<BidwarOption>;
let submitRunRepo: Repository<SubmitRun>;
let runRepo: Repository<Run>;
let eventRunRepo: Repository<EventRun>;

let userId: string;
let gameId: string;
let incentiveId: string;
let optionId: string;
let eventRunId: string;
let runId: string;
let incentiveIds: string[] = [];
let optionIds: string[] = [];

interface IIncentive{
  id: string;
  name: string;
  comment: string;
  bidwar_options: {id: string; option: string; incentive_id: string}[];
  goal?: number;
}

describe('RunIncentiveAPI', async function(){
  before(async function() {
    runIncentiveRepo = getRepository(RunIncentive);
    bidwarOptionRepo = getRepository(BidwarOption);
    submitRunRepo = getRepository(SubmitRun);
    userRepo = getRepository(User);
    runRepo = getRepository(Run);
    eventRunRepo = getRepository(EventRun);
  
    await getRepository(RunIncentive)
      .createQueryBuilder("runIncentive")
      .delete()
      .from(RunIncentive)
      .execute();

    await UserController.create('Nome', 'Sobrenome', 'Usuario', 'Nickname', 'email@email.com', '12345678', 'M', '2000/01/01', '021999999999', '', '', '', '', '', '');

    userRepo = getRepository(User);
    const user = (await userRepo.find())[0];
    userId = String(user.id);

    await GameController.create('Jogo', '2000');
    gameId = (await GameController.getGames()).success[0].id;

    const eventId = (await EventController.create('Evento', 'www.donation.com.br', '2021-01-01', '2021-02-01')).success.id;
    await EventController.updateEventState(eventId);

    await runAPI.create(userId, gameId, "100%", 600, '0001', 'PC', [
      {"type": 'private', "comment": "comment1", "name": "name1", options:[
        {"name": "option1"},
        {"name": "option2"},
        {"name": "option3"},
      ]},
    ]);
    runId = String((await runRepo.find())[0].id);

    incentiveId = String((await runIncentiveRepo.findOneOrFail({ name: 'name1' })).id);
    optionId = String((await bidwarOptionRepo.findOneOrFail({ option: 'option1' })).id);
    
    const submitRunId = String((await submitRunRepo.find())[0].id);
    
    const incentives = await runIncentiveRepo.find();
    for(let incentive of incentives){
      incentiveIds.push(String(incentive.id));
    }

    const options = await bidwarOptionRepo.find();
    for(let option of options){
      optionIds.push(String(option.id));
    }

    const incentivesAux = 
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

    await SubmitRunCtrl.updateSubmitRunNRunIncentives(submitRunId, true, true, false, incentivesAux);
    eventRunId = String((await eventRunRepo.findOne())?.id);
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
  
  describe('API.update', async function(){
    it('API.update should update an incentive', async function(){
      const incentive: IIncentive = {
        id: incentiveId,
        name: 'nome',
        comment: 'comentario',
        bidwar_options: [
          {id: optionId, option: 'opcao', incentive_id: incentiveId}
        ]
      };
      const resp = JSON.stringify(await API.update(incentive));
      
      assert.equal(resp, JSON.stringify({
        "status":200,
        "msg":"updateIncentive",
        "data":[
          {
            "id":incentiveId,
            "name":"nome",
            "comment":"comentario",
            "bidwar_options":[
              {
                "id":optionId,
                "option":"opcao",
                "incentive_id":incentiveId
              }
            ]
          }
        ],
        "type":"adminBroadcast"
      }));
    });
    it('API.update should return an error', async function(){
      const incentive: IIncentive = {
        id: '',
        name: 'nome',
        comment: 'comentario',
        bidwar_options: [
          {id: optionId, option: 'opcao', incentive_id: incentiveId}
        ]
      };
      const resp = JSON.stringify(await API.update(incentive));
      
      assert.equal(resp, JSON.stringify({"status":403,"msg":"Server error"}));
    });
  });
  
  describe('API.getRunIncentives', async function(){
    it('API.getRunIncentives should return the incentives of a run', async function(){
      const eventScheduleId = (await EventScheduleCtrl.create("1", 'run', eventRunId, '', '0')).success.success[0].id;
      const resp = JSON.stringify(await API.getRunIncentives(eventScheduleId));

      assert.equal(resp, JSON.stringify({"status":200,"msg":"getRunIncentives","data":[[{"id":incentiveIds[0],"incentive":"nome","options":["opcao","option2","option3"]}]]}));
    });
    it('API.getRunIncentives should return an error if a unexistent event schedule id is used', async function(){
      const resp = JSON.stringify(await API.getRunIncentives(''));

      console.log('aa');
      assert.equal(resp, JSON.stringify({"status":403,"msg":"Server error"}));
    });
  });
});
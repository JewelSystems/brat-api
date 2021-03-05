process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'brat-test';
import { assert } from 'chai';
import API from '../../api/donation';
import Donation from '../../models/Donation';
import { getRepository, Repository } from 'typeorm';
import RunIncentive from '../../models/RunIncentive';
import UserController from '../../controller/user';
import User from '../../models/User';
import GameController from '../../controller/game';
import EventController from '../../controller/event';
import SubmitRunController from '../../controller/submitRun';
import runAPI from '../../api/run';
import Game from '../../models/Game';
import Event from '../../models/Event';
import BidwarOption from '../../models/BidwarOption';
import SubmitRun from '../../models/SubmitRun';
import Run from '../../models/Run';
import EventRunIncentive from '../../models/EventRunIncentive';
import EventRunBidwarOption from '../../models/EventRunBidwarOption';


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


describe('DonationAPI', async function(){
  before(async function() {
    submitRunRepo = getRepository(SubmitRun);
    userRepo = getRepository(User);
    runRepo = getRepository(Run);
    runIncentiveRepo = getRepository(RunIncentive);
    bidwarOptionRepo = getRepository(BidwarOption);
  
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
      {"type": 'none', "comment": "comment2", "name": "name2", options:[]}
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

    const submitRunIncentives = 
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
      },
      {
        id: incentiveIds[1],
        run_id: runId,
        type: "none",
        comment: "comment2",
        name: "name2",
        options: [],
        goal: 300
      }
    ];

    await SubmitRunController.updateSubmitRunNRunIncentives(submitRunId, true, true, false, submitRunIncentives);
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

    await getRepository(Donation)
      .createQueryBuilder("donation")
      .delete()
      .from(Donation)
      .execute();

    await getRepository(EventRunIncentive)
      .createQueryBuilder("event_run_incentive")
      .delete()
      .from(EventRunIncentive)
      .execute();

    await getRepository(EventRunBidwarOption)
      .createQueryBuilder("event_run_bidwar_option")
      .delete()
      .from(EventRunBidwarOption)
      .execute();
  });

  describe('API.updateIncentiveNCreateDonation', async function(){
    it('API.updateIncentiveNCreateDonation should create an donation and update an bidawr option current value', async function(){
      const resp = JSON.stringify(await API.updateIncentiveNCreateDonation('Name', 'Last Name', 'email@email.com', '300', incentiveIds[0], 'option1'));

      assert.equal(resp, JSON.stringify({"status":200,"msg":"updateDonation","data":["Update success"]}));
    });

    it('API.updateIncentiveNCreateDonation should create an donation and update an incetive current value', async function(){
      const resp = JSON.stringify(await API.updateIncentiveNCreateDonation('Name', 'Last Name', 'email@email.com', '300', incentiveIds[1], ''));

      assert.equal(resp, JSON.stringify({"status":200,"msg":"updateDonation","data":["Update success"]}));
    });

    it('API.updateIncentiveNCreateDonation should return an error if there is no incentive with this id', async function(){
      const resp = JSON.stringify(await API.updateIncentiveNCreateDonation('Name', 'Last Name', 'email@email.com', '100', '', ''));

      assert.equal(resp, JSON.stringify({"status":403,"msg":"Server error"}));
    });
  });
});
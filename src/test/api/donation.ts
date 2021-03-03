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
import runAPI from '../../api/run';
import Game from '../../models/Game';
import Event from '../../models/Event';
import BidwarOption from '../../models/BidwarOption';


let runIncentiveRepo: Repository<RunIncentive>;
let userRepo: Repository<User>;
let bidwarOptionRepo: Repository<BidwarOption>;
let donationRepo: Repository<Donation>;

let userId: string;
let gameId: string;
let incentiveId1: string;
let incentiveId2: string;
let optionId: string;

interface IIncentive{
  id: string;
  name: string;
  comment: string;
  bidwar_options: {id: string; option: string; incentive_id: string}[];
  goal?: number;
}

describe('DonationAPI', async function(){
  before(async function() {
    runIncentiveRepo = getRepository(RunIncentive);
    bidwarOptionRepo = getRepository(BidwarOption);
    donationRepo = getRepository(Donation);
  
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

    incentiveId1 = String((await runIncentiveRepo.findOneOrFail({ name: 'name1' })).id);
    incentiveId2 = String((await runIncentiveRepo.findOneOrFail({ name: 'name2' })).id);
    optionId = String((await bidwarOptionRepo.findOneOrFail({ option: 'option1' })).id);
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
  });

  describe('API.updateIncentiveNCreateDonation', async function(){
    it.skip('API.updateIncentiveNCreateDonation should create an donation and update an incetive current value', async function(){
      const resp = JSON.stringify(await API.updateIncentiveNCreateDonation('Name', 'Last Name', 'email@email.com', '100', incentiveId1, optionId));

      assert.equal(resp, '');
    });
    it('API.updateIncentiveNCreateDonation should return an error if there is no incentive with this id', async function(){
      const resp = JSON.stringify(await API.updateIncentiveNCreateDonation('Name', 'Last Name', 'email@email.com', '100', '', ''));

      assert.equal(resp, JSON.stringify({"status":403,"msg":"Server error"}));
    });
  });
});
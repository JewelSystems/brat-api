import {Connection, createConnection, Repository} from 'typeorm';
import BidwarOption from '../models/BidwarOption';
import Donation from '../models/Donation';
import Event from '../models/Event';
import EventExtra from '../models/EventExtra';
import EventRun from '../models/EventRun';
import EventRunBidwarOption from '../models/EventRunBidwarOption';
import EventRunIncentive from '../models/EventRunIncentive';
import EventSchedule from '../models/EventSchedule';
import Game from '../models/Game';
import Permission from '../models/Permission';
import Run from '../models/Run';
import RunIncentive from '../models/RunIncentive';
import RunRunner from '../models/RunRunner';
import SubmitRun from '../models/SubmitRun';
import User from '../models/User';
import UserLog from '../models/UserLog';
import UserPermission from '../models/UserPemission';

let connection: Connection;
let BidwarOptionRepo: Repository<BidwarOption>;
let DonationRepo: Repository<Donation>;
let EventRepo: Repository<Event>;
let EventExtraRepo: Repository<EventExtra>;
let EventRunRepo: Repository<EventRun>;
let EventRunBidwarOptionRepo: Repository<EventRunBidwarOption>;
let EventRunIncentiveRepo: Repository<EventRunIncentive>;
let EventScheduleRepo: Repository<EventSchedule>;
let GameRepo: Repository<Game>;
let PermissionRepo: Repository<Permission>;
let RunRepo: Repository<Run>;
let RunIncentiveRepo: Repository<RunIncentive>;
let RunRunnerRepo: Repository<RunRunner>;
let SubmitRunRepo: Repository<SubmitRun>;
let UserRepo: Repository<User>;
let UserLogRepo: Repository<UserLog>;
let UserPermissionRepo: Repository<UserPermission>;

async function initializeModels() {
  let connectionObj = {
    type: "mysql" as 'mysql',
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    database: process.env.DB_NAME || "brat",
    synchronize: false,
    logging: false,
    supportBigNumbers: true,
    bigNumberStrings: true,
    entities: [
      BidwarOption,
      Donation,
      Event,
      EventExtra,
      EventRun,
      EventRunBidwarOption,
      EventRunIncentive,
      EventSchedule,
      Game,
      Permission,
      Run,
      RunIncentive,
      RunRunner,
      SubmitRun,
      User,
      UserLog,
      UserPermission,
    ]
  };
  connection = await createConnection(connectionObj);
  BidwarOptionRepo = connection.getRepository(BidwarOption);
  DonationRepo = connection.getRepository(Donation);
  EventRepo = connection.getRepository(Event);
  EventExtraRepo = connection.getRepository(EventExtra);
  EventRunRepo = connection.getRepository(EventRun);
  EventRunBidwarOptionRepo = connection.getRepository(EventRunBidwarOption);
  EventRunIncentiveRepo = connection.getRepository(EventRunIncentive);
  EventScheduleRepo = connection.getRepository(EventSchedule);
  GameRepo = connection.getRepository(Game);
  PermissionRepo = connection.getRepository(Permission);
  RunRepo = connection.getRepository(Run);
  RunIncentiveRepo = connection.getRepository(RunIncentive);
  RunRunnerRepo = connection.getRepository(RunRunner);
  SubmitRunRepo = connection.getRepository(SubmitRun);
  UserRepo = connection.getRepository(User);
  UserLogRepo = connection.getRepository(UserLog);
  UserPermissionRepo = connection.getRepository(UserPermission);
}

export {
  initializeModels,
  connection,
  BidwarOptionRepo,
  DonationRepo,
  EventRepo,
  EventExtraRepo,
  EventRunRepo,
  EventRunBidwarOptionRepo,
  EventRunIncentiveRepo,
  EventScheduleRepo,
  GameRepo,
  PermissionRepo,
  RunRepo,
  RunIncentiveRepo,
  RunRunnerRepo,
  SubmitRunRepo,
  UserRepo,
  UserLogRepo,
  UserPermissionRepo
};

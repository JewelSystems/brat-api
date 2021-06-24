import logger from '../loaders/logger';
import Run from '../models/Run';
import RunRunner from '../models/RunRunner';
import SubmitRun from '../models/SubmitRun';
import RunIncentive from '../models/RunIncentive';
import BidwarOption from '../models/BidwarOption';
import Game from '../models/Game';
import Event from '../models/Event';

import {EventRepo, RunRepo, RunRunnerRepo, SubmitRunRepo, RunIncentiveRepo, BidwarOptionRepo, GameRepo, connection} from '../loaders/typeorm';

interface CtrlResponse{
  success?: any;
  error?: string;
}

interface IIncentive{
  type: string;
  comment: string;
  name: string;
  options: IOption[];
}

interface IOption{
  name: string
}

export default{
  async create(runnerId: string, gameId: string, category: string, estimatedTime: number, preferredTime: string, platform: string, incentives: IIncentive[]): Promise<CtrlResponse>{
    logger.log("info", "Starting create run function");
    
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try{
      //Find active event
      const activeEvent = await EventRepo.findOneOrFail({ active: 'A' });

      //Create Run
      /*
      const run: Run = RunRepo.create({
        game_id: Number(gameId),
        category: category,
        estimated_time: estimatedTime,
        preferred_time_slot: preferredTime,
        platform: platform
      });

      await RunRepo.save(run);
      */
      await queryRunner.manager.insert(Run, {
        game_id: Number(gameId),
        category: category,
        estimated_time: estimatedTime,
        preferred_time_slot: preferredTime,
        platform: platform
      });

      let run = await RunRepo.findOne({
        order: {
          id: 'DESC'
        }
      });
      if(!run) throw 'Run not found';
      
      //Create RunRunner
      /*
      const runRunner: RunRunner = RunRunnerRepo.create({
        runner_id: Number(runnerId),
        run_id: run.id
      });

      await RunRunnerRepo.save(runRunner);
      */
      await queryRunner.manager.insert(RunRunner, {
        runner_id: Number(runnerId),
        run_id: run.id
      });
      
      //Create SubmitRun      
      /*
      const submitRun: SubmitRun = SubmitRunRepo.create({
        event_id: activeEvent.id,
        run_id: run.id,
        reviewed: false,
        approved: false,
        waiting: false
      });

      await SubmitRunRepo.save(submitRun);
      */
      await queryRunner.manager.insert(SubmitRun, {
        event_id: activeEvent.id,
        run_id: run.id,
        reviewed: false,
        approved: false,
        waiting: false
      });

      await queryRunner.commitTransaction();
      await queryRunner.release();

      //Create Incentives and Bidwar Options
      
      let runIncentives: RunIncentive[] = [];
      let bidwarOptions: BidwarOption[] = [];

      for(let incentive of incentives){
        runIncentives.push(
          RunIncentiveRepo.create({
            run_id: run.id,
            type: incentive.type,
            comment: incentive.comment,
            name: incentive.name,
          })
        );
        if(incentive.type === 'private'){
          await RunIncentiveRepo.save(runIncentives);
          for(let option of incentive.options){
            bidwarOptions.push(
              BidwarOptionRepo.create({
                incentive_id: runIncentives[runIncentives.length-1].id,
                option: option.name,
              })
            );
          }
          runIncentives = [];
        }
      }

      if(runIncentives) await RunIncentiveRepo.save(runIncentives);
      await BidwarOptionRepo.save(bidwarOptions);

      return { success: "Creation success" };
    }catch(error){
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async createRunNGame(runnerId: string, category: string, estimatedTime: number, preferredTime: string, platform: string, name: string, year: string, incentives: IIncentive[]): Promise<CtrlResponse>{
    logger.log("info", "Starting create run and game function");
    try{
      const game: Game = GameRepo.create({
        name,
        year
      });

      await GameRepo.save(game);

      await  this.create(runnerId, String(game.id), category, estimatedTime, preferredTime, platform, incentives);
    
      return {success: 'Creation success'};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  }
};
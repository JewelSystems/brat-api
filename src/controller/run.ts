import logger from '../loaders/logger';
import { getRepository } from 'typeorm';
import Run from '../models/Run';
import RunRunner from '../models/RunRunner';
import SubmitRun from '../models/SubmitRun';
import RunIncentive from '../models/RunIncentive';
import BidwarOption from '../models/BidwarOption';
import Game from '../models/Game';
import Event from '../models/Event';

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
    try{
      //Find active event
      const eventRepository = getRepository(Event);
      const activeEvent = await eventRepository.findOneOrFail({ active: 'A' });

      //Create Run
      const runRepository = getRepository(Run);
      
      const run: Run = runRepository.create({
        game_id: Number(gameId),
        category: category,
        estimated_time: estimatedTime,
        preferred_time_slot: preferredTime,
        platform: platform
      });

      await runRepository.save(run);
      
      //Create RunRunner
      const runRunnerRepository = getRepository(RunRunner);

      const runRunner: RunRunner = runRunnerRepository.create({
        runner_id: Number(runnerId),
        run_id: run.id
      });

      await runRunnerRepository.save(runRunner);
      
      //Create SubmitRun
      const submitRunRepository = getRepository(SubmitRun);
      
      const submitRun: SubmitRun = submitRunRepository.create({
        event_id: activeEvent.id,
        run_id: run.id,
        reviewed: false,
        approved: false,
        waiting: false
      });

      await submitRunRepository.save(submitRun);

      //Create Incentives and Bidwar Options
      
      const runIncentiveRepository = getRepository(RunIncentive);
      const bidwarOptionRepository = getRepository(BidwarOption);

      let runIncentives: RunIncentive[] = [];
      let bidwarOptions: BidwarOption[] = [];

      for(let incentive of incentives){
        runIncentives.push(
          runIncentiveRepository.create({
            run_id: run.id,
            type: incentive.type,
            comment: incentive.comment,
            name: incentive.name,
          })
        );
        if(incentive.type === 'private'){
          await runIncentiveRepository.save(runIncentives);
          for(let option of incentive.options){
            bidwarOptions.push(
              bidwarOptionRepository.create({
                incentive_id: runIncentives[runIncentives.length-1].id,
                option: option.name,
              })
            );
          }
          runIncentives = [];
        }
      }

      if(runIncentives) await runIncentiveRepository.save(runIncentives);
      await bidwarOptionRepository.save(bidwarOptions);

      return { success: "Creation success" };
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async createRunNGame(runnerId: string, category: string, estimatedTime: number, preferredTime: string, platform: string, name: string, year: string, incentives: IIncentive[]): Promise<CtrlResponse>{
    logger.log("info", "Starting create run and game function");
    try{
      const gameRepository = getRepository(Game);

      const game: Game = gameRepository.create({
        name,
        year
      });

      await gameRepository.save(game);

      await  this.create(runnerId, String(game.id), category, estimatedTime, preferredTime, platform, incentives);
    
      return {success: 'Creation success'};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  }
};
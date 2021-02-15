import { getRepository } from 'typeorm';
import logger from '../loaders/logger';
import EventSchedule from '../models/EventSchedule';
import RunRunner from '../models/RunRunner';

export default{
  async getEventSchedule() {
    logger.log("info", "Starting get event schedule function");
    // Get event schedule
    try{
      const eventScheduleRepository = getRepository(EventSchedule);

      const eventSchedule = await eventScheduleRepository
        .createQueryBuilder("event_schedule")
        .orderBy('event_schedule.order', 'ASC')
        .leftJoinAndSelect("event_schedule.event_id", "event")
        .leftJoinAndSelect("event_schedule.event_run_id", "event_run")
        .leftJoinAndSelect("event_run.run_id", "run")
        .leftJoinAndSelect("run.game_id", "game")
        .leftJoinAndSelect(RunRunner, "run_runner", "run_runner.run_id = run.id")
        .leftJoinAndSelect("run_runner.runner_id", "user")
        .select([
          "event_schedule.id as id",
          "event_schedule.order as 'order'",
          "event_schedule.type as type",
          "event_schedule.event_id as event_id",
          "event_schedule.extra_time as extra_time",
          "event_schedule.active as active",
          "event_schedule.done as done",
          "event_schedule.final_time as final_time",
          "event.name as event_name",
          "event.start as event_date",
          "game.name as game",
          "run.estimated_time as duration",
          "run.category as category",
          "run.preferred_time_slot as 'interval'",
          "run.platform as platform",
          "user.nickname as runner",
          "user.stream_link as stream_link",
        ])
        .getRawMany();

      console.log(eventSchedule);

      /*
      resp = [];
      for(task in schedule){
        const values = schedule[task].dataValues;
        let duration, game, category, interval, platform, runner, streamLink;
        if(values.setup_time) {
          game = 'Setup';
          duration = values.setup_time;
          category = null;
          interval = null;
          platform = null;
          runner = null;
          streamLink = null;
        }
        else if(values.EventRun) {
          game = values.EventRun.Run.Game.name;
          duration = values.EventRun.Run.estimated_time;
          category = values.EventRun.Run.category;
          interval = values.EventRun.Run.preferred_time_slot;
          platform = values.EventRun.Run.platform;
          runner = values.EventRun.Run.RunRunners[0].User.nickname;
          streamLink = values.EventRun.Run.RunRunners[0].User.stream_link;
        }
        else if(values.EventExtra){
          game = values.EventExtra.type;
          duration = values.EventExtra.time;
          category = values.EventExtra.type;
          interval = null;
          platform = 'Todas';
          runner = 'Todos';
          streamLink = null;
        }
  
  
        resp.push({
          "id": values.id,
          "order": values.order,
          "type": values.type,
          "event_id": values.event_id,
          "extra_time": values.extra_time,
          "active": values.active,
          "done": values.done,
          "final_time": values.final_time,
  
          "event_name": values.Event.name,
          "event_date": values.Event.start,
          
          "game": game,
          "duration": duration,
          "category": category,
          "interval": interval,
          "platform": platform,
          "runner": runner,
          "stream_link": streamLink,
        });
      }
      //console.log(resp);
      //console.log('aqui', JSON.stringify(schedule, null, 2));
      */

      return {success: eventSchedule};
    }catch(error){
      console.log(error);
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },


};
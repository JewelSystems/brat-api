import { getRepository } from 'typeorm';
import logger from '../loaders/logger';
import EventExtra from '../models/EventExtra';
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
        .leftJoinAndSelect(EventExtra, "event_extra", "event_extra.id = event_schedule.event_extra_id")
        .leftJoinAndSelect("run_runner.runner_id", "user")
        .select([
          "event_schedule.id as id",
          "event_schedule.order as 'order'",
          "event_schedule.type as type",
          "event_schedule.event_id as event_id",
          "event_schedule.event_run_id as event_run_id",
          "event_schedule.event_extra_id as event_extra_id",
          "event_schedule.extra_time as extra_time",
          "event_schedule.setup_time as setup_time",
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
          "event_extra.time as event_extra_time",
          "event_extra.type as event_extra_type"
        ])
        .getRawMany();

      for(let task of eventSchedule){
        if(task.setup_time){
          task.game = 'Setup';
          task.duration = task.setup_time;
        }
        if(task.event_extra_id){
          task.game = task.event_extra_type;
          task.duration = task.event_extra_time;
          task.category = task.event_extra_type;
          task.platform = "Todas";
          task.runner = "Todos";
        }
      }
      return {success: eventSchedule};
    }catch(error){
      console.log(error);
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async updateEventSchedule(data: any) {
    logger.log("info", "Starting update event schedule order function");
    try{
      const dataJSON = JSON.parse(data);

      const eventScheduleRepository = getRepository(EventSchedule);

      for(let row of dataJSON){
        await eventScheduleRepository.update(Number(row.id), { "order": row.order});
      }

      const resp = await this.getEventSchedule();
      return {success: resp};
    }catch(error){
      console.log(error);
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async createSetupEventSchedule(data: any, setups: any) {
    logger.log("info", "Starting create setup on event schedule function");
    // Get event schedule
    try{
      const dataJSON = JSON.parse(data);

      const eventScheduleRepository = getRepository(EventSchedule);
      for(let setup of setups){
        const newSetup: EventSchedule = eventScheduleRepository.create({
          "order": setup.order,
          "type": setup.type,
          "event_id": setup.event_id,
          "setup_time": setup.duration,
          "active": false,
          "done": false,
        });
        await eventScheduleRepository.save(newSetup);
        
        dataJSON.find((element: any) => element.order === newSetup.order).id = newSetup.id;
      }

      await this.updateEventSchedule(JSON.stringify(dataJSON));

      const resp = await this.getEventSchedule();
      return {success: resp};
    }catch(error){
      console.log(error);
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async deleteEventSchedule(id: string) {
    logger.log("info", "Starting delete event schedule function");
    // delete event schedule
    try{
      const eventScheduleRepository = getRepository(EventSchedule);
      await eventScheduleRepository.delete(id);

      const resp = await this.getEventSchedule();
      return {success: resp};
    }catch(error){
      console.log(error);
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  }
};
import logger from '../loaders/logger';
import Event from '../models/Event';
import EventExtra from '../models/EventExtra';
import EventRun from '../models/EventRun';
import EventSchedule from '../models/EventSchedule';
import RunRunner from '../models/RunRunner';
import SubmitRun from '../models/SubmitRun';

import {EventRunRepo} from '../loaders/typeorm';

interface CtrlResponse{
  success?: any;
  error?: string;
}

interface ISetup{
  type: string,
  event_id: string,
  event_name: string,
  event_date: string,
  game: string,
  duration: number,
  order: number
}

export default{
  
  async getEventRuns(): Promise<CtrlResponse> {
    logger.log("info", "Starting get event runs function");
    // Get event runs
    try{
      const eventRuns = await EventRunRepo
        .createQueryBuilder("event_run")
        .leftJoinAndSelect(Event, "event", "event.active = 'A' and event.id = event_run.event_id")
        .leftJoinAndSelect(SubmitRun, "submit_run", "submit_run.run_id = event_run.run_id")
        .select([
          "event_run.id as id",
          "event_run.run_id as run_id",
          "submit_run.id as submit_run_id",
          "submit_run.reviewed as reviewed",
          "submit_run.approved as approved",
          "submit_run.waiting as waiting"
        ])
        .getRawMany();
        
      return {success: eventRuns};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },
};
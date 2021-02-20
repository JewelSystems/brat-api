import logger from '../loaders/logger';
import { getRepository } from 'typeorm';
import EventExtra from '../models/EventExtra';

interface CtrlResponse{
  success?: any;
  error?: string;
}

export default{
  async getExtras(): Promise<CtrlResponse>{
    logger.log("info", "Starting get all event extras function");
    try{
      const eventExtraRepo = getRepository(EventExtra);
      
      const eventExtras = await eventExtraRepo
        .createQueryBuilder("event_extra")
        .leftJoinAndSelect("event_extra.event_id", "event")
        .select([
          "event_extra.id as id",
          "event.name as name",
          "event_extra.type as type",
          "event_extra.time as time"
        ])
        .getRawMany();

      return { success: eventExtras };
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },
};
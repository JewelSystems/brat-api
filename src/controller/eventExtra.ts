import logger from '../loaders/logger';
import { getRepository } from 'typeorm';
import EventExtra from '../models/EventExtra';
import Event from '../models/Event';

interface CtrlResponse{
  success?: any;
  error?: string;
}

export default{
  async create( type: string, time: number): Promise<CtrlResponse>{
    logger.log("info", "Starting game create function");
    try{
      const eventExtraRepository = getRepository(EventExtra);
      const eventRepository = getRepository(Event);
      
      const event = await eventRepository.findOneOrFail({ active: "A" });

      const eventExtra = eventExtraRepository.create({
        event_id: event?.id,
        type,
        time
      });

      await eventExtraRepository.save(eventExtra);

      return {success: eventExtra};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

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
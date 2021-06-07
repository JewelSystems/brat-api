import logger from '../loaders/logger';
import { getRepository } from 'typeorm';
import EventExtra from '../models/EventExtra';
import Event from '../models/Event';

import {EventExtraRepo, EventRepo} from '../loaders/typeorm';

interface CtrlResponse{
  success?: any;
  error?: string;
}

export default{
  async create( type: string, time: number): Promise<CtrlResponse>{
    logger.log("info", "Starting game create function");
    try{      
      const event = await EventRepo.findOneOrFail({ active: "A" });

      const eventExtra = EventExtraRepo.create({
        event_id: event?.id,
        type,
        time
      });

      await EventExtraRepo.save(eventExtra);

      return {success: (await this.getExtras()).success};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async getExtras(): Promise<CtrlResponse>{
    logger.log("info", "Starting get all event extras function");
    try{      
      const eventExtras = await EventExtraRepo
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
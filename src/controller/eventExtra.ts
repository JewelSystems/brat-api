import logger from '../loaders/logger';
import { getManager, getRepository } from 'typeorm';
import EventExtra from '../models/EventExtra';

export default{
  async getExtras(){
    logger.log("info", "Starting get all event extras function");
    try{
      /*
      const eventExtrasRepository = getRepository(EventExtra);

      const eventExtras = await eventExtrasRepository.find();
      */
      const entityManager = getManager();
      const sqlQuery = 'SELECT event_extras.id, events.name, event_extras.type, event_extras.time FROM event_extras, events where event_extras.event_id = events.id';
      const eventExtras = await entityManager.query(sqlQuery);
      return { success: eventExtras };
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },
};
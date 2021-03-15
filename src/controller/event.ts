import logger from '../loaders/logger';
import moment from 'moment'; 
import { getRepository } from 'typeorm';
import Event from '../models/Event';

interface CtrlResponse{
  success?: any;
  error?: string;
}

export default{
  async getEvents(): Promise<CtrlResponse>{
    logger.log("info", "Starting get all events function");
    try{
      
      const eventsRepository = getRepository(Event);

      const events = await eventsRepository.find();

      for(let event of events){
        event.start = moment(event.start).format('YYYY-MM-DD');
        event.end = moment(event.end).format('YYYY-MM-DD');
      }

      return { success: events };
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async updateEventState(id: string): Promise<CtrlResponse> {
    logger.log("info", "Starting event state update function");
    // Update event state
    try{
      const eventRepository = getRepository(Event);

      const event = await eventRepository.findOneOrFail({ id: Number(id) });
      const resp = {
        "id": id,
        "active": '',
      };

      if(event){
        if(event.active === 'N'){
          await eventRepository.update(Number(id), { active: 'A'});
          resp.active = 'A';
        }else if(event.active === 'A'){
          await eventRepository.update(Number(id), { active: 'D'});
          resp.active = 'D';
        }
      }
      
      return {success: resp};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async update(id: string, name: string, donationLink: string, start: string, end: string): Promise<CtrlResponse> {
    logger.log("info", "Starting event update function");
    try{
      const eventRepository = getRepository(Event);

      await eventRepository.update(Number(id), {
        name: name,
        donation_link: donationLink,
        start: start,
        end: end
      });

      const event = await eventRepository.findOne(Number(id));
      if(event){
        event.start = moment(event.start).format('YYYY-MM-DD');
        event.end = moment(event.end).format('YYYY-MM-DD');
      }
      
      return {success: event};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async create(name: string, donationLink: string, start: string, end: string): Promise<CtrlResponse> {
    logger.log("info", "Starting event create function");
    try{
      const eventRepository = getRepository(Event);

      const event = eventRepository.create({
        name: name,
        donation_link: donationLink,
        start: start,
        end: end,
        active: "N",
      });

      await eventRepository.save(event);

      return {success: event};
    }catch(error){
      console.log(error);
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  }
};
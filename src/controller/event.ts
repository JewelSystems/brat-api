import logger from '../loaders/logger';
import moment from 'moment'; 
import Event from '../models/Event';

import {EventRepo} from '../loaders/typeorm';

interface CtrlResponse{
  success?: any;
  error?: string;
}

export default{
  async getEvents(): Promise<CtrlResponse>{
    logger.log("info", "Starting get all events function");
    try{
      const events = await EventRepo.find();

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
      const event = await EventRepo.findOneOrFail({ id: Number(id) });
      const resp = {
        "id": id,
        "active": '',
      };

      if(event){
        if(event.active === 'N'){
          await EventRepo.update(Number(id), { active: 'A'});
          resp.active = 'A';
        }else if(event.active === 'A'){
          await EventRepo.update(Number(id), { active: 'D'});
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
      await EventRepo.update(Number(id), {
        name: name,
        donation_link: donationLink,
        start: start,
        end: end
      });

      const event = await EventRepo.findOne(Number(id));
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
      const event = EventRepo.create({
        name: name,
        donation_link: donationLink,
        start: start,
        end: end,
        active: "N",
      });

      await EventRepo.save(event);

      return {success: event};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  }
};
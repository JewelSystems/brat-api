import logger from '../loaders/logger';
import Game from '../models/Game';

import {GameRepo} from '../loaders/typeorm';

interface CtrlResponse{
  success?: any;
  error?: string;
}

export default{
  async getGames(): Promise<CtrlResponse>{
    logger.log("info", "Starting get all games function");
    try{
      const games = await GameRepo.find();
      return { success: games };
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async update(id: string, name: string, year: string): Promise<CtrlResponse>{
    logger.log("info", "Starting game update function");
    // Update game
    try{
      await GameRepo.update(Number(id), {
        name,
        year
      });

      return {success: 'Update success'};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async create( name: string, year: string): Promise<CtrlResponse>{
    logger.log("info", "Starting game create function");
    try{
      const game = GameRepo.create({
        name: name,
        year: year
      });

      await GameRepo.save(game);

      return {success: game};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  }
};
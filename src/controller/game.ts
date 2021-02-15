import logger from '../loaders/logger';
import { getRepository } from 'typeorm';
import Game from '../models/Game';

export default{
  async getGames(){
    logger.log("info", "Starting get all games function");
    try{
      const gamesRepository = getRepository(Game);

      const games = await gamesRepository.find();
      return { success: games };
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async update(id: string, name: string, year: string){
    logger.log("info", "Starting game update function");
    // Update game
    try{
      const gamesRepository = getRepository(Game);

      await gamesRepository.update(Number(id), {
        name,
        year
      });

      return {success: 'Update success'};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  }
};
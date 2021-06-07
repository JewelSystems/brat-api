import logger from '../loaders/logger';
import moment from 'moment';
import UserLog from '../models/UserLog';

import {UserLogRepo} from '../loaders/typeorm';

export default {
  async log(updatedId: number, updaterId: number, type: string): Promise<void>{
    try{
      const userLog: UserLog = UserLogRepo.create({
        updated_user_id: updatedId,
        updater_user_id: updaterId,
        type: type,
        epoch: moment().unix(),
      });

      await UserLogRepo.save(userLog);

    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      throw(error);
    }
  }
};
import moment from 'moment';
import { getRepository } from 'typeorm';
import UserLog from '../models/UserLog';

export default {
  async log(updatedId: number, updaterId: number, type: string): Promise<void>{
    try{
      const userLogRepository = getRepository(UserLog);

      const userLog: UserLog = userLogRepository.create({
        updated_user_id: updatedId,
        updater_user_id: updaterId,
        type: type,
        epoch: moment().unix(),
      });

      await userLogRepository.save(userLog);

    }catch(error){
      console.log(error);
    }
  }
};
const RunIncentive = require('../models/RunIncentive');
const BidwarOption = require('../models/BidwarOption');
const EventSchedule = require('../models/EventSchedule');
const EventRun = require('../models/EventRun');
const Run = require('../models/Run');
const logger = require('../loaders/logger');

exports.update = async function(incentive) {
  logger.log("info", "Starting incentive update function");
  // Update incentive
  try{
    if(!incentive.goal){
      for(idx in incentive.bidwar_options){
        const option = incentive.bidwar_options[idx];
        BidwarOption.update({
          option: option.option,
        },{
          where:{ id: option.id }
        });
      }
    }
    
    RunIncentive.update({
      name: incentive.name,
      comment: incentive.comment
    },{
      where:{ id: incentive.id }
    });

    return {success: incentive};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.getRunIncentives = async function(scheduleId) {
  logger.log("info", "Starting incentive run get function");
  // get run incentives
  try{
    const incentives = await EventSchedule.findAll({
      attributes: [
        'EventRun.Run.RunIncentives.id',
        'EventRun.Run.RunIncentives.name',
        'EventRun.Run.RunIncentives.BidwarOptions.option'
      ],
      raw: true,
      where:{id:scheduleId},
      include:{
        attributes: [],
        model: EventRun,
        include:{
          attributes: [],
          model: Run,
          include:{
            attributes: [],
            model: RunIncentive,
            include:{
              attributes: [],
              model: BidwarOption
            }
          }
        }
      }
    });

    resp = [];

    for(idx in incentives){
      if(incentives[idx].id !== null){
        let found = resp.find(element => element.id === incentives[idx].id);
        if(found){
          found.options.push(incentives[idx].option);
        }else{
          resp.push({
            "id": incentives[idx].id,
            "incentive": incentives[idx].name,
            "options": incentives[idx].option !== null ? [incentives[idx].option] : []
          });
        }
      }
    }

    return {success: resp};
  }catch(error){
    console.log(error);
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};
const SubmitRun = require('../models/SubmitRun');
const Event = require('../models/Event');
const Run = require('../models/Run');
const Game = require('../models/Game');
const RunRunner = require('../models/RunRunner');
const User = require('../models/User');
const RunIncentive = require('../models/RunIncentive');
const BidwarOption = require('../models/BidwarOption');

const eventRunController = require('../controller/eventRun');

const logger = require('../loaders/logger');

exports.getSubmitRuns = async function() {
  logger.log("info", "Starting get submit runs function");
  // Get submit runs
  try{
    const submitRuns = await SubmitRun.findAll({
      include: [{
        model: Event
      },
      {
        model: Run,
        include: [{
          model: Game
        },{
          model: RunRunner,
          include: {
            model: User
          }
        },{
          model: RunIncentive,
          include: {
            model: BidwarOption
          }
        }]
      }]
    });

    resp = [];
    for(submitRun in submitRuns){
      const value = submitRuns[submitRun].dataValues;
      resp.push({
        "id": value.id,
        "event_name": value.Event.name,
        "game_name": value.Run.Game.name,
        "category": value.Run.category,
        "platform": value.Run.platform,
        "time_slot": value.Run.preferred_time_slot,
        "reviewed": value.reviewed,
        "approved": value.approved,
        "waiting": value.waiting,
        "runner": value.Run.RunRunners[0].User.nickname,
        "incentives": []
      });
      for(incentiveIdx in value.Run.RunIncentives){
        incentive = value.Run.RunIncentives[incentiveIdx].dataValues;
        resp[submitRun].incentives.push(incentive);
      }
    }

    return {success: resp};
  }catch(error){
    console.log(error);
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.update = async function(id, reviewed, approved, waiting) {
  logger.log("info", "Starting submit run update function");
  // Update submit run
  try{
    await SubmitRun.update({
      reviewed: reviewed,
      approved: approved,
      waiting: waiting
    },{
      where:{id}
    });
    const submitRun = await SubmitRun.findOne({ where:{id} });

    resp = {
      id: id,
      reviewed: submitRun.dataValues.reviewed,
      approved: submitRun.dataValues.approved,
      waiting: submitRun.dataValues.waiting,
    };

    if(approved){
      if(waiting){
        await eventRunController.create(submitRun.dataValues.event_id, submitRun.dataValues.run_id, '01-01-2021');
      }else{
        await eventRunController.create(submitRun.dataValues.event_id, submitRun.dataValues.run_id, '01-01-2021');
      }
    }else{
      await eventRunController.delete(submitRun.dataValues.run_id);
    }

    return {success: resp};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};
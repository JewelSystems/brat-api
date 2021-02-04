const SubmitRun = require('../models/SubmitRun');
const Event = require('../models/Event');
const Run = require('../models/Run');
const Game = require('../models/Game');
const RunRunner = require('../models/RunRunner');
const User = require('../models/User');
const RunIncentive = require('../models/RunIncentive');
const BidwarOption = require('../models/BidwarOption');

const EventRunIncentive = require('../models/EventRunIncentive');
const EventRunBidwarOption = require('../models/EventRunBidwarOption');
const EventRun = require('../models/EventRun');

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
        "incentives": [],
        "approved_incentives": []
      });
      for(incentiveIdx in value.Run.RunIncentives){
        incentive = value.Run.RunIncentives[incentiveIdx].dataValues;
        resp[submitRun].incentives.push(incentive);
      }
      if(value.approved && resp[submitRun].incentives.length > 0){
        for(incentive in resp[submitRun].incentives){
          const incentiveFound = await EventRunIncentive.findOne({ where:{ incentive_id: resp[submitRun].incentives[incentive].id } });
          if(incentiveFound) resp[submitRun].approved_incentives.push(resp[submitRun].incentives[incentive].id);
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

    //Create or remove evaluated submitted runs from event_runs table.
    let evtRun = null;
    if(approved){
      if(waiting){
        evtRun = await eventRunController.create(submitRun.dataValues.event_id, submitRun.dataValues.run_id, '01-01-2021');
      }else{
        evtRun = await eventRunController.create(submitRun.dataValues.event_id, submitRun.dataValues.run_id, '01-01-2021');
      }
    }else{
      await eventRunController.delete(submitRun.dataValues.run_id);
    }

    if(evtRun) resp.event_run_id = evtRun.success.dataValues.id;

    return {success: resp};
  }catch(error){
    console.log(error);
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.updateSubmitRunNRunIncentives = async function(id, reviewed, approved, waiting, incentives) {
  logger.log("info", "Starting submit run with incentives update function");
  // Update submit run
  try{
    let eventRunId = await this.update(id, reviewed, approved, waiting);
    eventRunId = eventRunId.success;
    let approvedIncentives = [];

    for(idx in incentives){
      //If the incentive already exists, update.
      const found = await EventRunIncentive.findOne({ where:{incentive_id: incentives[idx].id} });
      if(found){
        await EventRunIncentive.update({
          "event_run_id": eventRunId.event_run_id,
          "incentive_id": incentives[idx].id,
          "goal": 100//Number(incentives[idx].goal),
        },
        { 
          where:{incentive_id: incentives[idx].id} 
        });
      }else{
        //If the incentive wasn't found, create.
        const eventRunIncentive = await EventRunIncentive.create({
          "event_run_id": eventRunId.event_run_id,
          "incentive_id": incentives[idx].id,
          "cur_value": 0,
          "goal": Number(incentives[idx].goal),
        });
        
        if(incentives[idx].options && incentives[idx].options.length > 0){
          for(option in incentives[idx].options){
            await EventRunBidwarOption.create({
              "event_run_incentive_id": eventRunIncentive.id,
              "bidwar_option_id": incentives[idx].options[option].id,
              "cur_value": 0
            });
          }
        }
      }
      approvedIncentives.push(incentives[idx].id);
    }

    resp = {
      id: id,
      reviewed: reviewed,
      approved: approved,
      waiting: waiting,
      approved_incentives: approvedIncentives,
    };

    return {success: resp};
  }catch(error){
    console.log(error);
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.refuseSubmitRunNRemoveIncentives = async function(id, reviewed, approved, waiting) {
  logger.log("info", "Starting submit run with incentives refuse function");
  // Remove submit run with incentives
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

    const eventRun = await EventRun.findOne({ where:{run_id: submitRun.dataValues.run_id} });
    if(eventRun){
      const incentives = await EventRunIncentive.findAll({ where:{ event_run_id: eventRun.dataValues.id } });
      for(incentive in incentives){
        const options = await EventRunBidwarOption.findAll({ where:{ event_run_incentive_id: incentives[incentive].dataValues.id } });
        for(option in options){
          await EventRunBidwarOption.destroy({ where:{ id:options[option].dataValues.id } });
        }
        await EventRunIncentive.destroy({ where:{ id:incentives[incentive].dataValues.id } });
      }
      await eventRunController.delete(submitRun.dataValues.run_id);
    }

    return {success: resp};
  }catch(error){
    console.log(error);
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};
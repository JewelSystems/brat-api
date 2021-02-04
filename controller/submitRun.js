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
        "approved_incentives": {}
      });
      for(incentiveIdx in value.Run.RunIncentives){
        incentive = value.Run.RunIncentives[incentiveIdx].dataValues;
        resp[submitRun].incentives.push(incentive);
      }
      if(value.reviewed && resp[submitRun].incentives.length > 0){
        for(incentive in resp[submitRun].incentives){
          const incentiveFound = await EventRunIncentive.findOne({ where:{ incentive_id: resp[submitRun].incentives[incentive].id } });
          if(incentiveFound) resp[submitRun].approved_incentives[resp[submitRun].incentives[incentive].id] = true;
          else resp[submitRun].approved_incentives[resp[submitRun].incentives[incentive].id] = false;
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
    let newEvtRun = null;
    let evtRun = null;
    if(approved){
      evtRun = await EventRun.findOne({
        raw: true,
        where:{
          run_id: submitRun.dataValues.run_id
        }
      });
      if(!evtRun){
        if(waiting){
          newEvtRun = await eventRunController.create(submitRun.dataValues.event_id, submitRun.dataValues.run_id, '01-01-2021');
        }else{
          newEvtRun = await eventRunController.create(submitRun.dataValues.event_id, submitRun.dataValues.run_id, '01-01-2021');
        }
      }
    }else{
      await eventRunController.delete(submitRun.dataValues.run_id);
    }

    if(newEvtRun) resp.event_run = newEvtRun.success.dataValues;
    else resp.event_run = evtRun;

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
    eventRunInfo = eventRunId.success;
    let approvedIncentives = {};

    allIncentives = await RunIncentive.findAll({ raw: true, where:{run_id: eventRunInfo.event_run.run_id} });

    for(idx in allIncentives){
      const curIncentive = await incentives.filter(element => element.id === allIncentives[idx].id);
      const found = await EventRunIncentive.findOne({ where:{incentive_id: allIncentives[idx].id} });
      if(curIncentive.length > 0){
        if(found){
          await EventRunIncentive.update({
            "event_run_id": eventRunInfo.event_run.id,
            "incentive_id": curIncentive[0].id,
            "goal": Number(curIncentive[0].goal),
          },
          { 
            where:{incentive_id: curIncentive[0].id} 
          });
        }else{
          //If the incentive wasn't found, create.
          const eventRunIncentive = await EventRunIncentive.create({
            "event_run_id": eventRunInfo.event_run.id,
            "incentive_id": curIncentive[0].id,
            "cur_value": 0,
            "goal": Number(curIncentive[0].goal),
          });
          
          if(curIncentive[0].options && curIncentive[0].options.length > 0){
            for(option in curIncentive[0].options){
              await EventRunBidwarOption.create({
                "event_run_incentive_id": eventRunIncentive.id,
                "bidwar_option_id": curIncentive[0].options[option].id,
                "cur_value": 0
              });
            }
          }
        }
        approvedIncentives[allIncentives[idx].id] = true;      
      }else{
        if(found){
          await EventRunBidwarOption.destroy({ where:{event_run_incentive_id: found.dataValues.id }});
          await EventRunIncentive.destroy({ where:{incentive_id: allIncentives[idx].id }});
        }
        approvedIncentives[allIncentives[idx].id] = false;
      }
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

    //TODO atualizar array de approve quando remover
    const eventRun = await EventRun.findOne({ where:{run_id: submitRun.dataValues.run_id} });
    if(eventRun){
      const incentives = await EventRunIncentive.findAll({ raw: true, where:{ event_run_id: eventRun.dataValues.id } });
      for(incentive in incentives){
        const options = await EventRunBidwarOption.findAll({ where:{ event_run_incentive_id: incentives[incentive].id } });
        for(option in options){
          await EventRunBidwarOption.destroy({ where:{ id:options[option].dataValues.id } });
        }
        await EventRunIncentive.destroy({ where:{ id:incentives[incentive].id } });
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
const EventSchedule = require('../models/EventSchedule');
const EventRun = require('../models/EventRun');
const EventExtra = require('../models/EventExtra');
const Event = require('../models/Event');
const Game = require('../models/Game');
const Run = require('../models/Run');
const RunRunner = require('../models/RunRunner');
const User = require('../models/User');
const logger = require('../loaders/logger');

exports.getEventSchedule = async function() {
  logger.log("info", "Starting get event schedule function");
  // Get event schedule
  try{
    const schedule = await EventSchedule.findAll({
      order: [
        ['order', 'ASC'],
      ],
      include: [{
        model: EventRun,
        include: {
          model: Run,
          include: [{
            model: Game
          },{
            model: RunRunner,
            include: {
              model: User
            }
          }]
        },
      },
      {
        model: EventExtra
      },{
        model: Event
      }]
    });
    resp = [];
    for(task in schedule){
      const values = schedule[task].dataValues;
      let duration, game, category, interval, platform, runner, streamLink;
      if(values.setup_time) {
        game = 'Setup';
        duration = values.setup_time;
        category = null;
        interval = null;
        platform = null;
        runner = null;
        streamLink = null;
      }
      else if(values.EventRun) {
        game = values.EventRun.Run.Game.name;
        duration = values.EventRun.Run.estimated_time;
        category = values.EventRun.Run.category;
        interval = values.EventRun.Run.preferred_time_slot;
        platform = values.EventRun.Run.platform;
        runner = values.EventRun.Run.RunRunners[0].User.nickname;
        streamLink = values.EventRun.Run.RunRunners[0].User.stream_link;
      }
      else if(values.EventExtra){
        game = values.EventExtra.type;
        duration = values.EventExtra.time;
        category = values.EventExtra.type;
        interval = null;
        platform = 'Todas';
        runner = 'Todos';
        streamLink = null;
      }


      resp.push({
        "id": values.id,
        "order": values.order,
        "type": values.type,
        "event_id": values.event_id,
        "extra_time": values.extra_time,
        "active": values.active,
        "done": values.done,
        "final_time": values.final_time,

        "event_name": values.Event.name,
        "event_date": values.Event.start,
        
        "game": game,
        "duration": duration,
        "category": category,
        "interval": interval,
        "platform": platform,
        "runner": runner,
        "stream_link": streamLink,
      });
    }
    //console.log(resp);
    //console.log('aqui', JSON.stringify(schedule, null, 2));
    return {success: resp};
  }catch(error){
    console.log(error);
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.updateEventSchedule = async function(data) {
  logger.log("info", "Starting update event schedule function");
  // update event schedule
  try{
    const dataJSON = JSON.parse(data);
    for(let idx in dataJSON){
      let element = dataJSON[idx];
      await EventSchedule.update({
        order: element.order,
      },{
        where:{ id: element.id }
      });
    }
    resp = await this.getEventSchedule();
    return {success: resp};
  }catch(error){
    console.log(error);
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.deleteEventSchedule = async function(id) {
  logger.log("info", "Starting delete event schedule function");
  // delete event schedule
  try{
    await EventSchedule.destroy({where:{id}});
    resp = await this.getEventSchedule();
    return {success: resp};
  }catch(error){
    console.log(error);
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.createSetupEventSchedule = async function(data, setups) {
  logger.log("info", "Starting create setup on event schedule function");
  // Get event schedule
  try{
    console.log(data);
    const dataJSON = JSON.parse(data);
    for(let idx in setups){
      let setup = setups[idx];
      eventSchedule = await EventSchedule.create({
        "order": setup.order,
        "type": setup.type,
        "event_id": setup.event_id,
        "setup_time": setup.duration,
        "active": false,
        "done": false,
      });
      dataJSON.find(element => element.order === eventSchedule.order).id = eventSchedule.id;
      
      console.log(dataJSON);
    }
    await this.updateEventSchedule(JSON.stringify(dataJSON));
    resp = await this.getEventSchedule();
    return {success: resp};
  }catch(error){
    console.log(error);
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};
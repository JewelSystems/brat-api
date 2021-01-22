const EventSchedule = require('../models/EventSchedule');
const EventRun = require('../models/EventRun');
const EventExtra = require('../models/EventExtra');
const Game = require('../models/Game');
const Run = require('../models/Run');
const logger = require('../loaders/logger');

exports.getEventSchedule = async function() {
  logger.log("info", "Starting get event schedule function");
  // Get event schedule
  try{
    const schedule = await EventSchedule.findAll({
      include: [{
        model: EventRun,
        include: {
          model: Run,
          include: {
            model: Game
          }
        },
      },
      {
        model: EventExtra
      }]
    });
    resp = [];
    for(task in schedule){
      const values = schedule[task].dataValues;
      let duration, game, category, platform, runner;
      if(values.setup_time) {
        game = null;
        duration = values.setup_time;
        category = null;
        platform = null;
        runner = null;
      }
      else if(values.EventRun) {
        game = values.EventRun.Run.Game.name;
        duration = values.EventRun.Run.estimated_time;
        category = values.EventRun.Run.category;
        platform = values.EventRun.Run.platform;
        runner = 'nome do runner';
      }
      else if(values.EventExtra){
        game = values.EventExtra.type;
        duration = values.EventExtra.time;
        category = values.EventExtra.type;
        platform = 'Todas';
        runner = 'Todos';
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
        
        "game": game,
        "duration": duration,
        "category": category,
        "platform": platform,
        "runner": runner,
      });
    }
    console.log(resp);
    //console.log('aqui', JSON.stringify(schedule, null, 2));
    return {success: 'ok'};
  }catch(error){
    console.log(error);
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};
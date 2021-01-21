const ws = require('ws');
const user = require('./user');
const auth = require('./auth');
const userPermission = require('./userPermission');
const game = require('./game');
const run = require('./run');
const runRunner = require('./runRunner');
const event = require('./event');
const eventExtra = require('./eventExtra');
const eventRun = require('./eventRun');

module.exports = (server) => {
  let counter = 0;
  const wss = new ws.Server({ server });

  wss.on('connection', function connection(ws) {
    console.log('New client connection');
    ws.functions = unloggedFunctions;
    ws.id = counter++;
    ws.reqId = null;
    
    ws.authToken = null;
    ws.authenticated = false;

    ws.permissions = null;
    ws.user = null;

    ws.on('message', async function incoming(message) {
      console.log("Received: ", message);
      let msg;
      let packet;
      try{
        msg = JSON.parse(message);
      }catch(error){
        packet = {"endpoint": "", "id":"", "info":{"status": "403", "msg": "Parsing error"}};
        return ws.send(JSON.stringify(packet));
      }

      //Check if incoming info exists
      if(!msg.endpoint){
        packet = {"endpoint": "", "id":"", "info":{"status": "403", "msg": "Undefined requisition"}};
        return ws.send(JSON.stringify(packet));
      }else if(!msg.id){
        packet = {"endpoint": "", "id":"", "info":{"status": "403", "msg": "Missing id"}};
        return ws.send(JSON.stringify(packet));
      }

      const { endpoint, id, info } = msg;
      // Unlogged
      if(!ws.authenticated){
        if(!info.token && endpoint !== "login"){
          packet = {"endpoint": endpoint, "id": id, "info":{"status": "403", "msg": "Invalid action, needs login"}};
        }else{
          packet = await ws.functions[endpoint](info);
          if(packet.status === 200){
            ws.authToken = info.token;
            ws.authenticated = true;

            ws.user = packet.user;
            ws.permissions = packet.permissions;

            packet = {"endpoint": endpoint, "id":id, "info":{"status": packet.status, "msg": "authLogin"}};

            if(ws.permissions.includes('Admin')){
              console.log("ADMIN");
              ws.functions = loggedFunctionsAdmin;
            }else{
              console.log('NOT ADMIN');
              ws.functions = loggedFunctionsBase;
            }
          }else{
            packet = {"endpoint": endpoint, "id":id, "info":{"status": "403", "msg": "User could not be authenticated"}};
          }
        }
      }else{
        // Check if incoming requisition is possible
        if(ws.functions[endpoint] === undefined){
          packet = {"endpoint": endpoint, "id": id, "info":{"status": "403", "msg": "Undefined endpoint"}};
        }else{
          packet = await ws.functions[endpoint](info);
          packet = {"endpoint": endpoint, "id": id, "info":{"status": packet.status, "msg": packet.msg}, "data":packet.data};
        }
      }
      //console.log("Sent: ", packet);
      ws.send(JSON.stringify(packet));
    });
    
    ws.on('close', async function close(){
      console.log('Connection Closed!');
      ws.send('WebSocket Connection Ended!');
    });
  });
};

// Logged functions Admin
let loggedFunctionsAdmin = {
  getUser: user.get,
  getUsers: user.getUsers,
  getUserRuns: user.getUserRuns,

  removePermission: userPermission.removePermission,
  addPermission: userPermission.addPermission,

  createGame: game.create,
  getGame: game.get,
  updateGame: game.update,
  deleteGame: game.delete,
  getGames: game.getGames,

  createRun: run.create,
  getRun: run.get,
  updateRun: run.update,
  deleteRun: run.delete,
  createRunNGame: run.createRunNGame,

  createRunRunner: runRunner.create,
  getRunRunner: runRunner.get,
  updateRunRunner: runRunner.update,
  deleteRunRunner: runRunner.delete,

  createEvent: event.create,
  getEvent: event.get,
  updateEvent: event.update,
  deleteEvent: event.delete,
  getEvents: event.getEvents,

  createEventExtra: eventExtra.create,
  getEventExtra: eventExtra.get,
  updateEventExtra: eventExtra.update,
  deleteEventExtra: eventExtra.delete,
  getEventExtras: eventExtra.getExtras,

  createEventRun: eventRun.create,
  getEventRun: eventRun.get,
  updateEventRun: eventRun.update,
  deleteEventRun: eventRun.delete,
};

// Logged User functions
let loggedFunctionsBase = {
  getUser: user.get,
  getUsers: user.getUsers,
  getUserRuns: user.getUserRuns,

  createGame: game.create,
  getGame: game.get,
  getGames: game.getGames,

  createRun: run.create,
  getRun: run.get,

  getRunRunner: runRunner.get,

  createEvent: event.create,
  getEvent: event.get,

  createEventExtra: eventExtra.create,
  getEventExtra: eventExtra.get,
  getEventExtras: eventExtra.getExtras,

  createEventRun: eventRun.create,
  getEventRun: eventRun.get,
};

// Unlogged Functions
let unloggedFunctions = {
  login: auth.login,
  signup: user.signup,
};
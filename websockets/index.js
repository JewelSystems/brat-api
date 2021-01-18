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

//temp
const authCtrl = require('../controller/auth');

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
      const msg = JSON.parse(message);
      //Check if incoming info exists
      if(!msg){
        ws.send(JSON.stringify({"status": "403", "msg": "Missing Params"}));
      }else if(!msg.endpoint){
        ws.send(JSON.stringify({"status": "403", "msg": "Undefined Requisition"}));
      }else if(!msg.id){
        ws.send(JSON.stringify({"status": "403", "msg": "Missing Id"}));
      }else{        
        let req = JSON.parse(message);
        const { endpoint, id, info } = req;
        ws.reqId = id;
        // Unlogged
        if(!ws.authenticated){
          if(!info.token && endpoint !== login){
            ws.send(JSON.stringify({"status": "403", "msg": "Invalid action, needs login"}));
          }else{
            ws.authToken = info.token;
            let resp = await ws.functions[endpoint](info);
            if(resp.status === 200){
              ws.authenticated = true;
              const userData = await authCtrl.getAuthData(ws.authToken);
              ws.user = userData.user;
              ws.permissions = userData.permissions[0][0].permissions.split(',');
            }
            ws.send(JSON.stringify(resp));
          }
        }else{
          if(ws.permissions.includes('Admin')){
            console.log("ADMIN");
            ws.functions = loggedFunctionsAdmin;
          }else{
            console.log('NOT ADMIN');
            ws.functions = loggedFunctionsBase;
          }
          // Check if incoming requisition is possible
          if(ws.functions[endpoint] === undefined){
            ws.send(JSON.stringify({"status": "403", "msg": "Undefined Endpoint"}));
          }else{
            let resp = await ws.functions[endpoint](info);
            ws.send(JSON.stringify(resp));
          }
        }
      }
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

  removePermission: userPermission.removePermission,
  addPermission: userPermission.addPermission,

  createGame: game.create,
  getGame: game.get,
  updateGame: game.update,
  deleteGame: game.delete,

  createRun: run.create,
  getRun: run.get,
  updateRun: run.update,
  deleteRun: run.delete,

  createRunRunner: runRunner.create,
  getRunRunner: runRunner.get,
  updateRunRunner: runRunner.update,
  deleteRunRunner: runRunner.delete,

  createEvent: event.create,
  getEvent: event.get,
  updateEvent: event.update,
  deleteEvent: event.delete,

  createEventExtra: eventExtra.create,
  getEventExtra: eventExtra.get,
  updateEventExtra: eventExtra.update,
  deleteEventExtra: eventExtra.delete,

  createEventRun: eventRun.create,
  getEventRun: eventRun.get,
  updateEventRun: eventRun.update,
  deleteEventRun: eventRun.delete,
};

// Logged User functions
let loggedFunctionsBase = {
  getUser: user.get,
  getUsers: user.getUsers,

  createGame: game.create,
  getGame: game.get,

  createRun: run.create,
  getRun: run.get,

  getRunRunner: runRunner.get,

  createEvent: event.create,
  getEvent: event.get,

  createEventExtra: eventExtra.create,
  getEventExtra: eventExtra.get,

  createEventRun: eventRun.create,
  getEventRun: eventRun.get,
};

// Unlogged Functions
let unloggedFunctions = {
  login: auth.login,
  signup: user.signup,
};
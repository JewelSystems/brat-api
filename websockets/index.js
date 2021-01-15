const ws = require('ws');
const user = require('./user');
const auth = require('./auth');
const userPermission = require('./userPermission');
const game = require('./game');
const run = require('./run');
const runRunner = require('./runRunner');
const event = require('./event');
const eventExtra = require('./eventExtra');
const { v4: uuidv4 } = require('uuid');

module.exports = (server) => {
  const wss = new ws.Server({ server });
  let functions = {
    login: auth.login,

    getUser: user.get,
    getUsers: user.getUsers,
    signup: user.signup,

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
  };

  wss.on('connection', function connection(ws) {
    console.log('New client connection');
    resp = {
      session_id: uuidv4(),
    };
    ws.send(JSON.stringify(resp));

    ws.on('message', async function incoming(message) {
      console.log("recebido: ", message);
      let req = JSON.parse(message);
      let resp = await functions[req.function](req.data);
      ws.send(JSON.stringify(resp));

      /*
      if(req['function'] === 'login'){
        let resp = await authAPI.login(req.data.username, req.data.password);
        ws.send('Login token: ' + JSON.stringify(resp));
      }
      if(req['function'] === 'getUser'){
        let resp = await userAPI.get(req.data.id);
        ws.send('User information: ' + JSON.stringify(resp));
      }
      */
    });
    
    ws.on('close', async function close(){
      console.log('Connection Closed!');
      ws.send('WebSocket Connection Ended!');
    });
  });
};
const API = require('../api/submitRun');

exports.getSubmitRuns = async function(){
  return await API.getSubmitRuns();
};

exports.updateSubmitRun = async function(packet){
  return await API.update(packet.id, packet.reviewed, packet.approved, packet.waiting);
};

exports.updateSubmitRunNRunIncentives = async function(packet){
  return await API.updateSubmitRunNRunIncentives(packet.id, packet.reviewed, packet.approved, packet.waiting, packet.incentives);
};

exports.refuseSubmitRunNRemoveIncentives = async function(packet){
  return await API.refuseSubmitRunNRemoveIncentives(packet.id, packet.reviewed, packet.approved, packet.waiting);
};
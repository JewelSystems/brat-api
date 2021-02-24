import { assert } from 'chai';
import API from '../api/event';
import { createConnection, getRepository } from 'typeorm';
import Event from '../models/Event';
/*
beforeEach(async function() {
  await Game.destroy({where: {}});
});
*/
createConnection();

describe('EventAPI', async function(){
  describe('API Create', async function(){
    it('API.create should return a successful response', async function(){
      const resp = JSON.stringify(await API.create("Evento", "www.donationlink.com", "2021-01-01", "2021-01-10"));

      const eventRepo = getRepository(Event);
      const event = await eventRepo.findOne({ 
        "name": "Evento",
        "donation_link": "www.donationlink.com",
        "start": "2021-01-01",
        "end": "2021-01-10"
      });

      assert.equal(resp, JSON.stringify({"status":200,"msg":"createEvent","data":[{"name":"Evento","donation_link":"www.donationlink.com","active":"N","start":"2021-01-01","end":"2021-01-10","id": Number(event?.id) }],"type":"adminBroadcast"}));
    
      if(event) eventRepo.delete(event.id);
    });
    it('API.create should return a server error when a invalid input is received', async function(){
      const resp = JSON.stringify(await API.create("Evento", "www.donationlink.com", "", "2021-01-10"));
      assert.equal(resp, JSON.stringify({"status": 403, "msg": "Server error"}));
    });
  });
  describe('Api update', async function(){
    it('API.update should return the updated event', async function(){
      await API.create("Evento", "www.donationlink.com", "2021-01-01", "2021-01-10");
      const eventRepo = getRepository(Event);
      const event = await eventRepo.findOne({ 
        "name": "Evento",
        "donation_link": "www.donationlink.com",
        "start": "2021-01-01",
        "end": "2021-01-10"
      });

      let resp;
      if(event){
        resp = JSON.stringify(await API.update(String(event.id), "Evento2", "www.donationlink.com", "2021-01-01", "2021-01-10"));
      }

      const event2 = await eventRepo.findOne({ 
        "name": "Evento2",
        "donation_link": "www.donationlink.com",
        "start": "2021-01-01",
        "end": "2021-01-10"
      });

      assert.equal(resp, JSON.stringify({"status":200,"msg":"updateEvent","data":[{"id":event2?.id,"name":"Evento2","donation_link":"www.donationlink.com","active":"N","start":"2021-01-01","end":"2021-01-10"}],"type":"adminBroadcast"}));

      if(event2) eventRepo.delete(event2.id);
    });
    it('API.update should return a server error when a invalid input is received', async function(){
      await API.create("Evento", "www.donationlink.com", "2021-01-01", "2021-01-10");
      const eventRepo = getRepository(Event);
      const event = await eventRepo.findOne({ 
        "name": "Evento",
        "donation_link": "www.donationlink.com",
        "start": "2021-01-01",
        "end": "2021-01-10"
      });

      let resp;
      if(event){
        resp = JSON.stringify(await API.update(String(event.id), "Evento2", "www.donationlink.com", "", "2021-01-10"));
      }
      
      assert.equal(resp, JSON.stringify({"status": 403, "msg": "Server error"}));
    });
  });
});
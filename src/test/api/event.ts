process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'brat-test';
import { assert } from 'chai';
import API from '../../api/event';
import { createConnection, getConnection, getRepository, Repository } from 'typeorm';
import Event from '../../models/Event';

let eventRepo: Repository<Event>;

before(async function() {
  await createConnection();
  eventRepo = getRepository(Event);

  await getRepository(Event)
    .createQueryBuilder("event")
    .delete()
    .from(Event)
    .execute();
});

afterEach(async function() {
  await getRepository(Event)
    .createQueryBuilder("event")
    .delete()
    .from(Event)
    .execute();
});

describe('EventAPI', async function(){
  describe('API.create', async function(){
    it('API.create should return a successful response', async function(){
      const resp = JSON.stringify(await API.create("Evento", "www.donationlink.com", "2021-01-01", "2021-01-10"));

      const event = await eventRepo.findOne({ 
        "name": "Evento",
        "donation_link": "www.donationlink.com",
        "start": "2021-01-01",
        "end": "2021-01-10"
      });

      assert.equal(resp, JSON.stringify({"status":200,"msg":"createEvent","data":[{"name":"Evento","donation_link":"www.donationlink.com","active":"N","start":"2021-01-01","end":"2021-01-10","id": Number(event?.id) }],"type":"adminBroadcast"}));
    });
    it('API.create should return a server error when a invalid input is received', async function(){
      const resp = JSON.stringify(await API.create("Evento", "www.donationlink.com", "", "2021-01-10"));
      assert.equal(resp, JSON.stringify({"status": 403, "msg": "Server error"}));
    });
  });
  describe('API.update', async function(){
    it('API.update should return the updated event', async function(){
      await API.create("Evento", "www.donationlink.com", "2021-01-01", "2021-01-10");

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
    });
    it('API.update should return a server error when a invalid input is received', async function(){
      await API.create("Evento", "www.donationlink.com", "2021-01-01", "2021-01-10");
      
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
  describe('API.updateEventState', async function(){
    it('API.updateEventState should be able to update a Waiting event to Active', async function(){
      await API.create("Evento", "www.donationlink.com", "2021-01-01", "2021-01-10");

      const event = await eventRepo.findOne({ 
        "name": "Evento",
        "donation_link": "www.donationlink.com",
        "start": "2021-01-01",
        "end": "2021-01-10"
      });

      const resp = JSON.stringify(await API.updateEventState(String(event?.id)));
      assert.equal(resp, JSON.stringify({
        status: 200,
        msg: 'updateEventState',
        data: [ { id: event?.id, active: 'A' } ],
        type: 'adminBroadcast'
      }));
    });
    it('API.updateEventState should be able to update an Active event to Disabled', async function(){
      await API.create("Evento", "www.donationlink.com", "2021-01-01", "2021-01-10");

      const event = await eventRepo.findOne({ 
        "name": "Evento"
      });

      await API.updateEventState(String(event?.id));
      const resp = JSON.stringify(await API.updateEventState(String(event?.id)));
      assert.equal(resp, JSON.stringify({
        status: 200,
        msg: 'updateEventState',
        data: [ { id: event?.id, active: 'D' } ],
        type: 'adminBroadcast'
      }));
    });
    it('API.updateEventState should return an error if a unexistent id is provided', async function(){
      const resp = JSON.stringify(await API.updateEventState(String(0)));
      assert.equal(resp, JSON.stringify({"status":403,"msg":"Server error"}));
    });
  });
  describe('API.getEvents', async function(){
    it('API.getEvents should return the existent events', async function(){
      await API.create("Evento1", "www.donationlink.com", "2021-01-01", "2021-01-10");
      await API.create("Evento2", "www.donationlink.com", "2021-01-01", "2021-01-10");

      const resp = JSON.stringify(await API.getEvents());
      const event1 = await eventRepo.findOne({ 
        "name": "Evento1"
      });
      const event2 = await eventRepo.findOne({ 
        "name": "Evento2"
      });

      assert.equal(resp, JSON.stringify(
        {"status":200,"msg":"listGames","data":[
          [
            {"id":String(event1?.id),"name":"Evento1","donation_link":"www.donationlink.com","active":"N","start":"2021-01-01","end":"2021-01-10"},
            {"id":String(event2?.id),"name":"Evento2","donation_link":"www.donationlink.com","active":"N","start":"2021-01-01","end":"2021-01-10"}
          ]
        ]}
      ));
    });
    it('API.getEvents shout return an error if there is no connections', async function(){
      await getConnection().close();

      const resp = JSON.stringify(await API.getEvents());
      assert.equal(resp, JSON.stringify({ status: 403, msg: 'Server error' }));

      await createConnection();
    });
  });
});
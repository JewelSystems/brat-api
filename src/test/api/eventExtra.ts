process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'brat-test';
import { assert } from 'chai';
import API from '../../api/eventExtra';
import { createConnection, getConnection, getRepository, Repository } from 'typeorm';
import EventExtra from '../../models/EventExtra';
import Event from '../../models/Event';
import EventController from '../../controller/event';

let eventExtraRepo: Repository<EventExtra>;
let event;
let eventId: string;

describe('EventExtraAPI', async function(){
  before(async function() {
    eventExtraRepo = getRepository(EventExtra);
  
    await getRepository(EventExtra)
      .createQueryBuilder("event_extra")
      .delete()
      .from(EventExtra)
      .execute();
    
    event = await EventController.create("Evento", "www.donationlink.com", "2021-01-01", "2021-01-10");
    eventId = event.success.id;
    await EventController.updateEventState(eventId);
  });

  afterEach(async function() {
    await getRepository(EventExtra)
      .createQueryBuilder("event_extra")
      .delete()
      .from(EventExtra)
      .execute();
  });

  after(async function() {
    await getRepository(Event)
      .createQueryBuilder("event")
      .delete()
      .from(Event)
      .execute();
  });

  describe('API.create', async function(){
    it('API.create should create a new EventExtra for the current active Event', async function(){
      const resp = JSON.stringify(await API.create('Entrevista', 600));

      const eventExtra = await eventExtraRepo.findOne({ type:"Entrevista" });

      assert.equal(resp, JSON.stringify({"status":200,"msg":"createEventExtra","data":[{"event_id": String(eventId),"type":"Entrevista","time":600,"id": Number(eventExtra?.id) }],"type":"adminBroadcast"}));
    });
    it('API.create should return an error if does not find an active Event', async function(){
      await getRepository(Event)
        .createQueryBuilder("event")
        .delete()
        .from(Event)
        .execute();

      const resp = JSON.stringify(await API.create('Entrevista', 600));
      
      eventId = (await EventController.create("Evento", "www.donationlink.com", "2021-01-01", "2021-01-10")).success.id;
      await EventController.updateEventState(eventId);

      assert.equal(resp, JSON.stringify({"status":403,"msg":"Server error"}));
    });
  });
  
  describe('API.getExtras', async function(){
    it('API.getExtras should return a list with the current EventExtras', async function(){
      const extra1 = (await API.create('Entrevista', 600)).data[0];
      const extra2 = (await API.create('Anuncio', 600)).data[0];
      const resp = JSON.stringify(await API.getExtras());

      assert.equal(resp, JSON.stringify({
        "status":200,
        "msg":"listExtras",
        "data":[
          [
            {"id":String(extra1.id),"name":"Evento","type":"Entrevista","time":"600"},
            {"id":String(extra2.id),"name":"Evento","type":"Anuncio","time":"600"}
          ]
        ]
      }));
    });
    it('API.getExtras should return an error if there is no connection', async function(){
      await getConnection().close();

      const resp = JSON.stringify(await API.getExtras());
      assert.equal(resp, JSON.stringify({"status":403,"msg":"Server error"}));

      await createConnection();
    });
  });
});
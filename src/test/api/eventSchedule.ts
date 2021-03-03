process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'brat-test';
import { assert } from 'chai';
import API from '../../api/eventSchedule';
import { createConnection, getConnection, getRepository, Repository } from 'typeorm';
import EventController from '../../controller/event';
import Event from '../../models/Event';
import EventSchedule from '../../models/EventSchedule';

let eventScheduleRepo: Repository<EventSchedule>;

let event: Event;

interface ISetup{
  type: string,
  event_id: string,
  event_name: string,
  event_date: string,
  game: string,
  duration: number,
  order: number
}

describe('EventScheduleAPI', async function(){
  before(async function() {
    eventScheduleRepo = getRepository(EventSchedule);
  
    await getRepository(Event)
      .createQueryBuilder("event")
      .delete()
      .from(Event)
      .execute();

    await getRepository(EventSchedule)
      .createQueryBuilder("event_schedule")
      .delete()
      .from(EventSchedule)
      .execute();

    event = (await EventController.create('Evento', 'www.donation.com.br', '2021-01-01', '2021-02-01')).success;
    await EventController.updateEventState(String(event.id));
  });
  
  after(async function(){
    await getRepository(Event)
      .createQueryBuilder("event")
      .delete()
      .from(Event)
      .execute();

    await getRepository(EventSchedule)
      .createQueryBuilder("event_schedule")
      .delete()
      .from(EventSchedule)
      .execute();
  });
  
  afterEach(async function(){
    await getRepository(EventSchedule)
      .createQueryBuilder("event_schedule")
      .delete()
      .from(EventSchedule)
      .execute();
  });
  
  describe('API.createSetupEventSchedule', async function(){
    it('API.createSetupEventSchedule should create a new setup', async function(){
      const data = "[{\"order\": 1}]";
      const setups: ISetup[] = [{
        type: "setup",
        event_id: String(event.id),
        event_name: event.name,
        event_date: event.start,
        game: 'Setup',
        duration: 600,
        order: 1
      }];
      
      const resp = JSON.stringify(await API.createSetupEventSchedule(data, setups));

      const id = (await eventScheduleRepo.findOneOrFail({ order: 1 })).id;

      assert.equal(resp, JSON.stringify({
        "status":200,
        "msg":"createSetupEventSchedule",
        "data":
        [
          {
            "success":
            [
              {
                "id":String(id),
                "order":"1",
                "type":setups[0].type,
                "event_id":String(event.id),
                "event_run_id":null,
                "event_extra_id":null,
                "extra_time":null,
                "setup_time":String(setups[0].duration),
                "active":0,
                "done":0,
                "final_time":null,
                "event_name":setups[0].event_name,
                "event_date":"2021-01-01T03:00:00.000Z",
                "game":setups[0].game,
                "duration":String(setups[0].duration),
                "category":null,
                "interval":null,
                "platform":null,
                "runner":null,
                "stream_link":null,
                "event_extra_time":null,
                "event_extra_type":null
              }
            ]
          }
        ],
        "type":"adminBroadcast"}));
    });
    it('API.createSetupEventSchedule should create multiple setups', async function(){
      const data = "[{\"order\": 1}, {\"order\": 2}, {\"order\": 3}]";
      const setups: ISetup[] = [{
        type: "setup",
        event_id: String(event.id),
        event_name: event.name,
        event_date: event.start,
        game: 'Setup',
        duration: 600,
        order: 3
      },{
        type: "setup",
        event_id: String(event.id),
        event_name: event.name,
        event_date: event.start,
        game: 'Setup',
        duration: 600,
        order: 2
      },{
        type: "setup",
        event_id: String(event.id),
        event_name: event.name,
        event_date: event.start,
        game: 'Setup',
        duration: 600,
        order: 1
      }];
      
      const resp = JSON.stringify(await API.createSetupEventSchedule(data, setups));

      const id1 = (await eventScheduleRepo.findOneOrFail({ order: 1 })).id;
      const id2 = (await eventScheduleRepo.findOneOrFail({ order: 2 })).id;
      const id3 = (await eventScheduleRepo.findOneOrFail({ order: 3 })).id;

      assert.equal(resp, JSON.stringify(
        {
          "status":200,
          "msg":"createSetupEventSchedule",
          "data":
          [
            {
              "success":
              [
                {"id":id1,"order":"1","type":setups[0].type,"event_id":setups[0].event_id,"event_run_id":null,"event_extra_id":null,"extra_time":null,"setup_time":"600","active":0,"done":0,"final_time":null,"event_name":"Evento","event_date":"2021-01-01T03:00:00.000Z","game":"Setup","duration":"600","category":null,"interval":null,"platform":null,"runner":null,"stream_link":null,"event_extra_time":null,"event_extra_type":null},
                {"id":id2,"order":"2","type":setups[1].type,"event_id":setups[1].event_id,"event_run_id":null,"event_extra_id":null,"extra_time":null,"setup_time":"600","active":0,"done":0,"final_time":null,"event_name":"Evento","event_date":"2021-01-01T03:00:00.000Z","game":"Setup","duration":"600","category":null,"interval":null,"platform":null,"runner":null,"stream_link":null,"event_extra_time":null,"event_extra_type":null},
                {"id":id3,"order":"3","type":setups[2].type,"event_id":setups[2].event_id,"event_run_id":null,"event_extra_id":null,"extra_time":null,"setup_time":"600","active":0,"done":0,"final_time":null,"event_name":"Evento","event_date":"2021-01-01T03:00:00.000Z","game":"Setup","duration":"600","category":null,"interval":null,"platform":null,"runner":null,"stream_link":null,"event_extra_time":null,"event_extra_type":null}
              ]
            }
          ],
          "type":"adminBroadcast"
        }));
    });
    it('API.createSetupEventSchedule should return an error if missing data', async function(){
      const data = "";
      const setups: ISetup[] = [{
        type: "setup",
        event_id: String(event.id),
        event_name: event.name,
        event_date: event.start,
        game: 'Setup',
        duration: 600,
        order: 1
      }];
      
      const resp = JSON.stringify(await API.createSetupEventSchedule(data, setups));

      assert.equal(resp, JSON.stringify({"status":403,"msg":"Server error"}));
    });
  });

  describe('API.deleteEventSchedule', async function(){
    it('API.deleteEventSchedule should remove a setup', async function(){
      const data = "[{\"order\": 1}]";
      const setups: ISetup[] = [{
        type: "setup",
        event_id: String(event.id),
        event_name: event.name,
        event_date: event.start,
        game: 'Setup',
        duration: 600,
        order: 1
      }];
      
      await API.createSetupEventSchedule(data, setups);

      const id = (await eventScheduleRepo.findOneOrFail({ order: 1 })).id;

      const resp = JSON.stringify(await API.deleteEventSchedule(String(id)));

      assert.equal(resp, JSON.stringify({"status":200,"msg":"deleteEventSchedule","data":[{"success":[]}],"type":"adminBroadcast"}));
    });
    it('API.deleteEventSchedule should an error if an invalid id is used', async function(){
      const resp = JSON.stringify(await API.deleteEventSchedule(''));

      assert.equal(resp, JSON.stringify({"status":403,"msg":"Server error"}));
    });
  });
  
  describe('API.updateEventSchedule', async function(){
    it('API.updateEventSchedule should update a setup order', async function(){
      const setups: ISetup[] = [{
        type: "setup",
        event_id: String(event.id),
        event_name: event.name,
        event_date: event.start,
        game: 'Setup',
        duration: 600,
        order: 1
      },{
        type: "setup",
        event_id: String(event.id),
        event_name: event.name,
        event_date: event.start,
        game: 'Setup',
        duration: 600,
        order: 2
      }];
      
      const data = "[{\"order\": 1}, {\"order\": 2}]";

      const schedule = (await API.createSetupEventSchedule(data, setups)).data[0].success;
      
      const resp = JSON.stringify((await API.updateEventSchedule(`[{"id": ${schedule[1].id}, "order": 1}, {"id": ${schedule[0].id}, "order": 2}]`)).data[0].success);

      assert.equal(resp, JSON.stringify(
        [
          {"id":schedule[1].id,"order":"1","type":"setup","event_id":String(event.id),"event_run_id":null,"event_extra_id":null,"extra_time":null,"setup_time":"600","active":0,"done":0,"final_time":null,"event_name":"Evento","event_date":"2021-01-01T03:00:00.000Z","game":"Setup","duration":"600","category":null,"interval":null,"platform":null,"runner":null,"stream_link":null,"event_extra_time":null,"event_extra_type":null},
          {"id":schedule[0].id,"order":"2","type":"setup","event_id":String(event.id),"event_run_id":null,"event_extra_id":null,"extra_time":null,"setup_time":"600","active":0,"done":0,"final_time":null,"event_name":"Evento","event_date":"2021-01-01T03:00:00.000Z","game":"Setup","duration":"600","category":null,"interval":null,"platform":null,"runner":null,"stream_link":null,"event_extra_time":null,"event_extra_type":null}
        ]));
    });
    it('API.updateEventSchedule should return an error if there is no data', async function(){
      const resp = JSON.stringify((await API.updateEventSchedule('')));

      assert.equal(resp, JSON.stringify({"status":403,"msg":"Server error"}));
    });
  });

  describe('API.getEventSchedule', async function(){
    it('API.getEventSchedule should return the current schedule orded by order', async function(){
      const setups: ISetup[] = [{
        type: "setup",
        event_id: String(event.id),
        event_name: event.name,
        event_date: event.start,
        game: 'Setup',
        duration: 600,
        order: 2
      },{
        type: "setup",
        event_id: String(event.id),
        event_name: event.name,
        event_date: event.start,
        game: 'Setup',
        duration: 600,
        order: 1
      }];
      
      const data = "[{\"order\": 1}, {\"order\": 2}]";

      const schedule = (await API.createSetupEventSchedule(data, setups)).data[0].success;

      const resp = JSON.stringify((await API.getEventSchedule()).data[0]);

      assert.equal(resp, JSON.stringify(
        [
          {"id":schedule[0].id,"order":"1","type":"setup","event_id":String(event.id),"event_run_id":null,"event_extra_id":null,"extra_time":null,"setup_time":"600","active":0,"done":0,"final_time":null,"event_name":"Evento","event_date":"2021-01-01T03:00:00.000Z","game":"Setup","duration":"600","category":null,"interval":null,"platform":null,"runner":null,"stream_link":null,"event_extra_time":null,"event_extra_type":null},
          {"id":schedule[1].id,"order":"2","type":"setup","event_id":String(event.id),"event_run_id":null,"event_extra_id":null,"extra_time":null,"setup_time":"600","active":0,"done":0,"final_time":null,"event_name":"Evento","event_date":"2021-01-01T03:00:00.000Z","game":"Setup","duration":"600","category":null,"interval":null,"platform":null,"runner":null,"stream_link":null,"event_extra_time":null,"event_extra_type":null}
        ]));
    });
    it('API.getEventSchedule should return an error if there is no connection', async function(){
      await getConnection().close();

      const setups: ISetup[] = [{
        type: "setup",
        event_id: String(event.id),
        event_name: event.name,
        event_date: event.start,
        game: 'Setup',
        duration: 600,
        order: 2
      },{
        type: "setup",
        event_id: String(event.id),
        event_name: event.name,
        event_date: event.start,
        game: 'Setup',
        duration: 600,
        order: 1
      }];
      
      const data = "";

      await API.createSetupEventSchedule(data, setups);

      const resp = JSON.stringify(await API.getEventSchedule());

      assert.equal(resp, JSON.stringify({"status":403,"msg":"Server error"}));

      await createConnection();
    });
  });
});
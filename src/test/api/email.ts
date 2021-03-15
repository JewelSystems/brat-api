process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'brat-test';
import { assert } from 'chai';
import API from '../../api/email';
import { createConnection, getConnection, getRepository, Repository } from 'typeorm';

describe('EmailAPI', async function(){
  describe.skip('API.sendEmail', async function(){
    it('API.sendEmail should send an email', async () => {
      const result = await API.sendEmail();
      assert.equal(result, 'ok');
    }).timeout(10000);
  });
});
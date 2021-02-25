process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'brat-test';
import { assert } from 'chai';
import API from '../../api/userPermission';
import { createConnection, getConnection, getRepository, Repository } from 'typeorm';
import UserPemission from '../../models/UserPemission';
import UserController from '../../controller/user';
import User from '../../models/User';

let userPermissionRepo: Repository<UserPemission>;
let userRepo: Repository<User>;
let userId: string;

describe('UserPemissionAPI', async function(){
  before(async function() {
    userPermissionRepo = getRepository(UserPemission);
  
    await getRepository(UserPemission)
      .createQueryBuilder("user_permissions")
      .delete()
      .from(UserPemission)
      .execute();
      
    await UserController.create('Nome', 'Sobrenome', 'Usuario', 'Nickname', 'email@email.com', '12345678', 'M', '2000/01/01', '021999999999', '', '', '', '', '', '');
    userRepo = getRepository(User);
    const user = (await userRepo.find())[0];
    userId = String(user.id);
  });
  afterEach(async function() {
    await getRepository(UserPemission)
      .createQueryBuilder("user_permissions")
      .delete()
      .from(UserPemission)
      .execute();
  });

  after(async function(){
    await getRepository(User)
      .createQueryBuilder("user")
      .delete()
      .from(User)
      .execute();
  });
  describe('API.addPermission', async function(){
    it('API.addPermission should add a permission to an user', async function(){
      const resp = JSON.stringify(await API.addPermission(userId, userId, 'admin'));

      assert.equal(resp, JSON.stringify({"status":200,"msg":"addPermission","data":["OK"]}));
    });
    it('API.addPermission should return an error if the user do not exist', async function(){
      const resp = JSON.stringify(await API.addPermission('0', '0', 'admin'));

      assert.equal(resp, JSON.stringify({"status":403,"msg":"Server error"}));
    });
  });
  
  describe('API.removePermission', async function(){
    it('API.removePermission should remove a permission from an user', async function(){
      await API.addPermission(userId, userId, 'admin');
      const resp = JSON.stringify(await API.removePermission(userId, userId, 'admin'));
      
      assert.equal(resp, JSON.stringify({"status":200,"msg":"removePermission","data":["OK"]}));
    });
    it('API.removePermission should return an error if there is no connection', async function(){
      await getConnection().close();

      const resp = JSON.stringify(await API.removePermission('0', '0', 'admin'));
      assert.equal(resp, JSON.stringify({"status":403,"msg":"Server error"}));

      await createConnection();
    });
  });
});
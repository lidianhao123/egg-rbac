'use strict';

const request = require('supertest');
const mm = require('egg-mock');
const assert = require('assert');
const mongooseStorage = require('../lib/mongoose/index');

describe('test/rbac.test.js', () => {
  let app;
  let msi;
  before(function* () {
    app = mm.app({
      baseDir: 'apps/rbac-test',
    });
    yield app.ready().then(() => {
      msi = new mongooseStorage(app.mongoose);
    });
    return;
  });

  after(() => app.close());
  afterEach(mm.restore);


  const testRole = {
    name: 'test_role', alias: '测试创建角色',
  };

  const testPermission = {
    name: 'test_permission', alias: '测试创建权限',
  };

  it('shuold create a new role', function* () {
    // delete old data
    yield app.mongoose.model('Role').remove({ name: testRole.name });
    const role1 = yield msi.addRole(testRole);
    assert(role1.name === testRole.name);
    assert(role1.alias === testRole.alias);
    const role2 = yield msi.addRole(testRole);
    assert(role2 === null);
  });

  it('shuold create a new permission', function* () {
    // delete old data
    yield app.mongoose.model('Permission').remove({ name: testPermission.name });
    const permission1 = yield msi.addPermission(testPermission);
    assert(permission1.name === testPermission.name);
    assert(permission1.alias === testPermission.alias);
    const permission = yield msi.addPermission(testPermission);
    assert(permission === null);
  });

  it('shuold get role', function* () {
    const testRole = {
      name: 'test_role', alias: '测试创建角色',
    };
    const role = yield msi.getRole(testRole.name);
    assert(role.name === testRole.name);
    assert(role.alias === testRole.alias);
    assert(role.grants.length === 0);
  });

  it('shuold get roles', function* () {
    const testRole = {
      name: 'test_role', alias: '测试创建角色',
    };
    const role = yield msi.getAllRoles();
    assert(role.length === 1);
    assert(role[0].name === testRole.name);
    assert(role[0].alias === testRole.alias);
    assert(role[0].grants.length === 0);
  });

  it('shuold get some permissions', function* () {
    const permission = yield msi.getPermissions([ testPermission.name ]);
    assert(permission.length === 1);
  });

  it('shuold get all permissions', function* () {
    const permission = yield msi.getAllPermissions();
    assert(permission.length === 1);
  });

  // it('shuold get role', function* () {
  //   const testRole = {
  //     name: 'test_role', alias: '测试创建角色',
  //   };
  //   // delete old data
  //   yield app.mongoose.model('Role').remove({ name: testRole.name });
  //   yield msi.addRole(testRole);
  //   const role = msi.getRole(testRole.name);
  //   assert(role.name === testRole.name);
  //   assert(role.alias === testRole.alias);
  // });
  // it('shoulde Object', function* () {
  // return app.rbac.expect('object');
  // console.info(app.rbac);
  // assert(app.rbac);
  // const result = yield app.rbac.addPermission({ name: 'test1', alias: '测试' });
  // assert(result);
  // assert(app.mongoose.model('User') === app.model.User);
  // const User = new app.model.User();
  // User.name = 'lidian';
  // assert(User.save());
  // const result1 = yield app.mongoose.model('User').find({});
  // assert(result1);
  // });
});

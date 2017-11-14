'use strict';

const assert = require('assert');
const mongoose = require('mongoose');
const mongooseStorage = require('../lib/mongoose/index');
const config = require('./fixtures/apps/rbac-test/config/config.unittest').mongoose;
mongoose.Promise = Promise;
const EventEmitter = require('events');
const awaitEvent = require('await-event');

describe('test/mongoose.test.js', () => {
  // let app;
  let msi;
  let db;
  before(function* () {
    const heartEvent = new EventEmitter();
    heartEvent.await = awaitEvent;

    db = mongoose.createConnection(config.url, config.options);
    db.Schema = mongoose.Schema;

    db.on('error', err => { console.error('connect mongoose error', err); });

    db.on('disconnected', () => { console.info('disconnected mongoose '); });

    db.on('connected', () => {
      console.info('connect mongoose '); heartEvent.emit('connected');
    });

    db.on('reconnected', () => {
      console.info('reconnected mongoose ');
    });

    yield heartEvent.await('connected');
    console.info('mongoose start successfully and server status is ok');
    msi = new mongooseStorage(db);
    yield db.model('Role').remove({});
    yield db.model('Permission').remove({});
  });

  after(function* () {
    yield db.model('Role').remove({});
    yield db.model('Permission').remove({});
  });

  const testRole = {
    name: 'test_role', alias: '测试创建角色',
  };

  const testPermission = {
    name: 'test_permission', alias: '测试创建权限',
  };

  it('should create a new role', function* () {
    const role1 = yield msi.newRole(testRole);
    assert(role1.name === testRole.name);
    assert(role1.alias === testRole.alias);
    const role2 = yield msi.newRole(testRole);
    assert(role2 === null);
    // const result = yield db.model('Role').update({ _id: role1._id }, { $set: { alias: '222' } });
    // assert.deepEqual(result, { ok: 1, n: 1, nModified: 1 });
  });

  it('should create a new permission', function* () {
    const permission1 = yield msi.newPermission(testPermission);
    assert(permission1.name === testPermission.name);
    assert(permission1.alias === testPermission.alias);
    const permission = yield msi.newPermission(testPermission);
    assert(permission === null);
  });

  it('should modify role alias', function* () {
    const newRoleAlias = '测试角色修改别名';
    const oldRole = yield db.model('Role').findOne({ name: testRole.name });
    const result1 = yield msi.modifyRoleAlias(oldRole._id, newRoleAlias);
    assert.deepEqual(result1, { ok: 1, n: 1, nModified: 1 });

    const result2 = yield msi.modifyRoleAlias('5a0912bd8546bd342035638B', newRoleAlias);
    assert.deepEqual(result2, { ok: 1, n: 0, nModified: 0 });

    const result3 = yield msi.modifyRoleAlias(oldRole._id, testRole.alias);
    assert.deepEqual(result3, { ok: 1, n: 1, nModified: 1 });
  });

  it('should modify permission alias', function* () {
    const newPermissionAlias = '测试权限修改别名';
    const oldPermission = yield db.model('Permission').findOne({ name: testPermission.name });
    const result1 = yield msi.modifyPermissionAlias(oldPermission._id, newPermissionAlias);
    assert.deepEqual(result1, { ok: 1, n: 1, nModified: 1 });

    const result2 = yield msi.modifyPermissionAlias('5a0912bd8546bd342035638B', newPermissionAlias);
    assert.deepEqual(result2, { ok: 1, n: 0, nModified: 0 });

    const result3 = yield msi.modifyPermissionAlias(oldPermission._id, testPermission.alias);
    assert.deepEqual(result3, { ok: 1, n: 1, nModified: 1 });
  });

  it('should remove role success', function* () {
    const roleData = {
      name: 'test_remove',
      alias: '测试删除角色',
    };
    const role = yield msi.newRole(roleData);

    const result = yield msi.removeRole(role._id);
    assert.deepEqual(result.result, { n: 1, ok: 1 });
  });

  it('should remove permission success', function* () {
    const permissionData = {
      name: 'test_remove',
      alias: '测试删除权限',
    };
    const permission = yield msi.newPermission(permissionData);
    const role = yield msi.getRole(testRole.name);
    assert(role.name === testRole.name);
    const result1 = yield msi.addPermission(role._id, [ permission._id ]);
    assert.deepEqual(result1, { ok: 1, n: 1, nModified: 1 });

    const [ result2, result3 ] = yield msi.removePermission(permission._id);
    assert.deepEqual(result2.result, { n: 1, ok: 1 });
    assert.deepEqual(result3, { ok: 1, n: 1, nModified: 1 });
  });

  it('should get role', function* () {
    const role = yield msi.getRole(testRole.name);
    assert(role.name === testRole.name);
    assert(role.alias === testRole.alias);
    assert(role.grants.length === 0);
  });

  it('should get roles', function* () {
    const role = yield msi.getAllRoles();
    assert(role.length === 1);
    assert(role[0].name === testRole.name);
    assert(role[0].alias === testRole.alias);
    assert(role[0].grants.length === 0);
  });

  it('should get some permissions', function* () {
    const permission = yield msi.getPermissions([ testPermission.name ]);
    assert(permission.length === 1);
  });

  it('should get all permissions', function* () {
    const permission = yield msi.getAllPermissions();
    assert(permission.length === 1);
  });

  it('should add/remove permission in the role', function* () {
    const permission = yield msi.getPermissions([ testPermission.name ]);
    const role = yield msi.getRole(testRole.name);
    const result = yield msi.addPermission(role._id, [ permission[0]._id ]);

    assert(typeof permission[0]._id === 'object');
    assert.deepEqual(result, { ok: 1, n: 1, nModified: 1 });
    const role2 = yield msi.getRole(testRole.name);

    assert(permission[0].equals(role2.grants[0]));

    const result2 = yield msi.removePermissions(role._id, [ permission[0]._id ]);
    assert.deepEqual(result2, { ok: 1, n: 1, nModified: 1 });
  });
});

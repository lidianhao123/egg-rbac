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

  it('shuold create a new role', function* () {
    const role1 = yield msi.newRole(testRole);
    assert(role1.name === testRole.name);
    assert(role1.alias === testRole.alias);
    const role2 = yield msi.newRole(testRole);
    assert(role2 === null);
  });

  it('shuold create a new permission', function* () {
    const permission1 = yield msi.newPermission(testPermission);
    assert(permission1.name === testPermission.name);
    assert(permission1.alias === testPermission.alias);
    const permission = yield msi.newPermission(testPermission);
    assert(permission === null);
  });

  it('shuold get role', function* () {
    const role = yield msi.getRole(testRole.name);
    assert(role.name === testRole.name);
    assert(role.alias === testRole.alias);
    assert(role.grants.length === 0);
  });

  it('shuold get roles', function* () {
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

  it('shuold add permission to the role', function* () {
    const permission = yield msi.getPermissions([ testPermission.name ]);
    const role = yield msi.getRole(testRole.name);
    const newRole = yield msi.addPermission(role._id, [ permission[0]._id ]);
    // console.info(newRole, permission[0]._id);
    assert(typeof permission[0]._id === 'object');
    assert(newRole.ok === 1);
    const role2 = yield msi.getRole(testRole.name);

    assert(permission[0].equals(role2.grants[0]));
    // assert(role2.grants[0]._id, permission[0]._id);
    // assert(role2.grants[0].name, permission[0].name);
    // assert(role2.grants[0].alias, permission[0].alias);
  });
});

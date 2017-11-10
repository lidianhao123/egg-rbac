'use strict';

const mm = require('egg-mock');
const assert = require('power-assert');
const permissions = require('./fixtures/apps/rbac-test/config/rbac').permissions;

describe('test/rbac.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/rbac-test',
    });
    // 等待 app 启动成功，才能执行测试用例
    return app.ready();
  });

  after(() => app.close());
  afterEach(mm.restore);

  const roles = [
    { name: 'editer', alias: '编辑', grants: [ 'create_article', 'delete_article', 'create_article', 'edit_article' ] },
  ];

  it('should get Error when call initData method with error parameter', function* () {
    try {
      app.rbac.initData();
    } catch (e) {
      assert(e.message === '[egg-rbac] initData parameter permissions is undefined');
    }
    try {
      app.rbac.initData({});
    } catch (e) {
      assert(e.message === '[egg-rbac] initData parameter roles is undefined');
    }
  });

  it('should get Error when call newRole method with error parameter', function* () {
    assert(app.rbac.newRole({}).message === '[egg-rbac] newRole parameter name is undefined');
    assert(app.rbac.newRole({ name: 'admin' }).message === '[egg-rbac] newRole parameter alias is undefined');
  });

  it('should retrun permission object when call newPermission', function* () {
    const permissionData = { name: 'test_new_permission', alias: '测试' };
    const result = yield app.rbac.newPermission(permissionData);
    assert(result.name === permissionData.name);
    assert(result.alias === permissionData.alias);
    assert(result._id);
  });

  it('should get Error when call newPermission method with error parameter', function* () {
    assert(app.rbac.newPermission({}).message === '[egg-rbac] newPermission parameter name is undefined');
    assert(app.rbac.newPermission({ name: 'delete_user' }).message === '[egg-rbac] newPermission parameter alias is undefined');
  });

  it('should get Error when call addPermission method with error parameter', function* () {
    assert(app.rbac.addPermission().message === '[egg-rbac] addPermission parameter _id is undefined');
    assert(app.rbac.addPermission('2112').message === '[egg-rbac] addPermission parameter permissionIds is undefined');
  });

  it('should get Error when call getRolePermission method parameter name is undefined ', function* () {
    assert(app.rbac.getRolePermission().message === '[egg-rbac] getRolePermission parameter name must string');
    assert(app.rbac.getRolePermission({}).message === '[egg-rbac] getRolePermission parameter name must string');
  });

  it('should return add permission to role when addPermission', function* () {
    const role = yield app.mongoose.model('Role').findOne({ name: 'editer' });
    const permission1 = yield app.mongoose.model('Permission').findOne({ name: 'create_user' });
    const permission2 = yield app.mongoose.model('Permission').findOne({ name: 'query_user' });
    const result = yield app.rbac.addPermission(role._id, [ permission1._id, permission2._id ]);
    assert(result.ok === 1);
  });

  it('should get all roles after app start', function* () {
    const allRoles1 = yield app.rbac.getAllRoles();
    const allRoles2 = yield app.mongoose.model('Role').find({});
    assert.deepEqual(allRoles1, allRoles2);
  });

  it('should not add roles when call _initPermissions with exist permission info', function* () {
    const result1 = yield app.rbac._initPermissions([]);
    assert(result1.length === 0);
    const result2 = yield app.rbac._initPermissions(permissions);
    assert(result2.length === 0);
  });

  it('should not add roles when call _initRole with exist role info', function* () {
    const result = yield app.rbac._initRole(roles);
    assert(result[0].ok === 1);
    assert(result[1].ok === 1);
  });

  it('should GET /admin 200 when role is admin', function* () {
    const roleName = 'admin';
    const permissions = yield app.rbac.getRolePermission(roleName);

    // test role equal to 'admin'
    yield app.httpRequest()
      .get('/admin?role=' + roleName)
      // .expect(200, 'success')
      .expect(200, 'success', {
        session: {
          permission: { roleName, permissions },
        },
      });


    // with session info so no need role
    app.mockSession({
      permission: { roleName, permissions },
    });
    yield app.httpRequest()
      .get('/admin')
      .expect(200, 'success');
  });

  it('should GET /admin 404 when role is undefined', function* () {
    return app.httpRequest()
      .get('/admin')
      .expect(401, 'Unauthorized');
  });
});

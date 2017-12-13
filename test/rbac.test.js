'use strict';

const mm = require('egg-mock');
const assert = require('power-assert');
const permissions = require('./fixtures/apps/rbac-test/config/rbac').permissions;
const Role = require('../lib/role');

describe('test/rbac.test.js', () => {
  let app;
  before(async function() {
    app = mm.app({
      baseDir: 'apps/rbac-test',
    });
    // 等待 app 启动成功，才能执行测试用例
    return app.ready();
  });

  after(async function() {
    await app.mongoose.model('Role').remove({});
    await app.mongoose.model('Permission').remove({});
    app.close();
  });
  afterEach(mm.restore);

  const roles = [
    { name: 'editer', alias: '编辑', grants: [ 'create_article', 'delete_article', 'create_article', 'edit_article' ] },
  ];

  const permissionData = { name: 'test_new_permission', alias: '测试' };

  it('should get Error when call initData method with error parameter', async function() {
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

  it('should get Error when call newRole method with error parameter', async function() {
    assert(app.rbac.newRole({}).message === '[egg-rbac] newRole parameter name is undefined');
    assert(app.rbac.newRole({ name: 'admin' }).message === '[egg-rbac] newRole parameter alias is undefined');
  });

  it('should retrun permission object when call newPermission', async function() {
    const result = await app.rbac.newPermission(permissionData);
    assert(result.name === permissionData.name);
    assert(result.alias === permissionData.alias);
    assert(result._id);
  });

  it('should get Error when call newPermission method with error parameter', async function() {
    assert(app.rbac.newPermission({}).message === '[egg-rbac] newPermission parameter name is undefined');
    assert(app.rbac.newPermission({ name: 'delete_user' }).message === '[egg-rbac] newPermission parameter alias is undefined');
  });

  it('should get Error when call addPermission method with error parameter', async function() {
    assert(app.rbac.addPermission().message === '[egg-rbac] addPermission parameter _id is undefined');
    assert(app.rbac.addPermission('2112').message === '[egg-rbac] addPermission parameter permissionIds is undefined');
  });

  it('should get Error when call removePermissions method with error parameter', async function() {
    assert(app.rbac.removePermissions().message === '[egg-rbac] removePermissions parameter _id is undefined');
    assert(app.rbac.removePermissions('2112').message === '[egg-rbac] removePermissions parameter permissionIds is undefined');
  });

  it('should get Error when call removeRole method with error parameter', async function() {
    assert(app.rbac.removeRole().message === '[egg-rbac] removeRole parameter _id is undefined');
  });

  it('should get Error when call removePermission method with error parameter', async function() {
    assert(app.rbac.removePermission().message === '[egg-rbac] removePermission parameter _id is undefined');
  });

  it('should get Error when call modifyRoleAlias method with error parameter', async function() {
    assert(app.rbac.modifyRoleAlias().message === '[egg-rbac] modifyRoleAlias parameter _id is undefined');
    assert(app.rbac.modifyRoleAlias('2112').message === '[egg-rbac] modifyRoleAlias parameter alias is undefined');
  });

  it('should get Error when call modifyPermissionAlias method with error parameter', async function() {
    assert(app.rbac.modifyPermissionAlias().message === '[egg-rbac] modifyPermissionAlias parameter _id is undefined');
    assert(app.rbac.modifyPermissionAlias('2112').message === '[egg-rbac] modifyPermissionAlias parameter alias is undefined');
  });

  it('should get Error when call getRolePermission method parameter name is undefined ', async function() {
    assert(app.rbac.getRolePermission().message === '[egg-rbac] getRolePermission parameter name must string');
    assert(app.rbac.getRolePermission({}).message === '[egg-rbac] getRolePermission parameter name must string');
  });

  it('should return add permission to role when addPermission', async function() {
    const role = await app.mongoose.model('Role').findOne({ name: 'editer' });
    const permission1 = await app.mongoose.model('Permission').findOne({ name: 'create_user' });
    const permission2 = await app.mongoose.model('Permission').findOne({ name: 'query_user' });
    const permission3 = await app.mongoose.model('Permission').findOne({ name: 'edit_user' });
    const result = await app.rbac.addPermission(role._id, [ permission1._id, permission2._id, permission3._id ]);
    assert(result.ok === 1);
  });

  it('should remove permissions from role when removePermissions', async function() {
    const role = await app.mongoose.model('Role').findOne({ name: 'editer' });
    const permission1 = await app.mongoose.model('Permission').findOne({ name: 'create_user' });
    const permission2 = await app.mongoose.model('Permission').findOne({ name: 'query_user' });
    const result = await app.rbac.removePermissions(role._id, [ permission1._id, permission2._id ]);
    assert.deepEqual(result, { ok: 1, n: 1, nModified: 1 });
  });

  it('should get all roles after app start', async function() {
    const allRoles1 = await app.rbac.getAllRoles();
    const allRoles2 = await app.mongoose.model('Role').find({});
    assert.deepEqual(allRoles1, allRoles2);
  });

  it('should not add roles when call _initPermissions with exist permission info', async function() {
    const result1 = await app.rbac._initPermissions([]);
    assert(result1.length === 0);
    const result2 = await app.rbac._initPermissions(permissions);
    assert(result2.length === 0);
  });

  it('should not add roles when call _initRole with exist role info', async function() {
    const result = await app.rbac._initRole(roles, { name: 'superrole', alias: '超级管理员' });
    assert(result[0].ok === 1);
    assert(result[1].ok === 1);
  });

  it('should return role when new Role width roleName and permissions', async function() {
    const roleName = roles[0].name;
    const permissions = await app.rbac.getRolePermission(roleName);
    const role = new Role(roleName, permissions);

    assert(role.roleName === roleName);
    assert(role.canAll(roles[0].grants));
  });


  it('should modify role alias', async function() {
    const newRoleAlias = '测试角色修改别名';
    const oldRole = await app.mongoose.model('Role').findOne({ name: roles[0].name });
    const result1 = await app.rbac.modifyRoleAlias(oldRole._id, newRoleAlias);
    assert.deepEqual(result1, { ok: 1, n: 1, nModified: 1 });

    const result2 = await app.rbac.modifyRoleAlias('5a0912bd8546bd342035638B', newRoleAlias);
    assert.deepEqual(result2, { ok: 1, n: 0, nModified: 0 });

    const result3 = await app.rbac.modifyRoleAlias(oldRole._id, roles[0].alias);
    assert.deepEqual(result3, { ok: 1, n: 1, nModified: 1 });
  });

  it('should modify permission alias', async function() {
    const newPermissionAlias = '测试权限修改别名';
    const oldPermission = await app.mongoose.model('Permission').findOne({ name: permissionData.name });
    const result1 = await app.rbac.modifyPermissionAlias(oldPermission._id, newPermissionAlias);
    assert.deepEqual(result1, { ok: 1, n: 1, nModified: 1 });

    const result2 = await app.rbac.modifyPermissionAlias('5a0912bd8546bd342035638B', newPermissionAlias);
    assert.deepEqual(result2, { ok: 1, n: 0, nModified: 0 });

    const result3 = await app.rbac.modifyPermissionAlias(oldPermission._id, permissionData.alias);
    assert.deepEqual(result3, { ok: 1, n: 1, nModified: 1 });
  });

  it('should remove role success', async function() {
    const roleData = {
      name: 'test_remove',
      alias: '测试删除角色',
    };
    const role = await app.rbac.newRole(roleData);

    const result = await app.rbac.removeRole(role._id);
    assert.deepEqual(result.result, { n: 1, ok: 1 });
  });

  it('should return role when getRole', async function() {
    assert(app.rbac.getRole().message === '[egg-rbac] getRole parameter name must string');
    const role = await app.rbac.getRole('editer');
    assert(role.name === 'editer');
  });

  // TODO
  // it('should remove permission success', async function() {
  //   const permisData = {
  //     name: 'test_remove2',
  //     alias: '测试删除权限',
  //   };
  //   const permission = await app.rbac.newPermission(permisData);
  //   console.info('permission._id = ', permission._id);

  //   const role = await app.rbac.getRole('editer');
  //   assert(role.name === 'editer');
  //   console.info('role.name = ', role.name);

  //   const result1 = await app.rbac.addPermission(role._id, [ permission._id ]);
  //   assert.deepEqual(result1, { ok: 1, n: 1, nModified: 1 });
  //   console.info('before start removePermission');

  //   const [ res, res1 ] = await app.rbac.removePermission(permission._id);
  //   assert.deepEqual(res.result, { n: 1, ok: 1 });
  //   assert.deepEqual(res1, { ok: 1, n: 1, nModified: 1 });
  // });

  it('should remove permission', async function() {
    const obj1 = await app.mongoose.model('Permission').findOne({ name: 'edit_user' });
    assert(obj1.name === 'edit_user');
    const [ res1, res ] = await app.rbac.removePermission(obj1._id);
    assert.deepEqual(res1.result, { ok: 1, n: 1 });
    assert.deepEqual(res, { ok: 1, n: 1, nModified: 1 });
  });

  it('should GET /admin 200 when role is admin', async function() {
    const roleName = 'admin';
    const permissions = await app.rbac.getRolePermission(roleName);

    // test role equal to 'admin'
    await app.httpRequest()
      .get('/admin?role=' + roleName)
      // .expect(200, 'success')
      .expect(200, 'success', {
        session: {
          permission: { roleName, permissions },
        },
      });


    // with session info so no need role
    // app.mockSession({
    //   permission: { roleName, permissions },
    // });
    // await app.httpRequest()
    //   .get('/admin')
    //   .expect(200, 'success');
  });

  it('should GET /admin 404 when role is undefined', async function() {
    return app.httpRequest()
      .get('/admin')
      .expect(401, 'Unauthorized');
  });
});

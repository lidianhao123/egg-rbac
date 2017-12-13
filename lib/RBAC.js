'use strict';

const path = require('path');
const fs = require('fs');
const debug = require('debug')('egg-rbac');
const mongooseStorage = require('./mongoose/index');

/**
 * @class
 */
class rbac {

  /**
   * @constructs role
   * @param {object} app eggjs application object
   */
  constructor(app) {
    this.config = app.config.mongoose;

    this.mongoose = app.mongoose;

    this.storage = new mongooseStorage(this.mongoose);
    if (app.config.rbac.initOnStart) {
      app.beforeStart(() => {
        const appRbacFilePath = path.join(app.baseDir, 'config/rbac.js');
        debug('app rbac config file path %s file path exit %s ', appRbacFilePath, fs.existsSync(appRbacFilePath));
        if (fs.existsSync(appRbacFilePath)) {
          const data = require(appRbacFilePath);
          return this.initData(data.permissions, data.roles, app.config.rbac.superRole);
        }
      });
    }
  }

  /**
   * before start init permissions and roles
   * @method rbac#initData
   * @param {object[]} permissions - permission item array
   * @param {string} permissions[].name - permission name
   * @param {string} permissions[].alias - permission alias
   * @param {object[]} roles - role item array
   * @param {string} roles[].name - role name
   * @param {string} roles[].alias - role alias
   * @param {object} superRole super role info
   * @param {string} superRole.name role name
   * @param {string} superRole.alias role alias
   * @return {object} error object
   * @yields {boolean}
   */
  initData(permissions, roles, superRole) {
    if (!permissions || permissions.length === 0) {
      throw new Error('[egg-rbac] initData parameter permissions is undefined');
    }
    if (!roles || roles.length === 0) {
      throw new Error('[egg-rbac] initData parameter roles is undefined');
    }
    debug('init data permissions.length %O roles.length %O', permissions.length, roles.length);

    return this._initPermissions(permissions)
      .then(() => this._initRole(roles, superRole));
  }

  /**
   * Initialize permission
   * @method rbac#_initPermissions
   * @private
   * @param {object[]} permissions - permission item array
   * @param {string} permissions[].name - permission name
   * @param {string} permissions[].alias - permission alias
   * @return {string[]|null} null or ObjectId array
   */
  _initPermissions(permissions) {
    debug('init permission permission type is %s', typeof permissions);
    return this.getAllPermission()
      .then(oldPermission => {
        const oldPermissionObj = {};
        oldPermission.forEach(item => {
          oldPermissionObj[item.name] = item;
        });
        permissions = permissions.filter(item => {
          if (oldPermissionObj[item.name]) {
            return false;
          }
          return true;
        });
        if (permissions.length === 0) {
          return [];
        }
        return this.storage.insertManyPermission(permissions);
      });
  }

  /**
   * Initialize roles and initialize superadmin role
   * @method rbac#_initRole
   * @private
   * @param {object[]} roles - role item array
   * @param {string} roles[].name - role name
   * @param {string} roles[].alias - role alias
   * @param {object} superRole super role info
   * @param {string} superRole.name role name
   * @param {string} superRole.alias role alias
   * @return {object} promise
   */
  _initRole(roles, superRole) {
    const arr = roles.map(roleData => {
      return Promise.all([
        this.storage.getPermissions(roleData.grants).then(permissions => permissions.map(per => per._id)),
        this.storage.getRole(roleData.name),
      ]).then(([ ids, role ]) => {
        debug('init role %s ', role);
        if (role === null) {
          roleData.grants = ids;
          return this.newRole(roleData);
        }
        return this.addPermission(role._id, ids);
      });
    });
    arr.push(
      Promise.all([
        this.getAllPermission().then(allPermission => allPermission.map(per => per._id)),
        this.storage.getRole(superRole.name),
      ]).then(([ ids, admin ]) => {
        if (admin === null) {
          return this.newRole({ name: superRole.name, alias: superRole.alias, grants: ids });
        }
        return this.addPermission(admin._id, ids);
      })
    );
    debug('init role promise all array length = %s', arr.length);
    return Promise.all(arr);
  }

  /**
   * @method rbac#newRole
   * @param {object} options role info
   * @param {string} options.name - role short name
   * @param {string} options.alias - role full name such as chinese name
   * @param {string[]} options.grants - string such as mongodb ObjectId
   * @return {object} promise
   */
  newRole({ name, alias, grants }) {
    if (!name) {
      return new Error('[egg-rbac] newRole parameter name is undefined');
    }
    if (!alias) {
      return new Error('[egg-rbac] newRole parameter alias is undefined');
    }
    debug('new role name %s alias %s', name, alias);
    return this.storage.newRole({ name, alias, grants });
  }

  /**
   * @method rbac#newPermission
   * @param {object} options role info
   * @param {string} options.name - role short name
   * @param {string} options.alias - role full name such as chinese name
   * @return {object} promise
   */
  newPermission({ name, alias }) {
    if (!name) {
      return new Error('[egg-rbac] newPermission parameter name is undefined');
    }
    if (!alias) {
      return new Error('[egg-rbac] newPermission parameter alias is undefined');
    }
    debug('new permission name %s alias %s', name, alias);
    return this.storage.newPermission({ name, alias });
  }

  /**
   * @method rbac#addPermission
   * @param {string} _id - role id
   * @param {string[]} permissionIds - permission ids
   * @return {object} promise
   */
  addPermission(_id, permissionIds) {
    if (!_id) {
      return new Error('[egg-rbac] addPermission parameter _id is undefined');
    }
    if (!permissionIds || typeof permissionIds !== 'object' || permissionIds.length === 0) {
      return new Error('[egg-rbac] addPermission parameter permissionIds is undefined');
    }
    debug('new permission name %s alias %s', _id, permissionIds);
    return this.storage.addPermission(_id, permissionIds);
  }

  /**
   * @method rbac#removePermissions
   * @param {string} _id - role id
   * @param {string[]} permissionIds - permission ids
   * @return {object} promise
   */
  removePermissions(_id, permissionIds) {
    if (!_id) {
      return new Error('[egg-rbac] removePermissions parameter _id is undefined');
    }
    if (!permissionIds || typeof permissionIds !== 'object' || permissionIds.length === 0) {
      return new Error('[egg-rbac] removePermissions parameter permissionIds is undefined');
    }
    debug('new permission name %s alias %s', _id, permissionIds);
    return this.storage.removePermissions(_id, permissionIds);
  }

  /**
   * @method rbac#removeRole
   * @param {string} _id - role _id
   * @return {object} promise
   */
  removeRole(_id) {
    if (!_id) {
      return new Error('[egg-rbac] removeRole parameter _id is undefined');
    }
    return this.storage.removeRole(_id);
  }

  /**
   * @method rbac#removePermission
   * @param {string} _id - permission _id
   * @return {object} promise
   */
  removePermission(_id) {
    if (!_id) {
      return new Error('[egg-rbac] removePermission parameter _id is undefined');
    }
    return this.storage.removePermission(_id);
  }

  /**
   * @method rbac#modifyRoleAlias
   * @param {string} _id - role _id
   * @param {string} alias - new alias string
   * @return {object} promise
   */
  modifyRoleAlias(_id, alias) {
    if (!_id) {
      return new Error('[egg-rbac] modifyRoleAlias parameter _id is undefined');
    }
    if (!alias) {
      return new Error('[egg-rbac] modifyRoleAlias parameter alias is undefined');
    }
    return this.storage.modifyRoleAlias(_id, alias);
  }

  /**
   * @method rbac#modifyPermissionAlias
   * @param {string} _id - role _id
   * @param {string} alias - new alias string
   * @return {object} promise
   */
  modifyPermissionAlias(_id, alias) {
    if (!_id) {
      return new Error('[egg-rbac] modifyPermissionAlias parameter _id is undefined');
    }
    if (!alias) {
      return new Error('[egg-rbac] modifyPermissionAlias parameter alias is undefined');
    }
    return this.storage.modifyPermissionAlias(_id, alias);
  }

  /**
   * @method rbac#getRolePermission
   * @param {string} name - role name
   * @return {object} promise
   */
  getRolePermission(name) {
    if (!name || typeof name !== 'string') {
      return new Error('[egg-rbac] getRolePermission parameter name must string');
    }
    debug('get role permission role name is %s', name);
    return this.storage.getRole(name)
      .then(role => role.grants);
  }

  /**
   * @method rbac#getAllPermission
   * @return {object} promise
   */
  getAllPermission() {
    return this.storage.Permission.find({});
  }

  /**
   * @method rbac#getRole
   * @param {string} name role name
   * @return {object} promise
   */
  getRole(name) {
    if (!name || typeof name !== 'string') {
      return new Error('[egg-rbac] getRole parameter name must string');
    }
    return this.storage.getRole(name);
  }

  /**
   * @method rbac#getAllRoles
   * @return {object} promise
   */
  getAllRoles() {
    return this.storage.getAllRoles();
  }

  /**
   * @method rbac#can
   * @param {string} permissionName - permission name
   * @return {function} middleware function
   */
  can(permissionName) {
    return async function(ctx, next) {
      // this is instance of Context
      if (ctx.role && ctx.role.can && ctx.role.can(permissionName)) {
        await next();
      } else {
        // https://tools.ietf.org/html/rfc2616#page-66
        ctx.status = 401; // 'Unauthorized'
      }
    };
  }
}

let singleton = null;

module.exports = exports = function(app) {
  if (singleton === null) {
    singleton = new rbac(app);
  }
  return singleton;
};

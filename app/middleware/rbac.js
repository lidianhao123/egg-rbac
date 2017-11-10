'use strict';

const Role = require('../../lib/role');
const assert = require('assert');

// options: 中间件的配置项，框架会将 app.config[${middlewareName}] 传递进来
module.exports = options => {
  return function* rbac(next) {
    // this is instance of Context
    // TODO support session
    let permissions;
    if (!this.session.permission) {
      const roleName = yield options.getRoleName(this);
      if (roleName) {
        permissions = yield this.app.rbac.getRolePermission(roleName);
        this.role = new Role(roleName, permissions);
        this.session.permission = {
          roleName,
          permissions,
        };
      }
    } else {
      this.role = new Role(this.session.permission.roleName, this.session.permission.permissions);
    }

    yield next;
  };
};

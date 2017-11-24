'use strict';

const Role = require('../../lib/role');

// options: 中间件的配置项，框架会将 app.config[${middlewareName}] 传递进来
module.exports = options => {
  return function* rbac(next) {
    const roleName = yield options.getRoleName(this);
    if (roleName) {
      const permissions = yield this.app.rbac.getRolePermission(roleName);
      this.role = new Role(roleName, permissions);
    }

    yield next;
  };
};

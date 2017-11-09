'use strict';

const Role = require('../../lib/role');
const assert = require('assert');

// options: 中间件的配置项，框架会将 app.config[${middlewareName}] 传递进来
module.exports = options => {
  return function* rbac(next) {
    // this is instance of Context
    if (options.getRoleName) {
      const roleName = yield options.getRoleName(this);
      if (roleName) {
        this.role = new Role(this.app.rbac, roleName);
        yield this.role.init();
      }
    } else {
      assert(false, '[egg-plugin] when use rbac plugin must difine options.getRoleName function');
    }

    yield next;
  };
};

'use strict';

const Role = require('../../lib/role');
const assert = require('assert');

// options: 中间件的配置项，框架会将 app.config[${middlewareName}] 传递进来
module.exports = options => {
  return function* rbac(next) {
    // this is instance of Context
    if (options.getRoleName) {
      yield options.getRoleName(this)
        .then(roleName => {
          if (roleName) {
            this.role = new Role(this.app.rbac, roleName);
          }
        });
    } else {
      assert(false, '[egg-plugin] when use rbac plugin must difine options.getRoleName function');
    }

    yield next;
  };
};

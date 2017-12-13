'use strict';

const Role = require('../../lib/role');

// options: 中间件的配置项，框架会将 app.config[${middlewareName}] 传递进来
module.exports = options => {
  return async function rbac(ctx, next) {
    const roleName = await options.getRoleName(ctx);
    if (roleName) {
      const permissions = await ctx.app.rbac.getRolePermission(roleName);
      ctx.role = new Role(roleName, permissions);
    }

    await next();
  };
};

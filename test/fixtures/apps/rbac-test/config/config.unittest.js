'use strict';

exports.keys = '123456';

// database config
exports.mongoose = {
  url: 'mongodb://127.0.0.1/testrbac',
  options: {},
};

exports.rbac = {
  initOnStart: true, // default false
  /**
   * @param {object} ctx - egg context object
   * @return {object} promise, if resolve data is falsy, no role
   */
  async getRoleName(ctx) {
    if (ctx.query.role) {
      return Promise.resolve(ctx.query.role);
    }
    return Promise.resolve('');
  },
};

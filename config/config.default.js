'use strict';

/**
 * egg-rbac default config
 * @member Config#rbac
 * @property {String} SOME_KEY - some description
 */
exports.rbac = {
  initOnStart: true, // default false
  /**
   * @param {object} ctx - egg context object
   * @return {object} promise, if resolve data is falsy, no role
   */
  * getRoleName(ctx) {
    return Promise.resolve('');
  },
};

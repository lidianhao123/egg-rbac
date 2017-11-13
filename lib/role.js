'use strict';

const assert = require('assert');
/**
 * @class Role
 */
module.exports = exports = class Role {

  /**
   * @constructs Role
   * @param {string} roleName - role name
   * @param {object} permissionItems - singleton rbac object
   */
  constructor(roleName, permissionItems) {
    /**
     * @property {object} _permisstion
     * @private
     * @example
     * {
     *   'create_user': {
     *     _id: '12387389173248'
     *     name: 'create_user'
     *     alias: '创建用户'
     *   }
     * }
     */
    assert(permissionItems, 'Role constructor parameter permissionItems is undefined');
    this._permissions = Role._createPermisstion(permissionItems);

    assert(roleName && typeof roleName === 'string', 'Role constructor parameter roleName is undefined');
    this._name = roleName;
  }

  /**
   * @static
   * @param {object[]} permissionItems - permission item array
   * @param {string} permissionItems[]._id - ObjectId
   * @param {string} permissionItems[].name - permission name
   * @param {string} permissionItems[].alias - permission alias
   * @return {object} - structure same to this._permission
   */
  static _createPermisstion(permissionItems) {
    const result = {};
    permissionItems.forEach(item => {
      result[item.name] = item;
    });
    return result;
  }

  /**
   * @member {string}
   */
  get roleName() {
    return this._name;
  }

  /**
   * @method Role#can
   * @param {string} permissionName - permisston name
   * @return {boolen} can or not
   */
  can(permissionName) {
    return !!this._permissions[permissionName];
  }

  /**
   * check the role grant all permission or not
   * @method Role#canAll
   * @param {string} permissionNames - permisston name
   * @return {boolen} can or not
   */
  canAll(permissionNames) {
    return permissionNames.every(item => !!this._permissions[item]);
  }
};

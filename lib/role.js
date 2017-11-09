'use strict';

const assert = require('assert');

module.exports = exports = class Role {

  /**
   *
   * @param {object} _rbac - singleton rbac object
   * @param {string} roleName - role name
   */
  constructor(_rbac, roleName) {
    /**
     * @property {object} _permisstion
     * @private
     * @example
     * {
     *   create_user: {
     *     _id: '12387389173248'
     *     name: '创建用户'
     *   }
     * }
     */
    this._permissions = {};

    this._name = roleName;

    this._rbac = _rbac;
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
    permissionItems.map(item => {
      result[item.name] = item;
    });
    return result;
  }

  /**
   * init role, find all permisstion for the role
   * @return {object} promise
   */
  init() {
    return this._rbac.getRolePermission(this._name)
      .then(permissionItems => {
        this._permissions = Role._createPermisstion(permissionItems);
        return this;
      });
  }

  /**
   *
   * @param {string} permissionName - permisston name
   * @return {boolen} can or not
   */
  can(permissionName) {
    return !!this._permissions[permissionName];
  }

  /**
   * check the role grant all permission or not
   * @param {string} permissionNames - permisston name
   * @return {boolen} can or not
   */
  canAll(permissionNames) {
    return permissionNames.every(item => !!this._permissions[item]);
  }

};

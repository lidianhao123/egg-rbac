'use strict';

const role = require('./model/role');
const permission = require('./model/permission');
const debug = require('debug')('egg-rbac');

module.exports = exports = class mongooseStorage {

  constructor(_mongoose) {
    this._mongoose = _mongoose;
    this.Role = role(_mongoose);
    this.Permission = permission(_mongoose);
  }

  newRole({ name, alias, grants }) {
    return this.Role.findOne({ name })
      .then(oldRole => {
        if (oldRole === null) {
          const newRole = new this.Role();
          newRole.name = name;
          newRole.alias = alias;
          newRole.grants = grants;
          return newRole.save();
        }
        return null;
      });
  }

  addPermission(_id, permissionIds) {
    return this.Role.updateOne({ _id }, { $addToSet: { grants: { $each: permissionIds } } });
  }

  newPermission({ name, alias }) {
    return this.Permission.findOne({ name })
      .then(oldPermission => {
        if (oldPermission === null) {
          const newPermission = new this.Permission();
          newPermission.name = name;
          newPermission.alias = alias;
          return newPermission.save();
        }
        return null;
      });
  }

  insertManyPermission(permissions) {
    return this.Permission.insertMany(permissions)
      .then(result => {
        return result.insertedIds;
      });
  }

  getRole(name) {
    return this.Role.findOne({ name }).populate('grants');
  }

  getAllRoles() {
    return this.Role.find({});
  }

  getPermissions(names) {
    debug('getPermissions names = %O', names);
    return this.Permission.find({ name: { $in: names } });
  }

  getAllPermissions() {
    return this.Permission.find({});
  }

};

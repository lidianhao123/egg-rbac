'use strict';

const assert = require('assert');
const mongooseStorage = require('./mongoose/index');

class rbac {

  constructor(app) {
    this.config = app.config.mongoose;

    this.mongoose = app.mongoose;

    this.storage = new mongooseStorage(this.mongoose);
  }

  addRole({ name, alias, grants }) {
    return this.storage.addRole({ name, alias, grants });
  }

  addPermission({ name, alias }) {
    return this.storage.addPermission({ name, alias });
  }

  getRolePermission(name) {
    return this.storage.getRole(name)
      .then(role => role.grants);
  }

  getAllPermission() {
    return this.storage.Permission.find({});
  }

  getAllRoles() {
    return this.storage.getAllRoles();
  }
}

let singleton = null;

module.exports = exports = function(app) {
  if (singleton === null) {
    singleton = new rbac(app);
  }
  return singleton;
};

'use strict';

const assert = require('assert');

module.exports = app => {
  // console.log('app.config.env =', app.config.env);
  const mongoose = app.mongoose;
  assert(mongoose, 'mongoose instance not exists');
  app.rbac = require('./lib/RBAC')(app);
};

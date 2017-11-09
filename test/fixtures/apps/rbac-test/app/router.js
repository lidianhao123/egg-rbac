'use strict';

module.exports = app => {
  app.get('/admin', app.rbac.can('query_user'), 'admin.index');
};

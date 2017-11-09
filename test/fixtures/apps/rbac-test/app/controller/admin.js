'use strict';

module.exports = app => {
  class AdminController extends app.Controller {
    * index() {
      this.ctx.body = 'success';
    }
  }
  return AdminController;
};

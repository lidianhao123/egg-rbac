'use strict';
const Controller = require('egg').Controller;
class AdminController extends Controller {
  async index() {
    this.ctx.body = 'success';
  }
}
module.exports = AdminController;

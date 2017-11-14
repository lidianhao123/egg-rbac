'use strict';

exports.permissions = [
  // action_resource
  { name: 'create_user', alias: '创建用户' },
  { name: 'delete_user', alias: '删除用户' },
  { name: 'query_user', alias: '查询用户' },
  { name: 'edit_user', alias: '修改用户' },

  { name: 'create_article', alias: '创建文章' },
  { name: 'delete_article', alias: '删除文章' },
  { name: 'query_article', alias: '查询文章' },
  { name: 'edit_article', alias: '修改文章' },
];

exports.roles = [
  { name: 'admin', alias: '管理员', grants: exports.permissions.map(item => item.name) },
  { name: 'editer', alias: '编辑', grants: [ 'create_article', 'delete_article', 'create_article', 'edit_article' ] },
];

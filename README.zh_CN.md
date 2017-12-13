# egg-rbac

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-rbac.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-rbac
[travis-image]: https://img.shields.io/travis/lidianhao123/egg-rbac.svg?style=flat-square
[travis-url]: https://travis-ci.org/lidianhao123/egg-rbac
[codecov-image]: https://img.shields.io/codecov/c/github/lidianhao123/egg-rbac.svg?style=flat-square
[codecov-url]: https://codecov.io/github/lidianhao123/egg-rbac?branch=master
[david-image]: https://img.shields.io/david/lidianhao123/egg-rbac.svg?style=flat-square
[david-url]: https://david-dm.org/lidianhao123/egg-rbac
[snyk-image]: https://snyk.io/test/npm/egg-rbac/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-rbac
[download-image]: https://img.shields.io/npm/dm/egg-rbac.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-rbac

<!--
Description here.
-->

## [English](./README.md)

## 安装

```bash
$ npm i egg-rbac --save
```

## 依赖的 egg 版本

egg-rbac 版本 | egg 版本
--- | ---
0.3.0 | 1.x
0.4.0 | 2.0.0

从 0.4.0 版本开始 egg-rbac 不在支持 egg 1.x 版本

## 依赖的插件
<!--

如果有依赖其它插件，请在这里特别说明。如

- security
- multipart

-->

- [egg-mongoose](https://github.com/eggjs/egg-mongoose)

## 开启插件

```js
// config/plugin.js
exports.rbac = {
  enable: true,
  package: 'egg-rbac',
};
```

## 详细配置

配置获取角色名称
```js
// {app_root}/config/config.default.js
exports.rbac = {
  /**
   * @param {object} ctx - egg context object
   * @return {object} promise, if resolve data is falsy, no role
   */
  * getRoleName(ctx) {
    return Promise.resolve('');
  },
};
```

配置系统初始化权限和角色
```js
// {app_root/config/rbac.js}
'use strict';

exports.permissions = [
  // action_resource
  // { name: 'create_user', alias: '创建用户' },
  // { name: 'delete_user', alias: '删除用户' },
  // { name: 'query_user', alias: '查询用户' },
  // { name: 'edit_user', alias: '修改用户' },
];

exports.roles = [
  // { name: 'admin', alias: '管理员', grants: exports.permissions.map(item => item.name) },
];
```

请到 [config/config.unittest.js](./test/fixtures/apps/rbac-test/config/config.unittest.js) 查看详细配置项说明。

## 例子

1. 请参考测试示例 [rbac-test](./test/fixtures/apps/rbac-test/)
2. 实际使用例子 [egg-rbac-example](https://github.com/lidianhao123/egg-rbac-example)

## 说明

- 系统自动创建一个 superadmin 角色具备所有权限。

## License

[MIT](LICENSE)

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
## [中文说明](./README.zh_CN.md)

## Install

```bash
$ npm i egg-rbac --save
```

## depend on egg version

egg-rbac version | egg version
--- | ---
0.3.0 | 1.x
0.4.0 | 2.0.0

From 0.4.0 version egg-rbac does not support egg 1.x.

## depend on egg plugin

- [egg-mongoose](https://github.com/eggjs/egg-mongoose)

## Usage

```js
// {app_root}/config/plugin.js
exports.rbac = {
  enable: true,
  package: 'egg-rbac',
};
```

## Configuration

config getRoleName
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

Initialize roles and permissions
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

see [config/config.unittest.js](./test/fixtures/apps/rbac-test/config/config.unittest.js) for more detail.

## Example

1. see [rbac-test](./test/fixtures/apps/rbac-test/)
2. practical example [egg-rbac-example](https://github.com/lidianhao123/egg-rbac-example)

## Remarks

- It will create a superadmin role which own all permissions.

## License

[MIT](LICENSE)

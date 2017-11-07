# Under development
# egg-rbac

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-rbac.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-rbac
[travis-image]: https://img.shields.io/travis/eggjs/egg-rbac.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-rbac
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-rbac.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-rbac?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-rbac.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-rbac
[snyk-image]: https://snyk.io/test/npm/egg-rbac/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-rbac
[download-image]: https://img.shields.io/npm/dm/egg-rbac.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-rbac

<!--
Description here.
-->

## Install

```bash
$ npm i egg-rbac --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.rbac = {
  enable: true,
  package: 'egg-rbac',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.rbac = {
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)

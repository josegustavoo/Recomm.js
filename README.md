# Recomm.js

[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.png?v=103)](https://github.com/ellerbrock/open-source-badges/)
<img alt="GitHub Issues" src="https://img.shields.io/github/issues/josegustavoo/recomm.js" />
<img alt="GitHub Pull Requests" src="https://img.shields.io/github/issues-pr/josegustavoo/recomm.js" />
<img alt="GitHub Last Commit" src="https://img.shields.io/github/last-commit/josegustavoo/recomm.js" />
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)
[![Visits Badge](https://badges.pufler.dev/visits/josegustavoo/recomm.js)](https://badges.pufler.dev)

**Recomm.js** is a javascript library used to build recommendation systems, using [Content-Based Filtering System](https://developers.google.com/machine-learning/recommendation/content-based/basics).

## Install

With npm
```sh
npm i recomm.js
```

With yarn
```sh
yarn add recomm.js
```

## Usage

1. Import Recomm.js to your project

```js
const { Recommender } = require('recomm.js');
```

2. Configurate recomm.js

```js
const recom = new Recommender({
    database: 'mongodb',
    connection: {
        uri: "<URL OF MONGODB>"
    },
    table: '<POSTS TABLE NAME>'
});
```

3. Start recomm.js

```js
( async () => {
    await recom.sync();
})();
```

## Options

| Name | type | Description |
| --- | --- | --- |
| `database` | string | Name of database, list databases: `mongodb` |
| `connection` | object | Database settings, options list: `uri` |
| `cache` | number | Cache time |
| `table` | string | Posts table name |
| `fields` | array | Important fields of post, to use value from within an array, use `.` as a delimiter |
| `returnOptions` | object | Options of return, options list: `fields`, `limit` |

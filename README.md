# Recomm.js

!["GitHub Issues](https://img.shields.io/github/issues/josegustavoo/recomm.js)
!["GitHub Pull Requests](https://img.shields.io/github/issues-pr/josegustavoo/recomm.js)
![GitHub Last Commit](https://img.shields.io/github/last-commit/josegustavoo/recomm.js)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)
[![Visits Badge](https://badges.pufler.dev/visits/josegustavoo/recomm.js)](https://badges.pufler.dev)

**Recomm.js** is a javascript library used to build recommendation systems, using **[Content-Based Filtering System](https://developers.google.com/machine-learning/recommendation/content-based/basics)**.

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

1. Import

   ES6

   ```js
   import { getSimilarPosts, SupportedLanguage } from "recomm.js";
   ```

   CommonJS

   ```js
   const { getSimilarPosts, SupportedLanguage } = require("recomm.js");
   ```

2. Get items
   ```js
   const results = getSimilarPosts(target, options);
   ```

## Options

| **Name**                | **Type**                            | **Description**                                                   |
| ----------------------- | ----------------------------------- | ----------------------------------------------------------------- |
| items                   | Array of objects                    | Array of items                                                    |
| fields                  | Array of string                     | Array of fields                                                   |
| language                | SupportedLanguage                   | Language of items                                                 |
| limit (optional)        | Number (default: 10)                | Items limit returned                                              |
| orderBy (optional)      | "DESC" \|\| "ASC" (default: "DESC") | Order of returned items                                           |
| returnFields (optional) | Array of string (default: [])       | List of fields to be returned. By default, it returns all fields. |

## Supported Languages

- Arabic
- Danish
- Dutch
- English
- Finnish
- French
- German
- Greek
- Hungarian
- Italian
- Portuguese
- Romanian
- Russian
- Spanish
- Swedish
- Turkish

## Examples

```js
const data = [
  {
    name: "Jenkins Cook",
    gender: "male",
    about: "Commodo Lorem ipsum dolore aute cupidatat.",
    tags: ["ex", "labore"],
    friends: [
      {
        id: 0,
        name: "Marilyn Wyatt",
      },
      {
        id: 1,
        name: "Juana Jennings",
      },
    ],
  },
  {
    name: "Elinor Rosales",
    gender: "female",
    about:
      "Do ipsum fugiat excepteur anim sit pariatur sunt ea proident dolore id dolore consectetur. Fugiat amet tempor laborum esse sint tempor enim consectetur laborum fugiat pariatur commodo culpa sunt.",
    tags: ["cupidatat"],
    friends: [
      {
        id: 0,
        name: "Molina Mckenzie",
      },
    ],
  },
  {
    name: "Obrien Walter",
    about: "In reprehenderit enim mollit proident aute anim ea.",
    tags: ["proident", "proident", "voluptate"],
    friends: [
      {
        id: 0,
        name: "Francis Wilkerson",
      },
      {
        id: 1,
        name: "Sanders Adams",
      },
    ],
  },
];

const target = {
  name: "Stacey Dixon",
  about:
    "Incididunt minim ea ad anim. Nisi voluptate ut occaecat laborum sint ullamco mollit aliquip ea exercitation.",
  tags: ["exercitation", "qui"],
  friends: [
    {
      id: 0,
      name: "Mable Pollard",
    },
    {
      id: 1,
      name: "Alisha Wagner",
    },
  ],
};
const options = {
  fields: ["name", "about", "tags.+", "friends.+.name"],
  items: data,
  language: SupportedLanguage.ENGLISH,
  returnFields: ["score"],
};

const results = getSimilarPosts(target, options);

console.log(results);
```

## Notes

The field "fields" uses the library [nested-property](https://www.npmjs.com/package/nested-property), for get items inside objects

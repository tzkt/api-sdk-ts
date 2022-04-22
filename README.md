# TzKt API SDK written in Typescript

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

A collection of packages simplifying working with TzKT APIs.

Please note, this is a monorepository. Documentation for packages provided by it may be found in readme files in respective project folders.

## Install

Installing any package from this repository for use in you project is as simple as running

```bash
npm i @tzkt/<package_name>
```

| Name                | Description                      | NPM                                                            |
| ------------------- | -------------------------------- | -------------------------------------------------------------- |
| [@tzkt/sdk-api](https://github.com/tzkt/api-sdk-ts/tree/main/packages/sdk-api)     | Wrappers for TzKT API endpoints written in TS |  |

## Contributing and publishing

This repository and packages inside of it are managed by Lerna. The preferred package manager is npm. That said - you will need at least `node > 14` and `npm > 6` to proceed.

### Development and update

Documentation on development and updating of packages may be found in the respective folders. Below are some bootstrapping commands that you first need to run in the root of this repository.

Install dependencies (this will install Lerna and any shared dependencies).

```bash
npm install
```

Bootstrap it all together - installs local dependencies and ties it all up. Under the hood it uses `lerna bootstrap` with strict hoisting flags passed to it.

```bash
npm run bootstrap
```

### Build and publish

After you're done with making your changes, you will need to build packages in this repo and then publish.

```bash
npx lerna run build
npx lerna publish
```

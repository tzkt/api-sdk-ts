# TzKt API SDK written in Typescript

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

Not written, but rather generated using [@tzkt/oazapfts](https://github.com/tzkt/oazapfts).

## Install

```bash
npm i @tzkt/sdk-api
```

## Use

```ts
import { operationsGetDoubleBaking } from '@tzkt/sdk-api'

await operationsGetDoubleBaking(
  {
    quote: 'Btc',
    accuser: {
      in: ['tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN']
    }
  },
  {
    baseUrl: 'https://api.tzkt.io'
  }
)
```

## With node.js or a custom fetch library

Please refer to the [documentation](https://github.com/cellular/oazapfts#overriding-the-defaults) of the original codegen library.

## Update & publish

- Get the latest swagger file
- Use it to re-generate APIs
- Fix linting and prettify
- Build

```bash
npm run sync-swagger
npm run generate
npm run fix
npm run build
```

To update package version use

```bash
npm run version
```

# TzKt API SDK written in Typescript

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

This package is managed by Lerna. All publishing and dep management should be done using it. Only regeneration of APIs is kept local (for now).

### Inside this package

- Get the latest swagger file
- Use it to re-generate APIs
- Fix linting and prettify

```bash
npm run sync-swagger
npm run generate
npm run fix
```

### From the root of this repo

- Build this package (and other packages in this monorepo)
- Publish this package (and other packages in this monorepo)

```bash
npx lerna build
npx lerna publish
```

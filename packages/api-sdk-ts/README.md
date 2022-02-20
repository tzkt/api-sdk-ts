# TzKt API SDK written in Typescript

Not written, but rather generated using [@tzkt/oazapfts](https://github.com/tzkt/oazapfts).

## Install

```bash
npm i @tzkt/api-sdk-ts
```

## Use

```ts
import { operationsGetDoubleBaking } from '@tzkt/api-sdk-ts'

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

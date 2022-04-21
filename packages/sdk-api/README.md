# TzKt API SDK written in Typescript

Not written, but rather generated using [@tzkt/oazapfts](https://github.com/tzkt/oazapfts).

## Install

```bash
npm i @tzkt/sdk-api
```

## Use

### Simplest request

Simplest example of getting double baking operations, accused of being such by a certain address.

```ts
import { operationsGetDoubleBaking } from '@tzkt/sdk-api'

await operationsGetDoubleBaking(
  {
    quote: 'Btc',
    accuser: {
      in: ['tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN']
    }
  }
)
```

### Overriding base API URL

You may override base URL used by the package in the following manner. This may come useful should you want to make requests to a test network or to your custom server.

```ts
import * as api from "@tzkt/sdk-api";

api.defaults.baseUrl = "https://api.ithacanet.tzkt.io/";
```

In case you need to override request headers, this is also possible.

```ts
import * as api from "@tzkt/sdk-api";

api.defaults.headers = {
  access_token: "secret",
};
```

Please refer to the [original documentation](https://github.com/cellular/oazapfts#overriding-the-defaults) for more details on how to configure defaults.

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

### Building and publishing

You may build this package for local testing with simple `npm run build`. For publishing and deploying to production all builds should be done via Lerna.

After you've committed your changes and ready to publish, please follow [Build and publish](/README.md#build-and-publish) instructions in the root of this repository.

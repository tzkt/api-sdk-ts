# TzKT taquito extension
Extension that will reduce the load on the main node and speed up interaction with data

## Install

```bash
npm i @tzkt/ext-taquito
```

## Use

### Basic config

Simplest example of integrating and using an extension with basic settings.

```js
import { TezosToolkit } from '@taquito/taquito';
import { TzktExtension } from '@tzkt/ext-taquito';

const Tezos = new TezosToolkit('https://rpc.tzkt.io/mainnet');
Tezos.addExtension(new TzktExtension());

const balance = await Tezos.tz.getBalance('tz1WMrppYADANWkNus4vs8xqKztacLETnKmT')
```

### Change api endpoint

You may override base URL used by the package in the following manner. This may come useful should you want to make requests to a test network or to your custom server.

```js 
Tezos.addExtension(new TzktExtension({url: 'https://api.tzkt.io'}));
```

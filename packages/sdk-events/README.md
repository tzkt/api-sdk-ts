# TzKT Events SDK

Fully typed client for working with TzKT subscriptions API.  
A thin wrapper on top of SignalR converting subscriptions to observables.

## Install

```bash
npm i @tzkt/sdk-events
```

## Use

Create an instance of events service specifying TzKT events endpoint.
```js
import { EventsService } from "@tzkt/sdk-events";

const events = new EventsService({ url: "https://api.tzkt.io/v1/events", reconnect: true });
```

Connection is not initiated until the first request (lazy connection):
```js
const sub = events.operations({ types: [ 'origination' ] })
    .subscribe({ next: console.log });
```

Events service implements subscription router internally (on TzKT your subscriptions are aggregated) hence you can always "unsubscribe" from new updates (however it does not change anything on the TzKT side, just stops firing your observer):
```js
sub.unsubscribe();
```

By default events service will infinitely try to reconnect in case of drop, you can monitor current state by subscribing to status updates:
```js
events.status()
    .subscribe({ next: console.log });
```

In case you need to terminate the connection you can do that (note that event service will start again in case you send a subscription request afterwards):
```js
await events.stop();
```

## Examples

Check out the [demo app](https://github.com/tzkt/api-sdk-ts/tree/main/examples/sdk-events-example).
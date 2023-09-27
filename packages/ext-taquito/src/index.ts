import { Context, Extension } from '@taquito/taquito';
import * as api from '@tzkt/sdk-api';

import { TzktReadProvider } from './tzktReadProvider';

class TzktExtension implements Extension {
  constructor({ url }: { url?: string } = {}) {
    if (url) {
      api.defaults.baseUrl = url;
      api.servers.server1 = url;
    }
  }

  configureContext(context: Context): void {
    const readProvider = new TzktReadProvider(context.readProvider);
    Object.assign(context, { readProvider });
  }
}

export { TzktExtension };

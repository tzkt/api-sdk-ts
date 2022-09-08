import {Context, Extension} from "@taquito/taquito";

import {TzktReadProvider} from './tzktReadProvider';


class TzktExtension implements Extension {
  configureContext(context: Context): void {
    const readProvider = new TzktReadProvider(context.readProvider);
    Object.assign(context, {readProvider});
  }
}

export {TzktExtension}

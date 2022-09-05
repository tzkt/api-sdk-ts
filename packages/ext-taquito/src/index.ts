import {Context, Extension} from "@taquito/taquito";

import {ApiRequests} from "./apiRequests";
import {ReadProviderWrapper} from './readProviderWrapper';


class TzktExtension extends ApiRequests implements Extension {
  configureContext(context: Context): void {
    const readProvider = new ReadProviderWrapper(context.readProvider, this);

    Object.assign(context, {readProvider});
  }
}

export {TzktExtension}

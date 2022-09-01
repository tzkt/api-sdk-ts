import {Context, Extension} from "@taquito/taquito";

import {ApiRequests} from "./apiRequests";
import { ReadProviderWrapper } from './readProviderWrapper';


class TzktExtension extends ApiRequests implements Extension{
  constructor(apiUrl: string) {
    super(apiUrl)
  }

  configureContext(context: Context): void {
    context.registerProviderDecorator((context: Context) => {
      context.readProvider = new ReadProviderWrapper(context.readProvider, this);
      return context;
    })
  }
}

export {TzktExtension}

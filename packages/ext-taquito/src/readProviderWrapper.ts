import {
  BlockResponse,
  EntrypointsResponse,
  MichelsonV1Expression,
  SaplingDiffResponse, ScriptedContracts,
} from '@taquito/rpc';
import {
  BigMapQuery,
  BlockIdentifier,
  SaplingStateQuery,
  TzReadProvider
} from '@taquito/taquito';
import {BigNumber} from 'bignumber.js';

import {TzktExtension} from './index';


export class ReadProviderWrapper implements TzReadProvider {
  constructor(private readProvider: TzReadProvider, private tzktExtension: TzktExtension) {}

  async getEntrypoints(contract: string): Promise<EntrypointsResponse> {
    const apiResponse = this.tzktExtension.getEntrypoints(contract);

    if (apiResponse) {
      return apiResponse;
    }

    return this.readProvider.getEntrypoints(contract);
  }

  async getScript(address: string, block: BlockIdentifier): Promise<ScriptedContracts> {
    const apiResponse = this.tzktExtension.getScript(address);

    if (apiResponse) {
      return apiResponse;
    }

    return this.readProvider.getScript(address, block);
  }

  getBalance(address: string, block: BlockIdentifier): Promise<BigNumber> {
    const apiResponse = this.tzktExtension.getBalance(address);

    if (apiResponse) {
      return apiResponse;
    }

    return this.readProvider.getBalance(address, block);
  }

  getDelegate(address: string, block: BlockIdentifier): Promise<string | null> {
    const apiResponse = this.tzktExtension.getDelegate(address);
    if (apiResponse) {
      return apiResponse;
    }

    return this.readProvider.getDelegate(address, block);
  }

  getNextProtocol(block: BlockIdentifier): Promise<string> {
    const apiResponse = this.tzktExtension.getNextProtocol();
    if (apiResponse) {
      return apiResponse;
    }

    return this.readProvider.getNextProtocol(block);
  }

  getProtocolConstants(block: BlockIdentifier): Promise<{
    time_between_blocks?: BigNumber[] | undefined;
    minimal_block_delay?: BigNumber | undefined;
    hard_gas_limit_per_operation: BigNumber;
    hard_gas_limit_per_block: BigNumber;
    hard_storage_limit_per_operation: BigNumber;
    cost_per_byte: BigNumber;
  }> {

    const apiResponse = this.tzktExtension.getProtocolConstants();

    if (apiResponse) {
      return apiResponse;
    }

    return this.readProvider.getProtocolConstants(block);
  }

  getStorage(contract: string, block: BlockIdentifier): Promise<MichelsonV1Expression> {
    const apiResponse = this.tzktExtension.getStorage(contract);

    if (apiResponse) {
      return apiResponse;
    }

    return this.readProvider.getStorage(contract, block);
  }

  getBlockHash(block: BlockIdentifier): Promise<string> {
    const apiResponse = this.tzktExtension.getBlockHash(block);

    if (apiResponse) {
      return apiResponse;
    }

    return this.readProvider.getBlockHash(block);
  }

  getBlockLevel(block: BlockIdentifier): Promise<number> {
    const apiResponse = this.tzktExtension.getBlockLevel(block);

    if (apiResponse) {
      return apiResponse;
    }

    return this.readProvider.getBlockLevel(block);
  }

  getCounter(pkh: string, block: BlockIdentifier): Promise<string> {
    const apiResponse = this.tzktExtension.getCounter(pkh);

    if (apiResponse) {
      return apiResponse;
    }

    return this.readProvider.getCounter(pkh, block);
  }

  getBlockTimestamp(block: BlockIdentifier): Promise<string> {
    const apiResponse = this.tzktExtension.getBlockTimestamp(block);

    if (apiResponse) {
      return apiResponse;
    }

    return this.readProvider.getBlockTimestamp(block);
  }

  getBigMapValue(bigMapQuery: BigMapQuery, block: BlockIdentifier): Promise<MichelsonV1Expression> {
    const apiResponse = this.tzktExtension.getBigMapValue(bigMapQuery);

    if (apiResponse) {
      return apiResponse;
    }

    return this.readProvider.getBigMapValue(bigMapQuery, block);
  }

  getSaplingDiffById(
    saplingStateQuery: SaplingStateQuery,
    block: BlockIdentifier
  ): Promise<SaplingDiffResponse> {
    return this.readProvider.getSaplingDiffById(saplingStateQuery, block);
  }

  getChainId(): Promise<string> {
    const apiResponse = this.tzktExtension.getChainId();

    if (apiResponse) {
      return apiResponse;
    }

    return this.readProvider.getChainId();
  }

  isAccountRevealed(publicKeyHash: string, block: BlockIdentifier): Promise<boolean> {
    const apiResponse = this.tzktExtension.isAccountRevealed(publicKeyHash);

    if (apiResponse !== null) {
      return apiResponse;
    }

    return this.readProvider.isAccountRevealed(publicKeyHash, block);
  }

  getBlock(block: BlockIdentifier): Promise<BlockResponse> {
    return this.readProvider.getBlock(block);
  }

  getLiveBlocks(block: BlockIdentifier): Promise<string[]> {
    const apiResponse = this.tzktExtension.getLiveBlocks(block);

    if (apiResponse) {
      return apiResponse;
    }

    return this.readProvider.getLiveBlocks(block);
  }
}

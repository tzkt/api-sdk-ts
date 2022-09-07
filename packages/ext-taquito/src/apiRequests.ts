import 'cross-fetch/polyfill';
import {
  EntrypointsResponse,
  MichelsonV1Expression,
  ScriptedContracts,
} from '@taquito/rpc';
import {
  BigMapQuery,
  BlockIdentifier,
} from '@taquito/taquito';
import {
  accountsGetBalance,
  accountsGetByAddress, accountsGetCounter, bigMapsGetKey, blocksGet,
  blocksGetByHash,
  blocksGetByLevel,
  contractsGetEntrypoints,
  contractsGetStorage,
  contractsGetStorageSchema, headGet,
  protocolsGetCurrent
} from "@tzkt/sdk-api";
import {BigNumber} from "bignumber.js";


class ApiRequests {
  async getBalance(address: string): Promise<BigNumber> {
    const {data} = await accountsGetBalance(address);
    return new BigNumber(data);
  }

  async getDelegate(address: string): Promise<string | null> {
    const {data} = await accountsGetByAddress(address);
    // @ts-ignore
    return data?.delegate?.address
  }

  async getNextProtocol(): Promise<string> {
    const {data} = await protocolsGetCurrent()
    return data?.hash || ''
  }

  async getProtocolConstants(): Promise<{
    time_between_blocks?: BigNumber[] | undefined;
    minimal_block_delay?: BigNumber | undefined;
    hard_gas_limit_per_operation: BigNumber;
    hard_gas_limit_per_block: BigNumber;
    hard_storage_limit_per_operation: BigNumber;
    cost_per_byte: BigNumber;
  }> {
    const {data} = await protocolsGetCurrent()

    return {
      time_between_blocks: [new BigNumber(data?.constants?.timeBetweenBlocks || 0)] || undefined,
      minimal_block_delay: new BigNumber(0),
      hard_gas_limit_per_operation: new BigNumber(data?.constants?.hardOperationGasLimit || 0),
      hard_gas_limit_per_block: new BigNumber(data?.constants?.hardBlockGasLimit || 0),
      hard_storage_limit_per_operation: new BigNumber(data?.constants?.hardOperationStorageLimit || 0),
      cost_per_byte: new BigNumber(data?.constants?.byteCost || 0),
    }
  }

  async getStorage(contract: string): Promise<MichelsonV1Expression> {
    const {data} = await contractsGetStorage(contract)
    // @ts-ignore
    return data;
  }


  async getScript(address: string): Promise<ScriptedContracts> {
    const {data} = await contractsGetStorageSchema(address);

    // @ts-ignore
    return data;
  }

  async getEntrypoints(contract: string): Promise<EntrypointsResponse> {
    const {data} = await contractsGetEntrypoints(contract);

    // @ts-ignore
    return data;
  }

  async getBlockHash(block: BlockIdentifier): Promise<string> {
    if (typeof block !== 'number') {
      return ''
    }

    const {data} = await blocksGetByLevel(block);

    return data?.hash || ''
  }

  async getBlockLevel(block: BlockIdentifier): Promise<number> {
    if (typeof block !== 'string') {
      return 0
    }

    const {data} = await blocksGetByHash(block);
    return data?.level || 0
  }

  async getCounter(pkh: string): Promise<string> {
    const {data} = await accountsGetCounter(pkh)
    return String(data)
  }

  async getBlockTimestamp(block: BlockIdentifier): Promise<string> {
    if (typeof block === 'string') {
      const {data} = await blocksGetByHash(block);
      return data?.timestamp || ''
    }

    if (typeof block === 'number') {
      const {data} = await blocksGetByLevel(block);
      return data?.timestamp || ''
    }

    return ''
  }

  async getBigMapValue(bigMapQuery: BigMapQuery): Promise<MichelsonV1Expression> {
    const {data} = await bigMapsGetKey(Number(bigMapQuery.id), bigMapQuery.expr, {micheline: 'Raw'});
    return data.value;
  }

  async getChainId(): Promise<string> {
    const {data} = await headGet();

    return data?.chainId || ''
  }

  async isAccountRevealed(publicKeyHash: string): Promise<boolean> {
    const {data} = await accountsGetByAddress(publicKeyHash)
    // @ts-ignore
    return data?.revealed || null;
  }

  async getLiveBlocks(block: BlockIdentifier): Promise<string[]> {
    const {data} = await blocksGet({
      level: {
        le: Number(block),
      },
      sort: {
        desc: 'level',
      },
      limit: 120, select: {fields: ['hash']}
    })
    // @ts-ignore
    return data
  }
}

export {ApiRequests}

import 'cross-fetch/polyfill';
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
import {
  accountsGetBalance,
  accountsGetByAddress,
  accountsGetCounter, bigMapsGetKey, Block, blocksGet,
  blocksGetByHash,
  blocksGetByLevel,
  contractsGetEntrypoints,
  contractsGetStorage,
  contractsGetStorageSchema, headGet,
  protocolsGetCurrent
} from "@tzkt/sdk-api";
import {BigNumber} from 'bignumber.js';


export class TzktReadProvider implements TzReadProvider {
  constructor(private readProvider: TzReadProvider) {}

  async getEntrypoints(contract: string): Promise<EntrypointsResponse> {
    const {data} = await contractsGetEntrypoints(contract);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return data;
  }

  async getScript(address: string): Promise<ScriptedContracts> {
    const {data} = await contractsGetStorageSchema(address);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return data;
  }

  async getBalance(address: string): Promise<BigNumber> {
    const {data} = await accountsGetBalance(address);
    return new BigNumber(data);
  }

  async getDelegate(address: string): Promise<string | null> {
    const {data} = await accountsGetByAddress(address);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

  getSaplingDiffById(
    saplingStateQuery: SaplingStateQuery,
    block: BlockIdentifier
  ): Promise<SaplingDiffResponse> {
    return this.readProvider.getSaplingDiffById(saplingStateQuery, block);
  }

  async getChainId(): Promise<string> {
    const {data} = await headGet();

    return data?.chainId || ''
  }

  async isAccountRevealed(publicKeyHash: string): Promise<boolean> {
    const {data} = await accountsGetByAddress(publicKeyHash)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return data?.revealed || null;
  }

  getBlock(block: BlockIdentifier): Promise<BlockResponse> {
    return this.readProvider.getBlock(block);
  }

  async getLiveBlocks(block: BlockIdentifier): Promise<string[]> {
    const {data} = await blocksGet({
      level: {
        le: Number(block),
      },
      sort: {
        desc: 'level',
      },
      limit: 120, select: {fields: ['hash', 'timestamp']}
    })
    return data.map((d: Block) => d?.hash || '')
  }
}

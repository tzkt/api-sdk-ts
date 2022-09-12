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
  accountsGetBalanceAtLevel,
  accountsGetByAddress,
  accountsGetCounter, bigMapsGetKey, Block, blocksGet,
  blocksGetByHash,
  blocksGetByLevel, blocksGetCount,
  contractsGetEntrypoints, contractsGetRawStorage,
  contractsGetStorageSchema, headGet, Protocol, protocolsGetByCycle,
  protocolsGetCurrent
} from '@tzkt/sdk-api';
import {BigNumber} from 'bignumber.js';



export class TzktReadProvider implements TzReadProvider {
  constructor(private readProvider: TzReadProvider) {}

  private readonly liveBlockFilters = {
    level: {},
    sort: {
      desc: 'level',
    },
    limit: 120, select: {fields: ['hash', 'timestamp']}
  };


  private async _getBlockIdentifier(block: BlockIdentifier): Promise<number> {
    if(typeof block === 'number') {
      return block
    }

    if(block === 'head' || !block) {
      const {data} = await blocksGetCount();
      return data
    }

    if(String(block).includes('head~')) {
      const n = Number(String(block).split('head~')[1])
      const {data} = await blocksGetCount();

      return  Number(data) - n
    }

    const {data} = await blocksGetByHash(block);
    return data?.level || 0
  }

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

  async getBalance(address: string, block: BlockIdentifier): Promise<BigNumber> {
    const blockId = await this._getBlockIdentifier(block);
    const {data} = await accountsGetBalanceAtLevel(address, blockId);
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

  async getProtocolConstants(block: BlockIdentifier): Promise<{
    time_between_blocks?: BigNumber[] | undefined;
    minimal_block_delay?: BigNumber | undefined;
    hard_gas_limit_per_operation: BigNumber;
    hard_gas_limit_per_block: BigNumber;
    hard_storage_limit_per_operation: BigNumber;
    cost_per_byte: BigNumber;
  }> {

    let protocol: Protocol

    if(block) {
      const blockId = await this._getBlockIdentifier(block)
      const blockByLevel = await blocksGetByLevel(blockId);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const {data} = await protocolsGetByCycle(blockByLevel.data.cycle || 0)
      protocol = data;
    } else {
      const {data} = await protocolsGetCurrent()
      protocol = data;
    }

    return {
      time_between_blocks: [new BigNumber(protocol?.constants?.timeBetweenBlocks || 0)] || undefined,
      minimal_block_delay: new BigNumber(0),
      hard_gas_limit_per_operation: new BigNumber(protocol?.constants?.hardOperationGasLimit || 0),
      hard_gas_limit_per_block: new BigNumber(protocol?.constants?.hardBlockGasLimit || 0),
      hard_storage_limit_per_operation: new BigNumber(protocol?.constants?.hardOperationStorageLimit || 0),
      cost_per_byte: new BigNumber(protocol?.constants?.byteCost || 0),
    }
  }

  async getStorage(contract: string, block: BlockIdentifier): Promise<MichelsonV1Expression> {
    const blockId = await this._getBlockIdentifier(block)
    const {data} = await contractsGetRawStorage(contract, {level: blockId})
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return data;
  }

  async getBlockHash(block: BlockIdentifier): Promise<string> {
    const blockId = await this._getBlockIdentifier(block);
    const {data} = await blocksGetByLevel(blockId);

    return data?.hash || ''
  }

  async getBlockLevel(block: BlockIdentifier): Promise<number> {
    return this._getBlockIdentifier(block)
  }

  async getCounter(pkh: string): Promise<string> {
    const {data} = await accountsGetCounter(pkh)
    return String(data)
  }

  async getBlockTimestamp(block: BlockIdentifier): Promise<string> {
    const  blockId = await this._getBlockIdentifier(block)
    const {data} = await blocksGetByLevel(blockId);
    return data?.timestamp || ''
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
      ...this.liveBlockFilters,
      level: {
        le:  await this._getBlockIdentifier(block),
      }
    })
    return data.map((d: Block) => d?.hash || '')
  }
}

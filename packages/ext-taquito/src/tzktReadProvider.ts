// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
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
  accountsGetBalanceAtLevel,
  accountsGetByAddress,
  accountsGetCounter, bigMapsGetKey, bigMapsGetKey2, Block, blocksGet,
  blocksGetByHash,
  blocksGetByLevel,
  blocksGetCount,
  contractsGetCode, contractsGetEntrypoints,
  contractsGetRawStorage, Entrypoint, headGet, Protocol, protocolsGetByCycle,
  protocolsGetCurrent
} from "@tzkt/sdk-api";
import {BigNumber} from 'bignumber.js';



export class TzktReadProvider implements TzReadProvider {
  constructor(private readProvider: TzReadProvider) {}

  private readonly liveBlocksLimit = 120;

  private async _getBlockLevel(block: BlockIdentifier): Promise<number> {
    if (typeof block === 'number') {
      return block
    }

    if (this._blockIdIsHead(block)) {
      return blocksGetCount();
    }

    if (String(block).includes('head~')) {
      const n = Number(String(block).split('head~')[1])
      const count = await blocksGetCount();

      return Number(count) - n
    }

    const {level} = await blocksGetByHash(block);
    return level || 0
  }

  private _blockIdIsHash(block: BlockIdentifier) {
    return String(block)[0] === 'B'
  }

  private _blockIdIsHead(block: BlockIdentifier) {
    return typeof block !== 'number' && (!block || block === 'head')
  }

  async getEntrypoints(contract: string): Promise<EntrypointsResponse> {
    const response = await contractsGetEntrypoints(contract, {json: false, micheline: true});

    const entrypoints = response.map((entrypoint: Entrypoint) => {
      return [entrypoint.name, entrypoint.michelineParameters]
    });

    return  {
      entrypoints: Object.fromEntries(entrypoints)
    }
  }

  async getScript(address: string, block: BlockIdentifier): Promise<ScriptedContracts> {
    let filter = undefined

    if (!this._blockIdIsHead(block)) {
      const blockLevel = await this._getBlockLevel(block);
      filter = {level: blockLevel}
    }

    return {
      code: await contractsGetCode(address, filter),
      storage: contractsGetRawStorage(contract, filter)
    };
  }

  async getBalance(address: string, block: BlockIdentifier): Promise<BigNumber> {
    if (this._blockIdIsHead(block)) {
      const balance = await accountsGetBalance(address);
      return new BigNumber(balance);
    }

    const blockLevel = await this._getBlockLevel(block);
    const balance = await accountsGetBalanceAtLevel(address, blockLevel);
    return new BigNumber(balance);
  }

  async getDelegate(address: string, block: BlockIdentifier): Promise<string | null> {
    if(!this._blockIdIsHead(block)) {
      return this.readProvider.getDelegate(address, block)
    }

    const account = await accountsGetByAddress(address);
    return account?.delegate?.address
  }

  async getNextProtocol(block: BlockIdentifier): Promise<string> {
    if(!this._blockIdIsHead(block)) {
      return this.readProvider.getNextProtocol(block)
    }

    const protocol = await protocolsGetCurrent()
    return protocol?.hash || ''
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

    if (!this._blockIdIsHead(block)) {
      const blockLevel = await this._getBlockLevel(block)
      const {cycle} = await blocksGetByLevel(blockLevel);

      protocol = await protocolsGetByCycle(cycle || 0)
    } else {
      protocol = await protocolsGetCurrent()
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
    if (this._blockIdIsHead(block)) {
      return contractsGetRawStorage(contract)
    }

    const blockLevel = await this._getBlockLevel(block)
    return contractsGetRawStorage(contract, {level: blockLevel})
  }

  async getBlockHash(block: BlockIdentifier): Promise<string> {
    if (this._blockIdIsHash(block)) {
      return String(block)
    }

    if (this._blockIdIsHead(block)) {
      const blocks = await blocksGet({
        sort: {desc: 'level'},
        select: {fields: ['hash']},
        limit: 1
      })

      return String(blocks[0]);
    }

    const blockLevel = await this._getBlockLevel(block);
    const {hash} = await blocksGetByLevel(blockLevel);

    return hash
  }

  async getBlockLevel(block: BlockIdentifier): Promise<number> {
    return this._getBlockLevel(block)
  }

  async getCounter(pkh: string, block: BlockIdentifier): Promise<string> {
    const counter = await accountsGetCounter(pkh)
    return String(counter)
  }

  async getBlockTimestamp(block: BlockIdentifier): Promise<string> {
    if(this._blockIdIsHash(block)) {
      const {timestamp} = await blocksGetByHash(block);
      return timestamp
    }

    if(this._blockIdIsHead(block)) {
      const blocks = await blocksGet({
        sort: {desc: 'level'},
        select: {fields: ['timestamp']},
        limit: 1
      });
      return String(blocks[0])
    }

    const blockLevel = await this._getBlockLevel(block)
    const {timestamp} = await blocksGetByLevel(blockLevel);
    return timestamp || ''
  }

  async getBigMapValue(bigMapQuery: BigMapQuery, block: BlockIdentifier): Promise<MichelsonV1Expression> {
    if (!this._blockIdIsHead(block)) {
      const {value} = await bigMapsGetKey(Number(bigMapQuery.id), bigMapQuery.expr, {micheline: 'Raw'});
      return value;
    }

    const blockLevel = await this._getBlockLevel(block)

    const {value} = await bigMapsGetKey2(Number(bigMapQuery.id), blockLevel, bigMapQuery.expr, {micheline: 'Raw'});
    return value;
  }

  getSaplingDiffById(
    saplingStateQuery: SaplingStateQuery,
    block: BlockIdentifier
  ): Promise<SaplingDiffResponse> {
    return this.readProvider.getSaplingDiffById(saplingStateQuery, block);
  }

  async getChainId(): Promise<string> {
    const {chainId} = await headGet();

    return chainId || ''
  }

  async isAccountRevealed(publicKeyHash: string, block: BlockIdentifier): Promise<boolean> {
    if (this._blockIdIsHead(block)) {
      const {revealed} = await accountsGetByAddress(publicKeyHash)
      return revealed || null;
    }

    return this.readProvider.isAccountRevealed(publicKeyHash)
  }

  getBlock(block: BlockIdentifier): Promise<BlockResponse> {
    return this.readProvider.getBlock(block);
  }

  async getLiveBlocks(block: BlockIdentifier): Promise<string[]> {
    let filters = {};

    if (this._blockIdIsHash(block)) {
      return [String(block)]
    }

    if (!this._blockIdIsHead(block)) {
      filters = {
        level: {
          le: await this._getBlockLevel(block)
        }
      }
    }

    const liveBlocks = await blocksGet({
      sort: {
        desc: 'level',
      },
      limit: this.liveBlocksLimit,
      select: {fields: ['hash', 'timestamp']},
      ...filters
    })

    return liveBlocks.map((d: Block) => d?.hash || '')
  }
}

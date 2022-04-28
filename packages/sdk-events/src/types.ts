import {
  ActivationOperation,
  BakingOperation,
  BallotOperation,
  BigMapUpdate,
  Block,
  DelegationOperation,
  DoubleBakingOperation,
  DoubleEndorsingOperation,
  DoublePreendorsingOperation,
  EndorsementOperation,
  EndorsingRewardOperation,
  MigrationOperation,
  NonceRevelationOperation,
  OriginationOperation,
  PreendorsementOperation,
  ProposalOperation,
  RegisterConstantOperation,
  RevealOperation,
  RevelationPenaltyOperation,
  SetDepositsLimitOperation,
  State,
  TokenTransfer,
  TransactionOperation,
} from '@tzkt/sdk-api';

export enum EventType {
  Init = 0,
  Data = 1,
  Reorg = 2,
}

export interface Event {
  type: EventType;
  state: number;
}

export interface Message extends Event {
  data?: ResponseTypes;
}

export type TezosOperation =
  | ActivationOperation
  | BallotOperation
  | DelegationOperation
  | DoubleBakingOperation
  | DoubleEndorsingOperation
  | EndorsementOperation
  | NonceRevelationOperation
  | OriginationOperation
  | ProposalOperation
  | RevealOperation
  | TransactionOperation
  | RegisterConstantOperation
  | PreendorsementOperation
  | DoublePreendorsingOperation
  | RevelationPenaltyOperation
  | SetDepositsLimitOperation
  | MigrationOperation
  | EndorsingRewardOperation
  | BakingOperation;

export interface OperationSubscriptionParameters {
  address?: string;
  types?: Array<OperationKind>;
}

export interface BigMapSubscriptionParameters {
  contract?: string;
  ptr?: number;
  path?: string;
  tags?: Array<BigMapTag>;
}

export interface TokenTransferSubscriptionParameters {
  account?: string;
  contract?: string;
  tokenId?: string;
}

export class BigMapParametersX {
  constructor(
    readonly contract?: string,
    readonly ptr?: number,
    readonly path?: string,
    readonly tags?: Array<BigMapTag>
  ) {}

  public is(update: BigMapUpdate): boolean {
    if (this.contract) {
      if (this.contract !== update.contract) {
        return false;
      }
    }
    if (this.ptr) {
      if (this.ptr !== update.bigmap) {
        return false;
      }
    }
    if (this.path) {
      if (!update.path?.startsWith(this.path)) {
        return false;
      }
    }
    // TODO: filter by tags
    return true;
  }
}

export interface EventsConfig {
  url: string;
  reconnect?: boolean;
}

export enum BIGMAPTAG {
  METADATA = 'metadata',
  TOKEN_METADATA = 'token_metadata',
}

export enum CHANNEL {
  HEAD = 'head',
  BLOCKS = 'blocks',
  OPERATIONS = 'operations',
  BIGMAPS = 'bigmaps',
  TRANSFERS = 'transfers',
}

export enum METHOD {
  HEAD = 'SubscribeToHead',
  BLOCKS = 'SubscribeToBlocks',
  OPERATIONS = 'SubscribeToOperations',
  BIGMAPS = 'SubscribeToBigMaps',
  TRANSFERS = 'SubscribeToTokenTransfers',
}

export function channelToMethod(channel: CHANNEL): METHOD {
  switch (channel) {
    case CHANNEL.HEAD: {
      return METHOD.HEAD;
    }
    case CHANNEL.BLOCKS: {
      return METHOD.BLOCKS;
    }
    case CHANNEL.OPERATIONS: {
      return METHOD.OPERATIONS;
    }
    case CHANNEL.BIGMAPS: {
      return METHOD.BIGMAPS;
    }
    case CHANNEL.TRANSFERS: {
      return METHOD.TRANSFERS;
    }
    default: {
      throw new Error('Unknown channel: ' + channel);
    }
  }
}

export type BigMapTag = BIGMAPTAG.METADATA | BIGMAPTAG.TOKEN_METADATA;
export type OperationKind =
  | 'transaction'
  | 'origination'
  | 'delegation'
  | 'reveal'
  | 'double_baking'
  | 'double_endorsing'
  | 'nonce_revelation'
  | 'activation'
  | 'proposal'
  | 'ballot'
  | 'endorsement'
  | 'register_constant'
  | 'preendorsement'
  | 'double_preendorsement'
  | 'revelation_penalty'
  | 'set_deposits_limit'
  | 'migration'
  | 'endorsing_reward'
  | 'baking';

export type ResponseTypes =
  | State
  | Block
  | TezosOperation
  | BigMapUpdate
  | TokenTransfer;
export type SubscriptionParameters =
  | OperationSubscriptionParameters
  | BigMapSubscriptionParameters
  | TokenTransferSubscriptionParameters;

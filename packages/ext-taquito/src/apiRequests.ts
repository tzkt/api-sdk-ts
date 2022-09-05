import 'cross-fetch/polyfill';
import {
  MichelsonV1Expression,
  ScriptedContracts,
} from '@taquito/rpc';
import {
  accountsGetBalance,
  accountsGetByAddress, contractsGetStorage, contractsGetStorageSchema,
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
      minimal_block_delay: new BigNumber(data?.constants?.timeBetweenBlocks || 0) || undefined,
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


  async getScript(address: string): Promise<ScriptedContracts> {
    const {data} = await contractsGetStorageSchema(address);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return data;
  }
}

export {ApiRequests}

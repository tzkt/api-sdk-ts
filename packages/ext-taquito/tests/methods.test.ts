import { TzktExtension } from '../src';
// @ts-ignore
import {TezosToolkit} from '@taquito/taquito';
import {ReadProviderWrapper} from "../src/readProviderWrapper";
// const request = require("supertest");

describe("request", () => {
  const Tezos = new TezosToolkit('https://rpc.tzkt.io/mainnet');
  const extension = new ReadProviderWrapper(Tezos as any, new TzktExtension());
  Tezos.addExtension(new TzktExtension());

  test('Get Balance should equal 7545356800906', async () => {
    const result = await Tezos.tz.getBalance('tz1iG3vqiT95KKSqNQuYnQEXNQk5gXQepM1r');
    expect(result.toNumber()).toEqual(7548261274022);
  });

  test('Get Delegate should equal tz1irJKkXS2DBWkU1NnmFQx1c1L7pbGg4yhk', async () => {
    const result = await Tezos.tz.getDelegate('tz1iG3vqiT95KKSqNQuYnQEXNQk5gXQepM1r');
    expect(result).toEqual('tz1irJKkXS2DBWkU1NnmFQx1c1L7pbGg4yhk');
  });

  test('Get Next protocol should equal PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY', async () => {
    const result = await extension.getNextProtocol(2664043);
    console.log(result, 'result')
    expect(result).toEqual('PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY');
  });


  test('Ge Protocol Constants .hardBlockGasLimit should equal 5200000', async () => {
    const result = await extension.getProtocolConstants(2664043);

    expect({
      hard_gas_limit_per_block: result.hard_gas_limit_per_block.toNumber(),
      hard_storage_limit_per_operation: result.hard_storage_limit_per_operation.toNumber(),
      cost_per_byte: result.cost_per_byte.toNumber()
    }).toEqual({
      hard_gas_limit_per_block: 5200000,
      hard_storage_limit_per_operation: 60000,
      cost_per_byte: 250
    });
  });

  test('Get Storage should to return valid data', async () => {
    const result = await Tezos.rpc.getStorage('KT1Qej1k8WxPvBLUjGVtFXStgzQtcx3itSk5')
    // @ts-ignore
    expect(result.prim).toEqual('Pair')
  });
  //
  test('Get Script should to return valid data', async () => {
    const result = await Tezos.rpc.getScript('KT1Qej1k8WxPvBLUjGVtFXStgzQtcx3itSk5')
    // @ts-ignore
    expect(result).toHaveProperty('storage')
  });
})

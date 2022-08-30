import { TzktExtension } from '../src';
// @ts-ignore
import {TezosToolkit} from '@taquito/taquito';
const request = require("supertest");

describe("request", () => {
  const Tezos = new TezosToolkit();
  Tezos.addExtension(new TzktExtension('https://api.tzkt.io'));

  test('Get Balance should equal 7,542,493,683,789', async () => {
    const result = await Tezos.tz.getBalance('tz1iG3vqiT95KKSqNQuYnQEXNQk5gXQepM1r', 2664043);

    expect(result).toEqual('7,542,493,683,789');
  });

  test('Get Delegate should equal tz1irJKkXS2DBWkU1NnmFQx1c1L7pbGg4yhk', async () => {
    const result = await Tezos.tz.getDelegate('tz1iG3vqiT95KKSqNQuYnQEXNQk5gXQepM1r', 2664043);

    expect(result).toEqual('tz1irJKkXS2DBWkU1NnmFQx1c1L7pbGg4yhk');
  });

  test('Get Next protocol should equal PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY', async () => {
    const result = await Tezos.tz.getNextProtocol(2664043);

    expect(result).toEqual('PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY');
  });

  test('Ge Protocol Constants .hardBlockGasLimit should equal 5200000', async () => {
    const result = await Tezos.tz.getProtocolConstants(2664043);

    expect(result).toEqual('5200000');
  });

  test('Get Script should to match objects from https://rpc.tzkt.io/mainnet/chains/main/blocks/head/context/contracts/KT1VG2WtYdSWz5E7chTeAdDPZNy2MpP8pTfL/script', async () => {
    const result = await Tezos.tz.getScript('KT1VG2WtYdSWz5E7chTeAdDPZNy2MpP8pTfL', 'head')
    const {body} = request.get('https://rpc.tzkt.io/mainnet/chains/main/blocks/head/context/contracts/KT1VG2WtYdSWz5E7chTeAdDPZNy2MpP8pTfL/script');
    expect(result).toMatchObject(body.data)
  });

  test('Get Storage should to match objects from https://rpc.tzkt.io/mainnet/chains/main/blocks/2657517/context/contracts/KT1Qej1k8WxPvBLUjGVtFXStgzQtcx3itSk5/storage', async () => {
    const result = await Tezos.tz.getStorage('KT1Qej1k8WxPvBLUjGVtFXStgzQtcx3itSk5', 2657517)
    const {body} = request.get('https://rpc.tzkt.io/mainnet/chains/main/blocks/2657517/context/contracts/KT1Qej1k8WxPvBLUjGVtFXStgzQtcx3itSk5/storage');
    expect(result).toMatchObject(body.data)
  });
})

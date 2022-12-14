import {TzktExtension} from '../src';
import {TezosToolkit} from '@taquito/taquito';
import {TzktReadProvider} from "../src/tzktReadProvider";
// const request = require("supertest");

describe("request", () => {
  const Tezos = new TezosToolkit('https://rpc.tzkt.io/mainnet');
  const extension = new TzktReadProvider(Tezos as any);
  Tezos.addExtension(new TzktExtension());

  test('Get Balance should equal 7554173199759', async () => {
    const result = await extension.getBalance('tz1iG3vqiT95KKSqNQuYnQEXNQk5gXQepM1r',2664043 );
    expect(result.toNumber()).toEqual(7542493683789);
  });

  test('Get Delegate should equal tz1irJKkXS2DBWkU1NnmFQx1c1L7pbGg4yhk', async () => {
    const result = await Tezos.tz.getDelegate('tz1iG3vqiT95KKSqNQuYnQEXNQk5gXQepM1r');
    expect(result).toEqual('tz1irJKkXS2DBWkU1NnmFQx1c1L7pbGg4yhk');
  });

  // TODO: update next time there's protocol upgrade
  test('Get Next protocol should equal PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg', async () => {
    const result = await extension.getNextProtocol('head');
    expect(result).toEqual('PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg');
  });


  test('Get Protocol Constants .hardBlockGasLimit should equal 5200000', async () => {
    const result = await extension.getProtocolConstants(2703631);

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

  test('Get Script should to return valid data', async () => {
    const result = await Tezos.rpc.getScript('KT1Qej1k8WxPvBLUjGVtFXStgzQtcx3itSk5')
    expect(result).toHaveProperty('storage')
  });

  test('Get entryPoints protocol should return valid data', async () => {
    const result = await extension.getEntrypoints('KT1Qej1k8WxPvBLUjGVtFXStgzQtcx3itSk5');
    expect(result.entrypoints).toHaveProperty('withdrawProfit');
  });


  test('getBlockHash should equal BMHZJm9ome4S7jTAs4ibeDH88rUrvsEm3RLe43Rrr9Xx4QwADP3', async () => {
    const result = await extension.getBlockHash(2664043)
    expect(result).toEqual('BMHZJm9ome4S7jTAs4ibeDH88rUrvsEm3RLe43Rrr9Xx4QwADP3')
  });

  test('getBlockLevel should equal 2664043', async () => {
    const result = await extension.getBlockLevel('BMHZJm9ome4S7jTAs4ibeDH88rUrvsEm3RLe43Rrr9Xx4QwADP3')
    expect(result).toEqual(2664043)
  });

  test('getCounter should equal 3829', async () => {
    const result = await extension.getCounter('tz1Nx7hmKnagtzPyWDEba4naJb37Jn6RaP6E', 2664043)
    expect(Number(result)).toEqual(3829)
  });

  test('getBlockTimestamp should equal 2022-08-29T12:06:59Z', async () => {
    const result = await extension.getBlockTimestamp(2664043)
    expect(result).toEqual('2022-08-29T12:06:59Z')
  });


  test('getBigMapValue should to return valida data', async () => {
    const result = await extension.getBigMapValue({
      id: '4',
      expr: 'exprvS1VCPqQXtksURt9uuKPhvmBCbQuXXvHa1LkjundxjaFQBcrQk'
    }, 2664043)
    // @ts-ignore
    expect(result.prim).toEqual('Pair')
  });

  test('getChainId should equal NetXdQprcVkpaWU', async () => {
    const result = await Tezos.rpc.getChainId()
    expect(result).toEqual('NetXdQprcVkpaWU')
  });

  test('isAccountRevealed should equal true', async () => {
    const result = await extension.isAccountRevealed('tz1iG3vqiT95KKSqNQuYnQEXNQk5gXQepM1r', 'head')
    expect(result).toEqual(true)
  });

  test('getLiveBlocks length should toBeTruthy', async () => {
    const result = await extension.getLiveBlocks(2664043)
    expect(
      result.includes('BKjSBdD5pUyDTgv8o5FBTD1wBE7R2cwLptcPDBSVoWKtDzRKCf2') &&
      result.includes('BMeHqAgX5pfqWuthAzBMMZhw3KqDPMctsa29Tner8iqJ3jMHR79')
    ).toBeTruthy();

  });
})

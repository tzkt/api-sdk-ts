import {
  blocksGet,
  operationsGetTransactions,
  tokensGetTokenTransfers,
} from '../src';

const getBlocksRequestUrl = async (method: any, params: any) => {
  let requestUrl = '';

  const fetchMock = (url: string) => {
    requestUrl = url;
    return {
      ok: true,
      status: 200,
      text: '',
      headers: {
        get: () => undefined,
      },
    };
  };

  const res = await method(params, {
    fetch: fetchMock as any,
  });

  expect(res).toEqual(undefined);

  return requestUrl;
};

describe('request', () => {
  test('blocksGet any on in', async () => {
    const checkUrl =
      'https://api.tzkt.io/v1/blocks?limit=50&anyof.producer.proposer.in=tz3WMqdzXqRWXwyvj5Hp2H7QEepaUuS7vd9K,tz3bTdwZinP8U1JmSweNzVKhmwafqWmFWRfk&level.lt=1000000';

    const url = await getBlocksRequestUrl(blocksGet, {
      anyof: {
        in: [
          'tz3WMqdzXqRWXwyvj5Hp2H7QEepaUuS7vd9K',
          'tz3bTdwZinP8U1JmSweNzVKhmwafqWmFWRfk',
        ],
        fields: ['producer', 'proposer'],
      },
      level: {
        lt: 1000000,
      },
      limit: 50,
    });

    expect(decodeURIComponent(url)).toEqual(checkUrl);
  });

  test('tokensGetTokenTransfers null', async () => {
    const checkUrl =
      'https://api.tzkt.io/v1/tokens/transfers?limit=50&level.lt=1000000&anyof.from.to.null=true';

    const url = await getBlocksRequestUrl(tokensGetTokenTransfers, {
      anyof: {
        null: true,
        fields: ['from', 'to'],
      },
      limit: 50,
      level: {
        lt: 1000000,
      },
    });

    expect(decodeURIComponent(url)).toEqual(checkUrl);
  });

  test('blocksGet eq', async () => {
    const checkUrl =
      'https://api.tzkt.io/v1/blocks?limit=50&anyof.proposer.producer=tz3WMqdzXqRWXwyvj5Hp2H7QEepaUuS7vd9K&level.lt=1000000';

    const url = await getBlocksRequestUrl(blocksGet, {
      anyof: {
        value: 'tz3WMqdzXqRWXwyvj5Hp2H7QEepaUuS7vd9K',
        fields: ['proposer', 'producer'],
      },
      limit: 50,
      level: {
        lt: 1000000,
      },
    });

    expect(decodeURIComponent(url)).toEqual(checkUrl);
  });

  test('operationsGetTransactions eq', async () => {
    const checkUrl =
      'https://api.tzkt.io/v1/operations/transactions?limit=50&anyof.sender.target.eq=tz3WMqdzXqRWXwyvj5Hp2H7QEepaUuS7vd9K&level.lt=1000000';

    const url = await getBlocksRequestUrl(operationsGetTransactions, {
      anyof: {
        eq: 'tz3WMqdzXqRWXwyvj5Hp2H7QEepaUuS7vd9K',
        fields: ['sender', 'target'],
      },
      limit: 50,
      level: {
        lt: 1000000,
      },
    });

    expect(decodeURIComponent(url)).toEqual(checkUrl);
  });
});

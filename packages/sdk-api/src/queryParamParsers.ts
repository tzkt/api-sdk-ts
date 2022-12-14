import type { QueryParamParser } from '@tzkt/oazapfts/codegen/extensions';

const jsonParameter: QueryParamParser = (paramName, p?) => {
  if (!p) return {};

  const mainParamsObj: Record<string, string> = {};

  Object.entries(p).forEach(([k, v]) => {
    if (!(v instanceof Object)) {
      throw new Error(
        `Expected ${paramName} value to be object, received ${typeof v}`
      );
    }

    const { jsonPath, jsonValue } = v;
    if (jsonValue === undefined || jsonValue === null)
      throw new Error(
        `Expected jsonValue in ${paramName} -> ${k}, found: ${jsonValue}`
      );

    // k is top eq, ne, in, etc.
    const parameterPathParts = [paramName, jsonPath, k];

    const parameterPath = parameterPathParts
      .filter((p) => p !== undefined)
      .join('.');
    mainParamsObj[parameterPath] = jsonValue;
  });

  return mainParamsObj;
};

const anyofParameter: QueryParamParser = (paramName, p) => {
  if (!p) return {};

  const { fields } = p;

  const validateFields = (fields: unknown): fields is string[] => {
    if (!Array.isArray(fields)) {
      throw new Error(
        `Expected ${paramName} fields to be Array. Received ${typeof fields}.`
      );
    }

    fields.forEach((f) => {
      if (typeof f === 'string') return;
      throw new Error(
        `Expected ${paramName} fields to be strings. Received ${typeof f}`
      );
    });

    return true;
  };

  // never really returns but oh well
  if (!validateFields(fields)) return {};

  const mainParamsObj: Record<string, unknown> = {};

  const anyof = fields.join('.');

  if (p.value) {
    const prefixedKey = `${paramName}.${anyof}`;
    mainParamsObj[prefixedKey] = p.value;
  }

  for (const param of ['in', 'eq', 'null']) {
    if (p[param]) {
      const prefixedKey = `${paramName}.${anyof}.${param}`;
      mainParamsObj[prefixedKey] = Array.isArray(p[param])
        ? p[param].join(',')
        : p[param];
      return mainParamsObj;
    }
  }

  return mainParamsObj;
};

const queryParameter: QueryParamParser = (paramName, p) => {
  if (!p) return {};

  const mainParamsObj: Record<string, unknown> = {};

  Object.entries(p).forEach(([k, v]) => {
    const key = `${paramName}.${k}`;
    mainParamsObj[key] = v;
  });

  return mainParamsObj;
};

const parsers: Record<string, QueryParamParser> = {
  jsonParameter,
  queryParameter,
  anyofParameter,
};

export default parsers;

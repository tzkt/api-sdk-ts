import { QueryParamParser } from '@tzkt/oazapfts/lib/codegen/extensions';

const jsonParameter: QueryParamParser = (paramName, p?) => {
  if (!p) return {};

  const mainParamsObj: Record<string, string> = {};

  Object.entries(p).forEach(([k, v]) => {
    if (!(v instanceof Object)) {
      throw new Error(
        `Expected ${paramName} value to be object, received ${typeof v}`
      );
    }

    if (!('jsonPath' in v)) {
      throw new Error(
        `Expected jsonPath in ${paramName} value to be object, received ${v}`
      );
    }

    if (!('jsonValue' in v)) {
      throw new Error(
        `Expected jsonValue in ${paramName} value to be object, received ${v}`
      );
    }

    const { jsonPath, jsonValue } = v;
    if (!jsonValue)
      throw new Error(`Expected jsonValue in ${paramName} -> ${k}`);

    // k is top eq, ne, in, etc.
    const parameterPath = `${paramName}.${jsonPath}.${k}`;
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
  const prefixedKey = `${paramName}.${anyof}`;

  mainParamsObj[prefixedKey] = p.value;

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

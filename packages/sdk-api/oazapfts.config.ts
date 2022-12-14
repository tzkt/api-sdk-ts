import {
  OazapftsExtensions,
  ParameterParserExtension,
  QueryStringParserExtension,
  ReponseTypeExtension,
  SchemaParserExtension,
} from "@tzkt/oazapfts/lib/codegen/extensions";
import * as _ from "lodash";
import { OpenAPIV3 } from "openapi-types";
import {factory, TypeElement, UnionTypeNode} from "typescript";

const tzktExtensionKey = "x-tzkt-extension";

type TzktExtended<T> = T & {
  [tzktExtensionKey]: string;
};

const hasOwnProp = <O extends Record<string, unknown>, K extends PropertyKey>(
  p: O,
  k: K
): p is O & Record<K, unknown> => {
  return Object.prototype.hasOwnProperty.call(p, k);
};

const isTzktExtended = <P extends Record<string, unknown>>(p: P): p is P & TzktExtended<P> => {
  if (!hasOwnProp(p, tzktExtensionKey)) return false;

  return typeof p[tzktExtensionKey] === "string";
};

const anyofParameterExtension: ParameterParserExtension = (p, helpers) => {
  if (!isTzktExtended(p)) return;

  const extension = p[tzktExtensionKey];
  if (extension !== "anyof-parameter") return;

  // getSchemaFromContent()

  if (!hasOwnProp(p, "x-tzkt-anyof-parameter")) return;

  const rawAnyof = p["x-tzkt-anyof-parameter"];
  if (typeof rawAnyof !== "string") return;

  const types = rawAnyof
    .split(",")
    .map((t) => factory.createLiteralTypeNode(factory.createStringLiteral(t)));

  const valNode = helpers.createPropertySignature({
    name: "value",
    questionToken: true,
    type: factory.createUnionTypeNode([
      helpers.keywordType.string,
      helpers.keywordType.null,
    ]),
  });

  const eqNode = helpers.createPropertySignature({
    name: "eq",
    questionToken: true,
    type: helpers.keywordType.string,
  });

  const nullNode = helpers.createPropertySignature({
    name: "null",
    questionToken: true,
    type: helpers.keywordType.boolean,
  });

  const inNode = helpers.createPropertySignature({
    name: "in",
    questionToken: true,
    type: factory.createArrayTypeNode(helpers.keywordType.string) ,
  });

  const pathNode = helpers.createPropertySignature({
    name: "fields",
    questionToken: true,
    type: factory.createArrayTypeNode(factory.createUnionTypeNode(types)),
  });

  return factory.createTypeLiteralNode([
    valNode,
    pathNode,
    inNode,
    nullNode,
    eqNode,
  ]);
};

/**
 * If parameter is required and nullable at the same time makes it non-nullable
 */
const nonNullableRequiredParamExtension: ParameterParserExtension = (parameter, helpers, ctx) => {
  if (helpers.isNullable(parameter.schema) && parameter.required) {
    return ctx.getBaseTypeFromSchema(parameter.schema)
  };
  return undefined;
}

const jsonParameterExtension: SchemaParserExtension = (schema, name, helpers) => {
  if (!schema || helpers.isReference(schema) || !isTzktExtended(schema)) return;

  const extension = schema["x-tzkt-extension"];
  if (extension !== "json-parameter") return;

  /**
   * This is a bodge to filter out method parameters that have 'json-parameter'
   * in 'x-tzkt-extension' field. Such method parameters should not be
   * extended, but rather their properties should be (and are) processed by
   * this extension.
   * TODO!: remove 'json-parameter' from top-level parameter description
   */
  if (hasOwnProp(schema, "properties")) return;

  const valNode = helpers.createPropertySignature({
    name: "jsonValue",
    questionToken: false,
    type: helpers.defaultSchemaTypeParser(schema),
  });

  const pathNode = helpers.createPropertySignature({
    name: "jsonPath",
    questionToken: true,
    type: helpers.keywordType.string,
  });

  return factory.createTypeLiteralNode([valNode, pathNode]);
};

const queryParameterExtension: SchemaParserExtension = (schema, name, helpers) => {
  if (!schema || helpers.isReference(schema) || !isTzktExtended(schema)) return;

  const extension = schema["x-tzkt-extension"];
  if (extension !== "query-parameter") return;

  const props = schema.properties;
  if (!props) {
    console.error("Unexpected schema structure", schema);
    throw new Error(`Expected properties list in query-parameter schema.`);
  }

  type SpecifiedQueryParameter = TzktExtended<OpenAPIV3.SchemaObject> & {
    "x-tzkt-query-parameter": string;
  };

  const isSpecified = (
    schema: TzktExtended<OpenAPIV3.SchemaObject>
  ): schema is SpecifiedQueryParameter => {
    return typeof (schema as any)["x-tzkt-query-parameter"] === "string";
  };

  let specifiedType: UnionTypeNode | undefined = undefined;

  if (isSpecified(schema)) {
    const types = schema["x-tzkt-query-parameter"].split(",");
    specifiedType = factory.createUnionTypeNode(
      types.map((t) =>
        factory.createLiteralTypeNode(factory.createStringLiteral(t))
      )
    );
  }

  const getPropType = (
    p: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject,
    specifiedType?: UnionTypeNode
  ) => {
    if (helpers.isReference(p)) {
      const m = "Unexpected reference in schema property";
      console.error(m, p);
      throw new Error(m);
    }

    if ("items" in p) {
      if (specifiedType) return factory.createArrayTypeNode(specifiedType);

      const parsedType = helpers.defaultSchemaTypeParser(p.items);
      return factory.createArrayTypeNode(parsedType);
    }

    return specifiedType ?? helpers.defaultSchemaTypeParser(p);
  };

  const { required } = schema;
  const members: TypeElement[] = Object.entries(props).map(
    ([name, prop]) => {
      const isRequired = required?.includes(name);
      return helpers.createPropertySignature({
        questionToken: !isRequired,
        name,
        type: getPropType(prop, specifiedType),
      });
    }
  );

  return factory.createTypeLiteralNode(members);
};

const tzktQueryStringExtension: QueryStringParserExtension = (p) => {
  if (isTzktExtended(p)) return _.camelCase(p[tzktExtensionKey]);
};

const tzktQueryStringQueryParameterExtension: QueryStringParserExtension = (
  p,
  helpers,
) => {
  const schema = p.schema;
  if (helpers.isReference(schema)) return;

  const oneOfs = schema?.oneOf;
  if (!oneOfs) return;

  if (
    oneOfs.some((oneOf) => {
      if (!helpers.isReference(oneOf)) return false;

      const schema = helpers.defaultSchemaResolver(oneOf);
      if (!isTzktExtended(schema)) return false;

      if (schema[tzktExtensionKey] !== "query-parameter") return false;

      return true;
    })
  )
    return "queryParameter";
};

const extensions: OazapftsExtensions = {
  schemaParserExtensions: [
    jsonParameterExtension,
    queryParameterExtension,
  ],
  parameterParserExtensions: [
    anyofParameterExtension,
    nonNullableRequiredParamExtension
  ],
  queryStringParserExtensions: [
    tzktQueryStringExtension,
    tzktQueryStringQueryParameterExtension,
  ],
};

export default extensions;

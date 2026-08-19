/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

var JSONExtendedReplacer = function (this: any, key: string, _v: any) {
  const value = (this as any)[key]; // https://stackoverflow.com/questions/31096130/how-to-json-stringify-a-javascript-date-and-preserve-timezone#comment121087544_54037861
  // Handle Map objects
  if (value instanceof Map) {
    return {
      __type: "Map",
      value: Array.from(value.entries()),
    };
  }

  // Handle Set objects
  if (value instanceof Set) {
    return {
      __type: "Set",
      value: Array.from(value),
    };
  }

  // Handle RegExp objects
  if (value instanceof RegExp) {
    return {
      __type: "RegExp",
      value: value.source,
      flags: value.flags,
    };
  }

  // Handle Date objects
  if (value instanceof Date) {
    return {
      __type: "Date",
      value: value.valueOf(),
    };
  }

  return value;
};

function JSONExtendedReviver(_key: string, value: any) {
  if (value && typeof value === "object" && value.__type) {
    switch (value.__type) {
      case "Map":
        return new Map(value.value);
      case "Set":
        return new Set(value.value);
      case "RegExp":
        return new RegExp(value.value, value.flags);
      case "Date":
        return new Date(value.value);
    }
  }

  return value;
}
export const JSONExtended = {
  stringify: (data: any) => {
    return JSON.stringify(data, JSONExtendedReplacer);
  },
  parse: (json: string) => {
    return JSON.parse(json, JSONExtendedReviver);
  },
};

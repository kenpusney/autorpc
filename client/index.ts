import {identity, randomId, sink} from "../common"

import { JsonRpcErrorResult, JsonRpcRequest, JsonRpcResult, JsonRpcSuccessResult } from "../types"

interface ClientOptions {
  fetch?(param: JsonRpcRequest): JsonRpcResult

  catchE?(param: any): any

  idGen?(method: string, params: object | any[]): string
}

const client = ({fetch, catchE, idGen}: ClientOptions = {}) => {
  return new Proxy({
    fetch: fetch || (({method, params, id}) => ({jsonrpc: "2.0", result: {method, params}, id: id || randomId()})),
    catchE: catchE || identity,
    idGen: idGen || sink
  }, {
    get(target, method, receiver) {
      return (params) => {
        let fetchResult = target.fetch({
          jsonrpc: "2.0",
          method: method.toString(),
          params,
          id: target.idGen(method, params),
        });
        if ((fetchResult as JsonRpcErrorResult).error) {
          return target.catchE((fetchResult as JsonRpcErrorResult).error);
        } else {
          let {result} = fetchResult as JsonRpcSuccessResult;
          return result;
        }

      }
    }
  })
}

module.exports = client;


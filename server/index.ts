const {identity, randomId} = require("../common")

import {JsonRpcRequest, JsonRpcResult} from "../types"

interface ServerHandlers {
  [method: string]: (JsonRpcRequestParams) => any
}

interface AutoRpcServer {
  handlers?: ServerHandlers

  wrapE?(exception: any): any
}

const server = ({handlers, wrapE}: AutoRpcServer = {}) => {
  const errorHandler = wrapE || identity;

  const serve = (request: JsonRpcRequest | JsonRpcRequest[]): JsonRpcResult => {
    if (Array.isArray(request)) {
      return request.map(serve);
    }
    const {jsonrpc, method, params, id} = request;

    if (handlers[method]) {
      try {
        const result = handlers[method](params);

        return {jsonrpc, result, id: id || randomId()};
      } catch (e) {
        e = errorHandler(e);
        if (e.code && e.message) {
          const {code, message, data} = e;
          return {jsonrpc, error: {code, message, data}};
        } else {
          return {jsonrpc, error: {code: 32000, message: "Server Error"}}
        }
      }
    }
  }

  return serve;
}

module.exports = server

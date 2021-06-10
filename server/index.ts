const {identity, randomId} = require("../common")

import {JsonRpcRequest, JsonRpcResult, JsonRpcRequestParams, JsonRpcResponseError, JsonRpcErrorResult} from "../types"

const jsonrpc = '2.0'
interface ServerHandlers {
  [method: string]: (params: JsonRpcRequestParams) => any
}

interface AutoRpcServer {
  handlers?: ServerHandlers

  errorWrapper?(exception: any): JsonRpcResult
}

const server = (handlers: ServerHandlers) => {

  const autorpcServer = new AutoRpcServerImpl(handlers);

  const serve = (request: JsonRpcRequest | JsonRpcRequest[]): JsonRpcResult => {
    return autorpcServer.process(request)
  }

  return serve;
}

const errorCreator = (code: number, message: string, data?: any): JsonRpcErrorResult => {
  return { jsonrpc, error: { code, message, data } }
}

const defaultErrors = {
  "PARSE_ERROR": errorCreator(-32700, "Parse error"),
  "INVALID_REQUEST":  errorCreator(-32600, "Invalid request"),
  "METHOD_NOT_FOUND": errorCreator(-32601, "Method not found"),
  "INVALID_PARAM": errorCreator(-32602, "Invalid params"),
  "INTERNAL_ERROR": errorCreator(-32603, "Internal error"),
  "SERVER_ERROR": errorCreator(-32000, "Server error"),
}

class AutoRpcServerImpl implements AutoRpcServer {
  handlers: ServerHandlers

  constructor(handlers: ServerHandlers) {
    this.handlers = handlers;
  }

  errorWrapper(exception: any): JsonRpcResult {
    if (exception.code && exception.message) {
      const { code, message, data } = exception;

      return { jsonrpc, error: { code, message, data } }
    } else {
      return defaultErrors.SERVER_ERROR
    }
  }

  process(request: JsonRpcRequest | JsonRpcRequest[]): JsonRpcResult {
    if (Array.isArray(request)) {
      return request.map(r => this.process(r));
    }

    const { method, params, id } = request;

    if (!(method in this.handlers)) {
      return defaultErrors.METHOD_NOT_FOUND;
    }

    try {
      const result = this.handlers[method](params);

      return {jsonrpc, result, id: id ?? randomId()}
    } catch (e) {
      return this.errorWrapper(e);
    }
  }
}

module.exports = server

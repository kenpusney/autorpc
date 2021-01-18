export type JsonRpcRequestParams = object | any[]

export interface JsonRpcSuccessResult {
  jsonrpc: "2.0"
  result: any
  id?: string
}

export interface JsonRpcResponseError {
  code: number,
  message: string,
  data?: any
}

export interface JsonRpcErrorResult {
  jsonrpc: "2.0"
  error: JsonRpcResponseError
}

export type JsonRpcResult = JsonRpcSuccessResult | JsonRpcErrorResult | JsonRpcResult[]

export interface JsonRpcRequest {
  jsonrpc: "2.0"
  method: string
  params: JsonRpcRequestParams
  id?: string
}

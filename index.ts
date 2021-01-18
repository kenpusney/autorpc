export const server = require("./server")
export const client = require("./client")

export const { AutoRpcError } = require("./common")

module.exports = {
  server, client, AutoRpcError
}

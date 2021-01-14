
const autorpc = (option) => {
  return new Proxy({}, {
    get(target, property, receiver) {
      return (params) => {
        return {
          jsonrpc: "2.0",
          method: property,
          params
        }
      }
    }
  })
}

module.exports = autorpc;
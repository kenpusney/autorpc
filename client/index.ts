import {identity, randomId, sink} from "../common"

const client = ({fetch, catchE, idGen} = {}) => {
  return new Proxy({
    fetch: fetch || (({method, params, id}) => ({jsonrpc: "2.0", result: {method, params}, id: id || randomId()})),
    catchE: catchE || identity,
    idGen: idGen || sink
  }, {
    get(target, method, receiver) {
      return (params) => {
        const {jsonrpc, result, id, error} = target.fetch({
          jsonrpc: "2.0",
          method,
          params,
          id: target.idGen(method, params),
        });

        if (!error) {
          return result;
        }

        return target.catchE(error);
      }
    }
  })
}

module.exports = client;


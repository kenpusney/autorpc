const {identity, randomId} = require("../common")

const server = ({handlers, wrapE}) => {
  const errorHandler = wrapE || identity;

  const serve = (request) => {
    const {jsonrpc, method, params, id} = request;

    if (Array.isArray(request)) {
      return request.map(serve);
    }

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

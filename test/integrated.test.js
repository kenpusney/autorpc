const {client, server} = require("../index")

const srv = server({
    fuck: ({shit}) => {
      return shit
    }
  })

const clt = client({
  fetch: (request) => srv(request)
})

test("should integrate server and client", () => {
  let result = clt.fuck({shit: 1});

  expect(result).toBe(1)
})

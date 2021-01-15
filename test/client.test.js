const autorpc = require("../client")

const endpoint = autorpc();

test("should successfully run as default", () => {
  expect(endpoint.fuck([123, "abc"])).toStrictEqual({
    method: "fuck",
    params: [123, "abc"],
  });
});

test("should successfully return error when fetch error", () => {
  expect(autorpc({
    fetch: (x) => ({jsonrpc: "2.0", error: {code: 32000, message: "Server Error", data: {}}})
  }).fuck([123, "abc"])).toStrictEqual({code: 32000, message: "Server Error", data: {}})
})

test("should success")

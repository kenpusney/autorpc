
const autorpc=require("../src/index")

const endpoint = autorpc();

test("test", () => {
  expect(endpoint.fuck([123, "abc"])).toStrictEqual({
    jsonrpc: "2.0",
    method: "fuck",
    params: [123, "abc"],
  });
});
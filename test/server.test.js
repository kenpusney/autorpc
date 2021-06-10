
const server = require("../server")

test("server test", () => {
  const result = server({
    fuck: ({ shit }) => {
      return shit;
    }
  })({ jsonrpc: "2.0", method: "fuck", params: { shit: 1 } });


  expect(result.result).toBe(1);
  expect(result.error).toBeUndefined();
  expect(result.id).toBeTruthy()
  expect(result.jsonrpc).toBe("2.0")
})

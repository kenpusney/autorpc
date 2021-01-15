export function identity<T>(x: T) {
  return x;
}

export const randomId = (): string => Math.random().toString().substring(2, 18);

export const sink = (...args: any[]): any => undefined;

export class AutoRPCError {
  code: number
  message: string
  data: any

  constructor(code: number, message?: string, data: any = undefined) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}

const ensure = (...args: boolean[]) => {
  args.forEach(arg => {
    if (!arg) {
      throw new AutoRPCError(32000, "Assertion failed.")
    }
  })
}

module.exports = {
  identity, randomId, sink, AutoRPCError, ensure
}

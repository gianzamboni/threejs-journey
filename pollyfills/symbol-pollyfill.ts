// https://github.com/microsoft/TypeScript/issues/53461
// symbol-polyfill.ts

export {};
declare global {
  interface SymbolConstructor {
    readonly metadata: unique symbol;
  }
}

(Symbol as any).metadata ??= Symbol.for('Symbol.metadata');
if (typeof Symbol === 'function' && Symbol.metadata) {
  Object.defineProperty(Symbol, 'metadata', {
    value: Symbol.metadata,
    configurable: true,
    enumerable: false,
    writable: false
  });
}
// https://github.com/microsoft/TypeScript/issues/53461
// symbol-polyfill.ts

export {};
declare global {
  interface SymbolConstructor {
    readonly metadata: unique symbol;
  }
}

// Use Object.defineProperty directly instead of assignment since metadata is readonly
if (!(Symbol as SymbolConstructor).metadata) {
  Object.defineProperty(Symbol, 'metadata', {
    value: Symbol.for('Symbol.metadata'),
    configurable: true,
    enumerable: false,
    writable: false
  });
}
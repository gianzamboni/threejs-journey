// https://github.com/microsoft/TypeScript/issues/53461
// symbol-polyfill.ts

export {};
declare global {
  interface SymbolConstructor {
    readonly metadata: unique symbol;
  }
}

(Symbol as any).metadata ??= Symbol.for('Symbol.metadata');

const _metadata = Object.create(null);

if (typeof Symbol === 'function' && Symbol.metadata)
  Object.defineProperty(this, Symbol.metadata, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: _metadata
  });
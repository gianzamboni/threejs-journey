import { expect, describe, it } from 'vitest';

import { pascalCaseToText, textToKebabCase, printable, mergePropertiesPath } from '../text-utils';

describe('pascalCaseToText', () => {
  it('should convert pascal case to text', () => {
    expect(pascalCaseToText('hello-world')).toBe('Hello World');
    expect(pascalCaseToText('test-case')).toBe('Test Case');
    expect(pascalCaseToText('multiple-word-test')).toBe('Multiple Word Test');
  });
});

describe('textToKebabCase', () => {
  it('should convert text to kebab case', () => {
    expect(textToKebabCase('Hello World')).toBe('hello-world');
    expect(textToKebabCase('Test Case')).toBe('test-case');
    expect(textToKebabCase('Multiple Word Test')).toBe('multiple-word-test');
  });
});

describe('printable', () => {
  it('should format camelCase property names', () => {
    expect(printable('camelCase')).toBe('Camel Case');
    expect(printable('thisIsATest')).toBe('This Is A Test');
  });

  it('should handle property paths with dots', () => {
    expect(printable('object.property')).toBe('Object property');
    expect(printable('nested.property.name')).toBe('Nested property name');
  });
});

describe('mergePropertiesPath', () => {
  it('should merge key and path when path is defined', () => {
    expect(mergePropertiesPath('parent', 'child')).toBe('parent.child');
    expect(mergePropertiesPath('object', 'nested.property')).toBe('object.nested.property');
  });

  it('should return only key when path is undefined', () => {
    expect(mergePropertiesPath('key', undefined)).toBe('key');
  });
}); 
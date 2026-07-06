import { describe, expect, it } from 'vitest';
import { formatArrayInput, parseArrayInput } from './arrayInput';

describe('parseArrayInput', () => {
  it('parses comma separated integers', () => {
    expect(parseArrayInput('5, 2, -1, 8')).toEqual({
      values: [5, 2, -1, 8],
      error: ''
    });
  });

  it('parses whitespace and semicolon separated integers', () => {
    expect(parseArrayInput('5 2; -1, 8')).toEqual({
      values: [5, 2, -1, 8],
      error: ''
    });
  });

  it('rejects empty input', () => {
    expect(parseArrayInput('  ')).toEqual({
      values: [],
      error: 'Gib mindestens eine Zahl ein.'
    });
  });

  it('rejects decimal values', () => {
    expect(parseArrayInput('1, 2.5, 3')).toEqual({
      values: [],
      error: '"2.5" ist keine ganze Zahl.'
    });
  });

  it('rejects values outside the supported range', () => {
    expect(parseArrayInput('1, 120, 3')).toEqual({
      values: [],
      error: 'Werte müssen zwischen -99 und 99 liegen.'
    });
  });
});

describe('formatArrayInput', () => {
  it('formats arrays for the input field', () => {
    expect(formatArrayInput([5, 2, -1, 8])).toBe('5, 2, -1, 8');
  });
});

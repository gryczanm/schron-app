import { describe, expect, it } from 'vitest';
import { udzialy } from './udzialy.ts';

describe('udziały w procentach', () => {
  it('liczy proporcje Dostępności ze zbioru', () => {
    expect(udzialy([19579, 7565, 60662])).toEqual([22, 9, 69]);
  });

  it('zawsze sumuje się do 100', () => {
    expect(udzialy([1, 1, 1])).toEqual([34, 33, 33]);
    expect(udzialy([2, 1, 1, 1, 1, 1]).reduce((a, b) => a + b)).toBe(100);
  });

  it('daje zera dla pustego zbioru', () => {
    expect(udzialy([0, 0, 0])).toEqual([0, 0, 0]);
  });
});

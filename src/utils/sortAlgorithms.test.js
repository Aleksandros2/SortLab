import { describe, expect, it } from 'vitest';
import { algorithmMap } from './sortAlgorithms';

const cases = [
  { name: 'empty array', input: [], expected: [] },
  { name: 'single item array', input: [7], expected: [7] },
  { name: 'already sorted array', input: [1, 2, 3, 4, 5], expected: [1, 2, 3, 4, 5] },
  { name: 'reverse sorted array', input: [5, 4, 3, 2, 1], expected: [1, 2, 3, 4, 5] },
  { name: 'duplicate values', input: [4, 2, 4, 1, 2], expected: [1, 2, 2, 4, 4] },
  { name: 'negative values', input: [3, -1, 0, -5, 2], expected: [-5, -1, 0, 2, 3] }
];

const finalStateOf = (steps) => steps[steps.length - 1];

describe.each(Object.entries(algorithmMap))('%s sort', (_name, sort) => {
  it.each(cases)('sorts $name', ({ input, expected }) => {
    const original = [...input];
    const steps = sort(input);
    const finalState = finalStateOf(steps);

    expect(finalState.array).toEqual(expected);
    expect(input).toEqual(original);
    expect(finalState.sorted).toEqual(expected.map((_, index) => index));
    expect(finalState.stats).toEqual(
      expect.objectContaining({
        comparisons: expect.any(Number),
        moves: expect.any(Number),
        steps: expect.any(Number)
      })
    );
  });
});

describe('statistics', () => {
  it('counts Bubble Sort swaps as movements', () => {
    const finalState = finalStateOf(algorithmMap.bubble([2, 1]));

    expect(finalState.array).toEqual([1, 2]);
    expect(finalState.stats.moves).toBe(1);
    expect(finalState.stats.comparisons).toBe(1);
  });

  it('counts Selection Sort swaps as movements', () => {
    const finalState = finalStateOf(algorithmMap.selection([2, 1]));

    expect(finalState.array).toEqual([1, 2]);
    expect(finalState.stats.moves).toBe(1);
    expect(finalState.stats.comparisons).toBe(1);
  });

  it('counts Insertion Sort shifts and inserts as movements', () => {
    const finalState = finalStateOf(algorithmMap.insertion([3, 2, 1]));

    expect(finalState.array).toEqual([1, 2, 3]);
    expect(finalState.stats.moves).toBe(5);
    expect(finalState.stats.comparisons).toBe(3);
  });

  it('does not count unchanged Insertion Sort insert positions as movements', () => {
    const finalState = finalStateOf(algorithmMap.insertion([1, 2, 3]));

    expect(finalState.array).toEqual([1, 2, 3]);
    expect(finalState.stats.moves).toBe(0);
    expect(finalState.stats.comparisons).toBe(2);
  });

  it('counts Quick Sort swaps as movements', () => {
    const finalState = finalStateOf(algorithmMap.quick([2, 1]));

    expect(finalState.array).toEqual([1, 2]);
    expect(finalState.stats.moves).toBe(1);
    expect(finalState.stats.comparisons).toBe(1);
  });

  it('counts Heap Sort swaps as movements', () => {
    const finalState = finalStateOf(algorithmMap.heap([2, 1]));

    expect(finalState.array).toEqual([1, 2]);
    expect(finalState.stats.moves).toBe(1);
    expect(finalState.stats.comparisons).toBe(1);
  });
});

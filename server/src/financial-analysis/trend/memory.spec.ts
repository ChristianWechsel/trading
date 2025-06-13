import { Memory } from './memory';

describe('Memory', () => {
  let memory: Memory<number>;

  beforeEach(() => {
    memory = new Memory<number>();
  });

  it('should return undefined if memory is empty', () => {
    expect(memory.getLast()).toBeUndefined();
  });

  it('should add and return the last item', () => {
    memory.add(1);
    expect(memory.getLast()).toBe(1);
    memory.add(2);
    expect(memory.getLast()).toBe(2);
  });

  it('should clear the memory', () => {
    memory.add(1);
    memory.add(2);
    memory.clear();
    expect(memory.getLast()).toBeUndefined();
  });

  it('should handle multiple types', () => {
    const stringMemory = new Memory<string>();
    stringMemory.add('foo');
    expect(stringMemory.getLast()).toBe('foo');
    stringMemory.add('bar');
    expect(stringMemory.getLast()).toBe('bar');
    stringMemory.clear();
    expect(stringMemory.getLast()).toBeUndefined();
  });

  it('should return the latest n items with getLatest', () => {
    memory.add(1);
    memory.add(2);
    memory.add(3);
    expect(memory.getLatest(2)).toEqual([2, 3]);
    expect(memory.getLatest(1)).toEqual([3]);
    expect(memory.getLatest(5)).toEqual([1, 2, 3]);
    expect(memory.getLatest(0)).toEqual([]);
  });

  it('should return an empty array if getLatest is called on empty memory', () => {
    expect(memory.getLatest(3)).toEqual([]);
  });
});

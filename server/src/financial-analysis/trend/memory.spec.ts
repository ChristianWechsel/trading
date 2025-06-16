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

  describe('getAll', () => {
    it('should return an empty array if memory is empty', () => {
      expect(memory.getAll()).toEqual([]);
    });

    it('should return all items in the memory', () => {
      memory.add(1);
      memory.add(2);
      memory.add(3);
      expect(memory.getAll()).toEqual([1, 2, 3]);
    });

    it('should return a copy of the memory, not a reference', () => {
      memory.add(1);
      memory.add(2);
      const allItems = memory.getAll();
      allItems.push(3); // Modify the returned array
      expect(memory.getAll()).toEqual([1, 2]); // Original memory should be unchanged
    });

    it('should return items in the order they were added', () => {
      memory.add(3);
      memory.add(1);
      memory.add(2);
      expect(memory.getAll()).toEqual([3, 1, 2]);
    });
  });

  describe('findLast', () => {
    it('should return undefined if memory is empty', () => {
      expect(memory.findLast((item) => item === 1)).toBeUndefined();
    });

    it('should return the last item that matches the predicate', () => {
      memory.add(1);
      memory.add(2);
      memory.add(3);
      memory.add(2);
      expect(memory.findLast((item) => item === 2)).toBe(2);
    });

    it('should return the item if only one matches', () => {
      memory.add(1);
      memory.add(2);
      memory.add(3);
      expect(memory.findLast((item) => item === 3)).toBe(3);
    });

    it('should return undefined if no item matches the predicate', () => {
      memory.add(1);
      memory.add(2);
      memory.add(3);
      expect(memory.findLast((item) => item === 4)).toBeUndefined();
    });

    it('should work with complex objects and predicates', () => {
      const objectMemory = new Memory<{ id: number; value: string }>();
      objectMemory.add({ id: 1, value: 'a' });
      objectMemory.add({ id: 2, value: 'b' });
      objectMemory.add({ id: 1, value: 'c' });
      expect(objectMemory.findLast((item) => item.id === 1)).toEqual({
        id: 1,
        value: 'c',
      });
      expect(objectMemory.findLast((item) => item.value === 'b')).toEqual({
        id: 2,
        value: 'b',
      });
      expect(objectMemory.findLast((item) => item.id === 3)).toBeUndefined();
    });
  });
});

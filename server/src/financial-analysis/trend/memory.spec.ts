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
});

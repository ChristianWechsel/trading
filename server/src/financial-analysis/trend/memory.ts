export class Memory<T> {
  private memory: T[] = [];

  clear(): void {
    this.memory = [];
  }
  add(item: T): void {
    this.memory.push(item);
  }
  getLast(): T | undefined {
    return this.memory.length > 0
      ? this.memory[this.memory.length - 1]
      : undefined;
  }
  getLatest(n: number): T[] {
    return this.memory.slice(Math.max(this.memory.length - n, 0));
  }

  getAll(): T[] {
    return [...this.memory];
  }

  findLast(predicate: (item: T) => boolean): T | undefined {
    return this.memory.slice().reverse().find(predicate);
  }
}

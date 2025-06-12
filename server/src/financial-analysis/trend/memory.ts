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
}

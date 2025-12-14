export type StoreUpdate<T> = (value: T) => T;
export type StoreUpdateCallback<T> = (nextValue: T, prevValue: T) => void;

/**
 * Data container allowing for subscription to its updates.
 */
export class Store<T> {
  value: T;
  callbacks = new Set<StoreUpdateCallback<T>>();
  revision = -1;
  constructor(value: T) {
    this.value = value;
  }
  onUpdate(callback: StoreUpdateCallback<T>) {
    this.callbacks.add(callback);

    return () => {
      this.callbacks.delete(callback);
    };
  }
  getValue() {
    return this.value;
  }
  setValue(update: T | StoreUpdate<T>) {
    let prevValue = this.value;
    let nextValue = update instanceof Function ? update(this.value) : update;

    this.value = nextValue;
    this.revision = Math.random();

    for (let callback of this.callbacks) callback(nextValue, prevValue);
  }
}

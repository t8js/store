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
  /**
   * Adds a store value update handler which should be called whenever
   * the store value is updated via `setValue(value)`.
   *
   * Returns an unsubscription function. Once it's invoked, the given
   * `callback` is removed from the store and no longer called when
   * the store is updated.
   */
  onUpdate(callback: StoreUpdateCallback<T>) {
    this.callbacks.add(callback);

    return () => {
      this.callbacks.delete(callback);
    };
  }
  /**
   * Reads the store value.
   */
  getValue() {
    return this.value;
  }
  /**
   * Updates the store value.
   *
   * @param update - A new value or an update function `(value) => nextValue`
   * that returns a new store value based on the current store value.
   */
  setValue(update: T | StoreUpdate<T>) {
    let prevValue = this.value;
    let nextValue = update instanceof Function ? update(this.value) : update;

    this.value = nextValue;
    this.revision = Math.random();

    for (let callback of this.callbacks) callback(nextValue, prevValue);
  }
}

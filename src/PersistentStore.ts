import { Store } from "./Store.ts";

function getStorage(session = false) {
  if (typeof window === "undefined") return;
  return session ? sessionStorage : localStorage;
}

export type PersistentStoreOptions<T> = {
  session?: boolean;
  serialize?: (value: T) => string;
  deserialize?: (serializedValue: string, currentValue?: T) => T;
};

/**
 * Container for data persistent across page reloads, allowing for
 * subscription to its updates.
 */
export class PersistentStore<T> extends Store<T> {
  storageKey: string;
  options: PersistentStoreOptions<T> | undefined;
  synced = false;
  /**
   * Creates an instance of the container for data persistent across page
   * reloads.
   *
   * The store data is saved to and restored from the given `storageKey`
   * either of `localStorage` (by default) or `sessionStorage` (if `options.session`
   * is set to `true`). Interaction with the browser storage is skipped in
   * non-browser environments.
   *
   * @example
   * ```js
   * let counterStore = new PersistentStore(0, "counter");
   * ```
   *
   * The way data gets saved to and restored from a browser storage entry
   * (including filtering out certain data or otherwise rearranging the
   * saved data) can be overridden by setting `options.serialize` and
   * `options.deserialize`. By default, these options act like `JSON.stringify()`
   * and `JSON.parse()` respectively.
   */
  constructor(
    value: T,
    storageKey: string,
    options?: PersistentStoreOptions<T>,
  ) {
    super(value);

    this.storageKey = storageKey;
    this.options = {
      session: false,
      serialize: (value: T) => JSON.stringify(value),
      deserialize: (serializedValue: string) => JSON.parse(serializedValue) as T,
      ...options,
    };

    this.onUpdate(() => {
      if (this.synced) this.save();
    });
  }
  /**
   * Saves the store value to the browser storage.
   */
  save() {
    let storage = getStorage(this.options?.session);
    let serialize = this.options?.serialize;

    if (this.synced && storage && typeof serialize === "function") {
      try {
        storage.setItem(this.storageKey, serialize(this.value));
      } catch {}
    }
  }
  /**
   * Signals the store to read the value from the browser storage. If the
   * value is not yet present in the browser storage, the current store
   * value is saved to the browser storage.
   */
  sync() {
    let storage = getStorage(this.options?.session);
    let deserialize = this.options?.deserialize;
    let serializedValue: string | null = null;

    if (storage && typeof deserialize === "function") {
      try {
        serializedValue = storage.getItem(this.storageKey);

        if (serializedValue !== null)
          this.setValue(deserialize(serializedValue, this.value));
      } catch {}
    }

    if (!this.synced) {
      this.synced = true;

      if (serializedValue === null) this.save();
    }
  }
  /**
   * Signals the store to read the value from the browser storage once,
   * disregarding subsequest `syncOnce()` calls.
   */
  syncOnce() {
    if (!this.synced) this.sync();
  }
}

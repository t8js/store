import { Store } from "./Store.ts";

function getStorage(session = false) {
  if (typeof window === "undefined") return;
  return session ? sessionStorage : localStorage;
}

export type PersistentStoreOptions<T> = {
  session?: boolean;
  serialize?: (data: T) => string;
  deserialize?: (serializedState: string, currentState?: T) => T;
};

/**
 * Container for data persistent across page reloads, offering
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
   * `options.deserialize`. By default, they are `JSON.stringify()` and
   * `JSON.parse()`.
   */
  constructor(
    data: T,
    storageKey: string,
    options?: PersistentStoreOptions<T>,
  ) {
    super(data);

    this.storageKey = storageKey;
    this.options = {
      session: false,
      serialize: (data: T) => JSON.stringify(data),
      deserialize: (content: string) => JSON.parse(content) as T,
      ...options,
    };

    this.onUpdate(() => {
      if (this.synced) this.save();
    });
  }
  /**
   * Saves the store state value to the browser storage.
   */
  save() {
    let storage = getStorage(this.options?.session);
    let serialize = this.options?.serialize;

    if (this.synced && storage && typeof serialize === "function") {
      try {
        storage.setItem(this.storageKey, serialize(this.state));
      } catch {}
    }
  }
  /**
   * Signals the store to read the state value from the browser storage.
   */
  sync() {
    let storage = getStorage(this.options?.session);
    let deserialize = this.options?.deserialize;
    let serializedState: string | null = null;

    if (storage && typeof deserialize === "function") {
      try {
        serializedState = storage.getItem(this.storageKey);

        if (serializedState !== null)
          this.setState(deserialize(serializedState, this.state));
      } catch {}
    }

    if (!this.synced) {
      this.synced = true;

      if (serializedState === null) this.save();
    }
  }
  /**
   * Signals the store to read the state value from the browser storage once,
   * disregarding subsequest `syncOnce()` calls.
   */
  syncOnce() {
    if (!this.synced) this.sync();
  }
}

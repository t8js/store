import { Store } from "./Store.ts";

function getStorage(session: boolean) {
  if (typeof window === "undefined") return;
  return session ? sessionStorage : localStorage;
}

/**
 * Container for data persistent across page reloads, offering
 * subscription to its updates.
 */
export class PersistentStore<T> extends Store<T> {
  storageKey: string;
  session: boolean;
  synced = false;
  /**
   * Creates an instance of the container for data persistent across page
   * reloads.
   * 
   * The store data is saved to and restored from the given `storageKey`
   * either of `localStorage` if the `session` parameter is `false` (which is
   * the default), or of `sessionStorage` if `session` is set to `true`.
   * Interaction with the browser storage is skipped in non-browser environments.
   *
   * @example
   * ```js
   * let counterStore = new PersistentStore(0, "counter");
   * ```
   */
  constructor(data: T, storageKey: string, session = false) {
    super(data);

    this.storageKey = storageKey;
    this.session = session;

    this.onUpdate(() => {
      if (this.synced) this.save();
    });
  }
  /**
   * Saves the store state value to the browser storage.
   */
  save() {
    let storage = getStorage(this.session);

    if (this.synced && storage) {
      try {
        storage.setItem(this.storageKey, JSON.stringify(this.state));
      } catch {}
    }
  }
  /**
   * Signals the store to read the state value from the browser storage.
   */
  sync() {
    let storage = getStorage(this.session);
    let rawState: string | null = null;

    if (storage) {
      try {
        rawState = storage.getItem(this.storageKey);

        if (rawState !== null) this.setState(JSON.parse(rawState) as T);
      } catch {}
    }

    if (!this.synced) {
      this.synced = true;

      if (rawState === null) this.save();
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

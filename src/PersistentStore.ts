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

    let inited = false;

    let sync = (state: T) => {
      let storage = getStorage(session);
      let rawState: string | null = null;

      if (storage) {
        try {
          rawState = storage.getItem(storageKey);

          if (rawState !== null) this.setState(JSON.parse(rawState) as T);
        } catch {}
      }

      if (!inited) {
        inited = true;

        if (rawState === null) write(state);
      }
    }

    let write = (state: T) => {
      let storage = getStorage(session);

      if (inited && storage) {
        try {
          storage.setItem(storageKey, JSON.stringify(state));
        } catch {}
      }
    }

    this.on("sync", sync);
    this.once("synconce", sync);
    this.on("update", write);
  }
  /**
   * Signals the store to read the state value from the browser storage.
   */
  sync() {
    this.emit("sync");
  }
  /**
   * Signals the store to read the state value from the browser storage once,
   * disregarding subsequest `syncOnce()` calls.
   */
  syncOnce() {
    this.emit("synconce");
  }
}

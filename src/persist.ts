import type { Store } from "./Store.ts";

function getStorage(session: boolean) {
  if (typeof window === "undefined") return;
  return session ? sessionStorage : localStorage;
}

/**
 * Allows to make the given `store`'s state persistent across page reloads.
 *
 * The store state is saved to and restored from the given `storageKey`
 * either of `localStorage` if the `session` parameter is `false` (which is
 * the default), or of `sessionStorage` if `session` is set to `true`.
 * Interaction with the browser storage is skipped in non-browser environments.
 *
 * Returns the original store.
 *
 * @example
 * ```js
 * let counterStore = persist(new Store(0), "counter");
 * counterStore.emit("sync"); // signals to read from localStorage now
 * ```
 */
export function persist<T>(
  store: Store<T>,
  storageKey: string,
  session = false,
) {
  let inited = false;

  function sync(state: T) {
    let storage = getStorage(session);
    let rawState: string | null = null;

    if (storage) {
      try {
        rawState = storage.getItem(storageKey);

        if (rawState !== null) store.setState(JSON.parse(rawState) as T);
      } catch {}
    }

    if (!inited) {
      inited = true;

      if (rawState === null) write(state);
    }
  }

  function write(state: T) {
    let storage = getStorage(session);

    if (inited && storage) {
      try {
        storage.setItem(storageKey, JSON.stringify(state));
      } catch {}
    }
  }

  store.on("sync", sync);
  store.once("effect", sync);
  store.on("update", write);

  return store;
}

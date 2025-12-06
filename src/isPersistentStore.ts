import { isStore } from "./isStore.ts";
import type { PersistentStore } from "./PersistentStore.ts";

export function isPersistentStore<T>(x: unknown): x is PersistentStore<T> {
  return isStore(x) && "sync" in x;
}

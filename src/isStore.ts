import type { Store } from "./Store.ts";

/**
 * Replaces the `instanceof Store` check which can lead to a
 * false negative when the `Store` class comes from different
 * package dependencies.
 */
export function isStore<T>(x: unknown): x is Store<T> {
  return (
    x !== null &&
    typeof x === "object" &&
    "on" in x &&
    typeof x.on === "function" &&
    "getState" in x &&
    typeof x.getState === "function" &&
    "setState" in x &&
    typeof x.setState === "function"
  );
}

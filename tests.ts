import { isStore, Store } from ".";

let testIndex = 0;

function assert(value: unknown, expectedValue: unknown) {
  let valid = JSON.stringify(value) === JSON.stringify(expectedValue);

  console.log(`000${++testIndex}`.slice(-3), valid ? "PASSED" : "FAILED");

  if (!valid) throw new Error(`Expected ${expectedValue}, got ${value}.`);
}

let store = new Store(10);

let testValue = [100, -3];
let unsubscribe = [
  store.onUpdate((state) => {
    testValue[0] += state;
  }),
  store.onUpdate((state) => {
    testValue[1] *= state;
  }),
];

assert(isStore(store), true);
assert(isStore({}), false);

assert(store.getState(), 10);
assert(store.callbacks.length, 2);

store.setState(2);
assert(store.getState(), 2);
assert(testValue[0], 102);
assert(testValue[1], -6);

store.setState(-25);
assert(store.getState(), -25);
assert(testValue[0], 77);
assert(testValue[1], 150);

unsubscribe[1]();
assert(store.callbacks.length, 1);

store.setState(12);
assert(store.getState(), 12);
assert(testValue[0], 89);
assert(testValue[1], 150);

console.log();
console.log("PASSED");

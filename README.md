# T8 Store

A lightweight data container allowing for subscription to its updates

[![npm](https://img.shields.io/npm/v/@t8/store?labelColor=345&color=46e)](https://www.npmjs.com/package/@t8/store) ![Lightweight](https://img.shields.io/bundlephobia/minzip/@t8/store?label=minzip&labelColor=345&color=46e)

This package exports two classes: `Store` and its subclass `PersistentStore`. A `Store` object is a thin container for data of arbitrary type, exposing methods to get and set the contained value and allowing to subscribe to its value updates. It can be used as a data storage, or state, shared by multiple independent parts of code that need to be notified when the data gets updated. `PersistentStore` is a version of `Store` enchanced to make the contained value persistent across page reloads via `localStorage` or `sessionStorage`.

Stores can be used as shared state with libraries like React, see [React Store](https://github.com/t8js/react-store) exposing a ready-to-use hook for shared state management.

Installation: `npm i @t8/store`

## Initialization

Stores accept data of any kind.

```js
import { Store } from "@t8/store";

// With a primitive value
let store1 = new Store(0);

// With a nonprimitive value
let store2 = new Store({ counter: 0 });
```

Similarly to instances of the built-in data container classes, such as `Set` and `Map`, stores are created as `new Store(value)` rather than with a factory function.

## Value manipulation

The store value can be read and updated with `getValue()` and `setValue(update)`. `setValue(update)` accepts either a new value or a function `(value) => nextValue` that returns a new store value based on the current store value.

```js
let store = new Store({ counter: 0 });

let value = store.getValue();
console.log(value.counter); // 0

store.setValue({ counter: 100 });
console.log(value.counter); // 100

store.setValue((value) => ({ ...value, counter: value.counter + 1 }));
console.log(value.counter); // 101
```

## Subscription to updates

A callback passed to the `onUpdate(callback)` method is called each time the store value is updated via `setValue(value)`.

```js
let unsubscribe = store.onUpdate((nextValue, prevValue) => {
  console.log(nextValue, prevValue);
});
```

`onUpdate(callback)` returns an unsubscription function. Once it's invoked, the given `callback` is removed from the store and no longer called when the store is updated.

## Persistence across page reloads

```js
import { PersistentStore } from "@t8/store";

let counterStore = new PersistentStore(0, "counter");
```

Whenever updated, `counterStore` above will save its value to the `"counter"` key of `localStorage`. (Pass `{ session: true }` as the third parameter of `new PersistentStore()` to use `sessionStorage` instead of `localStorage`.)

The following call signals the store to read the value from the browser storage, which can be used once or multiple times after creating the store:

```js
counterStore.sync();
```

If it's desirable to sync a store with the browser storage just once regardless of the number of sync calls (coming from multiple independent parts of the code, for example), `syncOnce()` calls can be used instead:

```js
counterStore.syncOnce(); // Syncs once disregarding subsequent syncOnce() calls
```

The way the store value gets saved to and restored from a browser storage entry (including filtering out certain data or otherwise rearranging the saved data) can be redefined by setting `options.serialize` and `options.deserialize` in `new PersistentStore(value, storageKey, options)`. By default, these options act like `JSON.stringify()` and `JSON.parse()` respectively.

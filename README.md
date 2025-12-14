# T8 Store

A lightweight data container allowing for subscription to its updates

[![npm](https://img.shields.io/npm/v/@t8/store?labelColor=345&color=46e)](https://www.npmjs.com/package/@t8/store) ![Lightweight](https://img.shields.io/bundlephobia/minzip/@t8/store?label=minzip&labelColor=345&color=46e)

This package exports two classes: `Store` and its subclass `PersistentStore`. A `Store` object is a thin container for data of arbitrary type, exposing methods to get and set the contained value and allowing to subscribe to its value updates. It can be used as a data storage, or state, shared by multiple independent parts of code that need to be notified when the data gets updated. `PersistentStore` is a version of `Store` enchanced to make the contained value persistent across page reloads via `localStorage` or `sessionStorage`.

Stores can be used as shared state with libraries like React, see [React Store](https://github.com/t8js/react-store) exposing a ready-to-use hook for shared state management.

Installation: `npm i @t8/store`

## Initialization

```js
import { Store } from "@t8/store";

let store = new Store({ counter: 0 });
```

Similarly to instances of the built-in data container classes, such as `Set` and `Map`, stores are created as `new Store(data)` rather than with a factory function.

## Value manipulation

```js
let store = new Store({ counter: 0 });

let state = store.getState();
console.log(state.counter); // 0

store.setState({ counter: 100 });
console.log(state.counter); // 100

store.setState(state => ({ ...state, counter: state.counter + 1 }));
console.log(state.counter); // 101
```

## Subscription to updates

```js
let unsubscribe = store.onUpdate((nextState, prevState) => {
  console.log(nextState, prevState);
});

unsubscribe();
```

## Persistence across page reloads

```js
import { PersistentStore } from "@t8/store";

let counterStore = new PersistentStore(0, "counter");
```

Whenever updated, `counterStore` above will save its state to the `"counter"` key of `localStorage`. (Pass `{ session: true }` as the third parameter of `new PersistentStore()` to use `sessionStorage` instead of `localStorage`.)

The following call signals the store to read the state value from the browser storage, which can be used once or multiple times during the app session:

```js
counterStore.sync();
```

If it's desirable to sync a store just once regardless of the number of sync calls (that might come from multiple independent parts of the app), `syncOnce()` calls can be used instead:

```js
counterStore.syncOnce(); // Syncs once disregarding subsequent syncOnce() calls
```

The way data gets saved to and restored from a browser storage entry (including filtering out certain data or otherwise rearranging the saved data) can be redefined by setting `options.serialize` and `options.deserialize` in `new PersistentStore(data, storageKey, options)`. By default, these options act like `JSON.stringify()` and `JSON.parse()` respectively.

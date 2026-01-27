# T8 Store

A lightweight data container allowing for subscription to its updates

<!-- docsgen-show-start --
## Store
-- docsgen-show-end -->

An instance of the `Store` class exported from this package is a thin container for data of arbitrary type, exposing methods to get and set the contained value and allowing to subscribe to its value updates. It can be used as a data storage, or state, shared by multiple independent parts of code that need to be notified when the data gets updated.

Stores can be used as state shared across application components with libraries like React. See [T8 React Store](https://github.com/t8js/react-store) exposing a ready-to-use hook for shared state management.

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

store.setValue({ counter: 100 });
store.setValue((value) => ({ ...value, counter: value.counter + 1 }));

let value = store.getValue();
console.log(value.counter); // 101
```

## Subscription to updates

Each time the store value is updated via `setValue(value)` the store emits an `"update"` event allowing for subscriptions:

```js
let unsubscribe = store.on("update", ({ current, previous }) => {
  console.log(current, previous);
});
```

Each subscription returns an unsubscription function. Once it's invoked, the given `callback` is removed from the store and no longer called when the store is updated.

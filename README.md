# T8 Store

*Vanilla JS/TS data store offering subscription to its updates*

[![npm](https://img.shields.io/npm/v/@t8/store?labelColor=345&color=46e)](https://www.npmjs.com/package/@t8/store) ![Lightweight](https://img.shields.io/bundlejs/size/@t8/store?label=minzip&labelColor=345&color=46e)

Installation: `npm i @t8/store`

## Initialization

```js
import { Store } from "@t8/store";

let store = new Store({ counter: 0 });
```

🔹 Similarly to instances of the built-in data container classes, such as `Set` and `Map`, stores are created as `new Store(data)` rather than with a factory function.

## Manipulation

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

<!-- docsgen-hide-start -->
## Related

[React Store](https://github.com/t8js/react-store)
<!-- docsgen-hide-end -->

export type StoreStateUpdate<T> = (state: T) => T;
export type StoreUpdateCallback<T> = (nextState: T, prevState: T) => void;

export class Store<T> {
  state: T;
  callbacks = new Set<StoreUpdateCallback<T>>();
  revision = -1;
  constructor(data: T) {
    this.state = data;
  }
  onUpdate(callback: StoreUpdateCallback<T>) {
    this.callbacks.add(callback);

    return () => {
      this.callbacks.delete(callback);
    };
  }
  getState() {
    return this.state;
  }
  setState(update: T | StoreStateUpdate<T>) {
    let prevState = this.state;
    let nextState = update instanceof Function ? update(this.state) : update;

    this.state = nextState;
    this.revision = Math.random();

    for (let callback of this.callbacks) callback(nextState, prevState);
  }
}

export type StoreStateUpdate<T> = (state: T) => T;
export type StoreUpdateCallback<T> = (nextState: T, prevState: T) => void;

export class Store<T> {
  state: T;
  callbacks: StoreUpdateCallback<T>[] = [];
  revision = -1;
  constructor(data: T) {
    this.state = data;
  }
  onUpdate(callback: StoreUpdateCallback<T>) {
    this.callbacks.push(callback);

    return () => {
      for (let i = this.callbacks.length - 1; i >= 0; i--) {
        if (this.callbacks[i] === callback) this.callbacks.splice(i, 1);
      }
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

export type StoreStateUpdate<T> = (state: T) => T;
export type StoreEventCallback<T> = (nextState: T, prevState: T) => void;

export class Store<T> {
  state: T;
  callbacks: Record<string, Set<StoreEventCallback<T>>> = {};
  revision = -1;
  constructor(data: T) {
    this.state = data;
  }
  on(event: string, callback: StoreEventCallback<T>) {
    (this.callbacks[event] ??= new Set()).add(callback);

    return () => {
      this.off(event, callback);
    };
  }
  off(event: string, callback: StoreEventCallback<T>) {
    this.callbacks[event]?.delete(callback);
  }
  once(event: string, callback: StoreEventCallback<T>) {
    let oneTimeCallback: StoreEventCallback<T> = (nextState, prevState) => {
      this.off(event, oneTimeCallback);
      callback(nextState, prevState);
    };

    return this.on(event, oneTimeCallback);
  }
  emit(event: string, nextState?: T, prevState?: T) {
    let eventCallbacks = this.callbacks[event];

    if (eventCallbacks) {
      for (let callback of eventCallbacks)
        callback(nextState ?? this.state, prevState ?? this.state);
    }
  }
  getState() {
    return this.state;
  }
  setState(update: T | StoreStateUpdate<T>) {
    let prevState = this.state;
    let nextState = update instanceof Function ? update(this.state) : update;

    this.state = nextState;
    this.revision = Math.random();

    this.emit("update", nextState, prevState);
  }
}

import { useMemo } from "react";
import { AppProps } from "next/app";
import { applyMiddleware, createStore, Store } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import reducers from "./items";

let store: Store | undefined;

function initStore(initState: Record<string, unknown>): Store {
  return createStore(reducers, initState, composeWithDevTools(applyMiddleware(thunk)));
}

export const initializeStore = (preloadState: any = {}) => {
  let _store = store ?? initStore(preloadState);

  if (preloadState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadState,
    });

    store = undefined;
  }

  if (typeof window === "undefined") return _store;
  if (!store) store = _store;

  return _store;
};

export function useStore(initState: AppProps) {
  const store = useMemo(() => initializeStore(initState), [initState]);

  return store;
}

import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers/index";

const initState = {};

const store = createStore(rootReducer, initState, composeWithDevTools(applyMiddleware(thunk)));

export default store;

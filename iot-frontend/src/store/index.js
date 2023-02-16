import {applyMiddleware, createStore} from "redux";
import {logger} from "redux-logger";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "../reducers";
import {persistReducer, persistStore} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "root",
  storage,
}

const middleware = [thunk];
if (process.env.REACT_APP_NODE_ENV === "dev") {
  middleware.push(logger);
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middleware))
)

export const persistor = persistStore(store)
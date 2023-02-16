import { applyMiddleware, createStore } from 'redux'
import { logger } from 'redux-logger'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from '../reducers'

const middleware = [thunk]
if (process.env.REACT_APP_NODE_ENV === 'dev') {
  middleware.push(logger)
}

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
)

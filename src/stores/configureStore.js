import { compose, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from 'reducers';

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunkMiddleware),
      window.devToolsExtension
        ? window.devToolsExtension()
        : f => f
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('reducers', () => {
      const nextRootReducer = require('reducers').default; // eslint-disable-line global-require

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

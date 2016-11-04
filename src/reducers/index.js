import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

function placeHolder(state = {}, action) {
  switch (action.type) {
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  placeHolder,
  routing: routerReducer,
});

export default rootReducer;

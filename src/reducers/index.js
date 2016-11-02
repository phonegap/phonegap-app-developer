import { combineReducers } from 'redux';

function placeHolder(state = {}, action) {
  switch (action.type) {
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  placeHolder,
});

export default rootReducer;

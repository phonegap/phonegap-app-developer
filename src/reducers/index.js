import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

function pgbReducer(state = {}, action) {
  console.log(action.type);
  switch (action.type) {
  	case 'PGB_LOGIN_RECEIVED':
  		return Object.assign({}, state, {
        access_token: action.access_token
      });
    case 'PGB_APPS_RECEIVED':
      return Object.assign({}, state, {
        apps: action.apps
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  pgbReducer,
  routing: routerReducer,
});

export default rootReducer;

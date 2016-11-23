import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

function pbg(state = {
  loading: false,
  apps: {
    apps: [],
  },
}, action) {
  //console.log(action.type);
  switch (action.type) {
    case 'PGB_LOGIN_REQUESTED':
      console.log('PGB_LOGIN_REQUESTED');
      return {
        ...state,
        loading: true,
      };
    case 'PGB_LOGIN_RECEIVED':
      console.log('PGB_LOGIN_RECEIVED');
      return {
        ...state,
        loading: false,
        accessToken: action.accessToken,
      };
    case 'PGB_APPS_REQUESTED':
      console.log('PGB_APPS_REQUESTED');
      return {
        ...state,
        loading: true,
      };
    case 'PGB_APPS_RECEIVED':
      console.log('PGB_APPS_RECEIVED');
      return {
        ...state,
        loading: false,
        apps: action.apps,
      };
    default:
      if (action.type.indexOf('PGB_') > -1) {
        console.log('Uncaught action: ', action.type);
      }
      return state;
  }
}

const rootReducer = combineReducers({
  pbg,
  routing: routerReducer,
});

export default rootReducer;

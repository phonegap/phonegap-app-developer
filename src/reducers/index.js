import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

function pgb(state = {
  loading: false,
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
    case 'PGB_CREATE_APP_REQUESTED':
      console.log('PGB_CREATE_APP_REQUESTED');
      return {
        ...state,
        loading: true,
      };
    case 'PGB_CREATE_APP_RECEIVED':
      console.log('PGB_CREATE_APP_RECEIVED');
      return {
        ...state,
        loading: false,
      };
    case 'PGB_PLUGIN_ANALYSIS_REQUESTED':
      console.log('PGB_PLUGIN_ANALYSIS_REQUESTED');
      return {
        ...state,
        loading: true,
      };
    case 'PGB_PLUGIN_ANALYSIS_RECEIVED':
      console.log('PGB_PLUGIN_ANALYSIS_RECEIVED', action);
      return {
        ...state,
        loading: false,
        plugins: action.plugins,
      };
    case 'PGB_CHECK_PHONEGAP_VERSION':
      console.log('PGB_CHECK_PHONEGAP_VERSION', action);
      return {
        ...state,
        loading: false,
        result: action.state,
      };
    default:
      if (action.type.indexOf('PGB_') > -1) {
        console.log('Uncaught action: ', action.type);
      }
      return state;
  }
}

const rootReducer = combineReducers({
  pgb,
  routing: routerReducer,
});

export default rootReducer;

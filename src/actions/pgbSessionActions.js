export function pgbLoginRequested() {
  return {
    type: 'PGB_LOGIN_REQUESTED',
  };
}

export function pgbLoginReceived(accessToken) {
  return {
    type: 'PGB_LOGIN_RECEIVED',
    accessToken,
  };
}

export function pgbLogoutRequested(accessToken) {
  return {
    type: 'PGB_LOGOUT_REQUESTED',
    accessToken,
  };
}

export function pgbLogoutReceived() {
  return {
    type: 'PGB_LOGOUT_RECEIVED',
  };
}

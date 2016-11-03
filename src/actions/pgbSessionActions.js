export function pgbLogin() {
  return {
    type: 'PGB_LOGIN',
  };
}

export function pgbLogout(session) {
  return {
    type: 'PGB_LOGOUT',
    session,
  };
}

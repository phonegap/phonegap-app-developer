/* eslint-disable import/no-extraneous-dependencies */
import expect from 'expect';

import * as actions from './pgbSessionActions';

const mockAccessToken = '1234abcd';

describe('pgb session actions', () => {
  it('should create a PGB_LOGIN_REQUESTED action', () => {
    const expectedAction = {
      type: 'PGB_LOGIN_REQUESTED',
    };
    expect(actions.pgbLoginRequested()).toEqual(expectedAction);
  });
  it('should create a PGB_LOGGED_OUT action with an access_token', () => {
    const expectedAction = {
      type: 'PGB_LOGGED_OUT',
    };
    expect(actions.pgbLoggedOut()).toEqual(expectedAction);
  });
});

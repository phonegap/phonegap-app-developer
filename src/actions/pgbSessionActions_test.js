/* eslint-disable import/no-extraneous-dependencies */
import expect from 'expect';

import * as actions from './pgbSessionActions';

describe('pgb session actions', () => {
  it('should create a LOGIN action', () => {
    const expectedAction = {
      type: 'PGB_LOGIN',
    };
    expect(actions.pgbLogin()).toEqual(expectedAction);
  });
  it('should create a LOGOUT action', () => {
    const expectedAction = {
      type: 'PGB_LOGOUT',
      session: '1234abcd',
    };
    expect(actions.pgbLogout('1234abcd')).toEqual(expectedAction);
  });
});

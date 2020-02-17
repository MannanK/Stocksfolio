import * as SessionAPIUtil from '../util/session_api_util';

export const RECEIVE_CURRENT_USER = "RECEIVE_CURRENT_USER";
export const LOGOUT_CURRENT_USER = "LOGOUT_CURRENT_USER";
export const RECEIVE_SESSION_ERRORS = "RECEIVE_SESSION_ERRORS";
export const DELETE_SESSION_ERRORS = "DELETE_SESSION_ERRORS";

const receiveCurrentUser = user => ({
  type: RECEIVE_CURRENT_USER,
  user
});

const logoutCurrentUser = () => ({
  type: LOGOUT_CURRENT_USER
});

const receiveSessionErrors = errors => ({
  type: RECEIVE_SESSION_ERRORS,
  errors
});

export const deleteSessionErrors = () => ({
  type: DELETE_SESSION_ERRORS
});

export const signup = user => dispatch => (
  SessionAPIUtil.signup(user).then(
    user => dispatch(receiveCurrentUser(user)),
    res => dispatch(receiveSessionErrors(res.responseJSON))
  )
);

export const login = user => dispatch => (
  SessionAPIUtil.login(user).then(
    user => dispatch(receiveCurrentUser(user)),
    res => dispatch(receiveSessionErrors(res.responseJSON))
  )
);

export const logout = () => dispatch => (
  SessionAPIUtil.logout().then(
    () => dispatch(logoutCurrentUser()),
    res => dispatch(receiveSessionErrors(res.responseJSON))
  )
);
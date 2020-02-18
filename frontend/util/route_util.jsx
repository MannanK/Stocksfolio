import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const Auth = ({ component: Component, path, loggedIn, exact, ...rest }) => (
  <Route
    path={path}
    exact={exact}
    {...rest}
    // show this component only if the user is currently not logged in
    // otherwise, redirect them to the portfolio page
    // ...rest allows for other props to be passed into the route
    render={props => !loggedIn ? <Component {...props} {...rest} /> : <Redirect to="/portfolio" />}
  />
);

const Protected = ({ component: Component, path, loggedIn, exact, ...rest }) => {
  return (
    <Route
      path={path}
      exact={exact}
      {...rest}
      // show this component only if the user is currently logged in
      // otherwise, redirect them to the login page
      // ...rest allows for other props to be passed into the route
      render={props => loggedIn ? <Component {...props} {...rest} /> : <Redirect to="/login" />}
    />
  );
};

const mapStateToProps = (state) => {
  // if a currentUserId exists in the session slice of state, loggedIn should
    // be set equal to true; false otherwise
  return { loggedIn: Boolean(state.session.currentUserId) };
};

export const AuthRoute = withRouter(connect(mapStateToProps)(Auth));
export const ProtectedRoute = withRouter(connect(mapStateToProps)(Protected));
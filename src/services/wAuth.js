import { Redirect, Route } from 'react-router-dom';
import { isAdmin, isAuthenticated } from './auth';

export const PrivateRouteAdmin = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => (
      isAdmin()
        ?
        <Component {...props} />
        :
        <Redirect to="/admin" />
    )} />
  );
};

export const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => (
      isAuthenticated()
        ?
        <Component {...props} />
        :
        <Redirect to="/login" />
    )} />
  );
};

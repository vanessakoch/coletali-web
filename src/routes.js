import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Dashboard from './pages/Admin/Dashboard';
import Login from './pages/Login';
import ListPoint from './pages/ListPoint';
import CreatePoint from './pages/CreatePoint';
import PointDetail from './pages/PointDetail';

import User from './pages/Admin/User';
import InsertUser from './pages/Admin/User/InsertUser';
import AdminEditUser from './pages/Admin/User/EditUser';

import Donation from './pages/Admin/Donation';
import InsertDonation from './pages/Admin/Donation/InsertDonation';

import Collect from './pages/Admin/Collect';
import InsertCollect from './pages/Admin/Collect/InsertCollect';
import LoginAdmin from './pages/Admin/Login';

import { PrivateRoute, PrivateRouteAdmin } from './services/wAuth';
import EditCollect from './pages/EditCollect';
import AdminEditDonation from './pages/Admin/Donation/EditDonation';
import AdminEditCollect from './pages/Admin/Collect/EditCollect';
import EditDonate from './pages/EditDonate';
import SignUp from './pages/SignUp';
import EditUser from './pages/EditUser';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Landing} />
        <Route path="/app" component={Home} />
        <Route path="/login" exact component={Login} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="/collect/:id" component={PointDetail} />
        <Route path="/donate/:id" component={PointDetail} />
        <PrivateRoute path="/point/create" component={CreatePoint} />
        <PrivateRoute path="/point/list" component={ListPoint} />
        
        <PrivateRoute path="/edit/collect/:id" exact component={EditCollect} />
        <PrivateRoute path="/edit/donate/:id" component={EditDonate} />
        <PrivateRoute path="/profile/:id" component={EditUser} />

        <Route path="/admin" exact component={LoginAdmin} />
        <PrivateRouteAdmin path="/admin/dashboard" component={Dashboard} />

        <PrivateRouteAdmin path="/admin/user" exact component={User} />
        <PrivateRouteAdmin path="/admin/user/insert" exact component={InsertUser} />
        <PrivateRouteAdmin path="/admin/user/edit/:id" exact component={AdminEditUser} />

        <PrivateRouteAdmin path="/admin/donate" exact component={Donation} />
        <PrivateRouteAdmin path="/admin/donate/insert" component={InsertDonation} />
        <PrivateRouteAdmin path="/admin/donate/edit/:id" component={AdminEditDonation} />

        <PrivateRouteAdmin path="/admin/collect" exact component={Collect} />
        <PrivateRouteAdmin path="/admin/collect/insert" component={InsertCollect} />
        <PrivateRouteAdmin path="/admin/collect/edit/:id" component={AdminEditCollect} />

      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
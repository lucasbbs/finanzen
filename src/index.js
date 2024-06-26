/*!

=========================================================
* Black Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import axios from 'axios';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import AuthLayout from 'layouts/Auth/Auth.js';
import AdminLayout from 'layouts/Admin/Admin.js';
import VerifyLayout from 'layouts/Verify/Verify.js';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'assets/css/nucleo-icons.css';
import 'react-notification-alert/dist/animate.css';
import 'assets/scss/black-dashboard-pro-react.scss?v=1.2.0';
import 'assets/demo/demo.css';
import {
  hasRestoredLogin,
  isAuthenticated,
  isFirtAccess,
} from './services/auth';
import { GlobalProvider } from './context/GlobalState';
import registerServiceWorker from 'registerServiceWorker';

// axios.defaults.withCredentials = true;

const PrivateRoute = ({ component: Component, ...rest }) => {
  useEffect(() => {
    // Implementar aqui o Remember me login
  }, []);

  const alreadyLoaded = sessionStorage.getItem('alreadyLoaded');
  useEffect(() => {
    const alreadyLoaded = sessionStorage.getItem('alreadyLoaded');
    if (!alreadyLoaded) {
      const getUserInfo = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        let config;
        if (userInfo)
          config = {
            headers: { Authorization: `Bearer ${userInfo?.token}` },
          };
        const address = process.env.REACT_APP_SERVER_ADDRESS;
        const { data } = await axios.get(
          `${address}/api/users/profile`,
          config
        );

        Object.assign(userInfo, data);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
      };
      getUserInfo();

      sessionStorage.setItem('alreadyLoaded', true);
    }
  }, []);

  return (
    <Route
      key={Date.now()}
      {...rest}
      render={(props) =>
        isAuthenticated() ? (
          isFirtAccess() ? (
            <Redirect
              to={{
                pathname: '/auth/first-access',
                // state: { from: props.location },
              }}
            />
          ) : hasRestoredLogin() ? (
            <Redirect
              to={{
                pathname: '/auth/restore-access',
                // state: { from: props.location },
              }}
            />
          ) : (
            <Component {...props} />
          )
        ) : (
          <Redirect
            to={{ pathname: '/auth/login', state: { from: props.location } }}
          />
        )
      }
    />
  );
};

ReactDOM.render(
  <GlobalProvider>
    <BrowserRouter>
      <Switch>
        <PrivateRoute
          path='/admin'
          component={(props) => <AdminLayout {...props} />}
        />
        <Route path='/auth' render={(props) => <AuthLayout {...props} />} />
        <Route
          path='/verify/users/:token'
          render={(props) => <VerifyLayout {...props} />}
        />
        <Redirect from='/' to='/admin/dashboard' />
      </Switch>
    </BrowserRouter>
  </GlobalProvider>,
  document.getElementById('root')
);

registerServiceWorker();

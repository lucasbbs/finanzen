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

/*
This file was modified by the author of Finanzen, lucasbbs
*/

import Calendar from 'views/Calendar.js';
import Dashboard from 'views/Dashboard.js';
import User from 'views/pages/User.js';
import Uploader from 'views/Uploader.js';
import WizardFirstAccess from 'views/WizardFirstAccess/Wizard.js';
import Investments from 'views/InvestmentsList.js';
import InvestmentDetails from 'views/InvestmentDetails';
import ArchiveInvestments from 'views/ArchiveInvestments';
import ArchiveAccounts from 'views/ArchiveAccounts';

import Login from 'views/Login';
import InvestmentProjects from 'views/InvestmentProjects';
import Verify from 'views/Verify';
import BrokerList from 'views/BrokersList';
import AccountList from 'views/AccountList';
import AccountDetails from 'views/AccountDetails';
import BrokerDetails from 'views/BrokerDetails';
import ArchiveBrokers from 'views/ArchiveBrokers';
import Inflations from 'views/Inflations';
import CountriesListInflations from 'views/CountriesListInflations';
import BulkUpdaterInflations from 'views/BulkUpdaterInflations';
import RestoreAccess from 'views/RestoreAccess';

const routes = [
  {
    isVisible: false,
    path: '/user-profile',
    name: 'User Profile',
    mini: 'UP',
    component: User,
    layout: '/admin',
  },
  {
    isAdmin: true,
    isVisible: true,
    collapse: true,
    name: 'Inflations',
    state: 'inflationsCollapse',
    icon: 'fas fa-comment-dollar',
    views: [
      {
        isAdmin: true,
        isVisible: true,
        path: '/inflations',
        name: 'Inflations Editor',
        icon: 'fas fa-comment-dollar',
        component: Inflations,
        layout: '/admin',
      },
      {
        isAdmin: true,
        isVisible: true,
        path: '/countrieslistinflations',
        name: 'Countries List Inflations',
        icon: 'fas fa-flag',
        component: CountriesListInflations,
        layout: '/admin',
      },
      {
        isAdmin: true,
        isVisible: true,
        path: '/bulkinflations',
        name: 'Bulk Inflations Editor',
        icon: 'fas fa-comments-dollar',
        component: BulkUpdaterInflations,
        layout: '/admin',
      },
    ],
  },
  {
    isVisible: false,
    path: '/first-access',
    name: 'First Access',
    component: WizardFirstAccess,
    layout: '/auth',
  },
  {
    isVisible: false,
    path: '/restore-access',
    name: 'Restore Access',
    component: RestoreAccess,
    layout: '/auth',
  },
  {
    isVisible: true,
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'tim-icons icon-chart-pie-36',
    component: Dashboard,
    layout: '/admin',
  },
  {
    isVisible: true,
    path: '/investment_projects',
    icon: 'tim-icons icon-chart-bar-32',
    name: 'Investment Projects',
    component: InvestmentProjects,
    layout: '/admin',
  },
  {
    isVisible: true,
    path: '/upload',
    name: 'Upload',
    icon: 'fas fa-cloud-upload-alt',
    mini: 'U',
    component: Uploader,
    layout: '/admin',
  },
  {
    isVisible: true,
    collapse: true,
    name: 'Accounts',
    icon: 'icomoon-480',
    state: 'accountsCollapse',
    views: [
      {
        isVisible: true,
        path: '/accounts',
        name: 'Accounts List',
        icon: 'icomoon-480',
        component: AccountList,
        layout: '/admin',
      },
      {
        isVisible: true,
        path: '/archive-accounts',
        name: 'Archive Accounts',
        icon: 'icomoon-484',
        component: ArchiveAccounts,
        layout: '/admin',
      },
      {
        isVisible: true,
        path: '/account/:id',
        name: 'New Account',
        icon: 'fas fa-dollar-sign',
        component: AccountDetails,
        layout: '/admin',
      },
    ],
  },
  {
    isVisible: true,
    collapse: true,
    name: 'Investiments',
    icon: 'tim-icons icon-wallet-43',
    state: 'investmentsCollapse',
    views: [
      {
        isVisible: true,
        path: '/investments',
        name: 'Investiments List',
        icon: 'tim-icons icon-wallet-43',
        component: Investments,
        layout: '/admin',
      },
      {
        isVisible: true,
        path: '/archive-investments',
        name: 'Archive Investments',
        icon: 'fas fa-file-invoice-dollar',
        component: ArchiveInvestments,
        layout: '/admin',
      },
      {
        isVisible: true,
        path: '/investment/:id',
        name: 'New Investiment',
        icon: 'tim-icons icon-money-coins',
        component: InvestmentDetails,
        layout: '/admin',
      },
    ],
  },

  {
    isVisible: true,
    collapse: true,
    name: 'Brokers',
    icon: 'fas fa-landmark',
    mini: 'U',
    state: 'brokersCollapse',
    views: [
      {
        isVisible: true,
        path: '/brokers',
        name: 'Brokers List',
        icon: 'fas fa-landmark',
        component: BrokerList,
        layout: '/admin',
      },
      {
        isVisible: true,
        path: '/archive-brokers',
        name: 'Archive Brokers',
        icon: 'fas fa-book',
        component: ArchiveBrokers,
        layout: '/admin',
      },
      {
        isVisible: true,
        path: '/broker/:id',
        name: 'New Broker',
        icon: 'far fa-handshake',
        component: BrokerDetails,
        layout: '/admin',
      },
    ],
  },
  {
    isVisible: false,
    path: '/login',
    name: 'Login',
    mini: 'L',
    component: Login,
    layout: '/auth',
  },
  {
    isVisible: false,
    path: '/verify/:id',
    name: 'Verify',
    mini: 'V',
    component: Verify,
    layout: '/auth',
  },
  {
    isVisible: true,
    path: '/calendar',
    name: 'Calendar',
    icon: 'tim-icons icon-calendar-60',
    component: Calendar,
    layout: '/admin',
  },
];

export default routes;

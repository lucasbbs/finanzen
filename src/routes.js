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
import VectorMap from 'views/maps/VectorMap.js';
import GoogleMaps from 'views/maps/GoogleMaps.js';
import FullScreenMap from 'views/maps/FullScreenMap.js';
import ReactTables from 'views/tables/ReactTables.js';
import RegularTables from 'views/tables/RegularTables.js';
import ExtendedTables from 'views/tables/ExtendedTables.js';
import Wizard from 'views/forms/Wizard.js';
import ValidationForms from 'views/forms/ValidationForms.js';
import ExtendedForms from 'views/forms/ExtendedForms.js';
import RegularForms from 'views/forms/RegularForms.js';
import Calendar from 'views/Calendar.js';
import Widgets from 'views/Widgets.js';
import Charts from 'views/Charts.js';
import Dashboard from 'views/Dashboard.js';
import Buttons from 'views/components/Buttons.js';
import SweetAlert from 'views/components/SweetAlert.js';
import Notifications from 'views/components/Notifications.js';
import Grid from 'views/components/Grid.js';
import Typography from 'views/components/Typography.js';
import Panels from 'views/components/Panels.js';
import Icons from 'views/components/Icons.js';
import Pricing from 'views/pages/Pricing.js';
import Register from 'views/pages/Register.js';
import Timeline from 'views/pages/Timeline.js';
import User from 'views/pages/User.js';
import Uploader from 'views/Uploader.js';
import WizardFirstAccess from 'views/WizardFirstAccess/Wizard.js';
// import Login from 'views/pages/Login.js';
import Rtl from 'views/pages/Rtl.js';
import Lock from 'views/pages/Lock.js';
import Investments from 'views/InvestmentsList.js';
import InvestmentDetails from 'views/InvestmentDetails';
import ArchiveInvestments from 'views/ArchiveInvestments';

import Login from 'views/Login';
import Verify from 'views/Verify';
import BrokerList from 'views/BrokersList';
import BrokerDetails from 'views/BrokerDetails';
import ArchiveBrokers from 'views/ArchiveBrokers';
import Inflations from 'views/Inflations';

const routes = [
  {
    isVisible: true,
    isAdmin: true,
    path: '/inflations',
    name: 'Inflations',
    icon: 'tim-icons icon-chart-pie-36',
    component: Inflations,
    layout: '/admin',
  },
  {
    isVisible: false,
    path: '/first-access',
    name: 'First Access',
    icon: 'tim-icons icon-chart-pie-36',
    component: WizardFirstAccess,
    layout: '/auth',
  },
  {
    isVisible: true,
    path: '/dashboard',
    name: 'Dashboard',
    rtlName: 'لوحة القيادة',
    icon: 'tim-icons icon-chart-pie-36',
    component: Dashboard,
    layout: '/admin',
  },

  {
    isVisible: true,
    collapse: true,
    name: 'Investiments',
    icon: 'tim-icons icon-wallet-43',
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
    isVisible: true,
    collapse: true,
    name: 'Pages',
    rtlName: 'صفحات',
    icon: 'tim-icons icon-image-02',
    state: 'pagesCollapse',
    views: [
      {
        isVisible: true,
        path: '/pricing',
        name: 'Pricing',
        rtlName: 'عالتسعير',
        mini: 'P',
        rtlMini: 'ع',
        component: Pricing,
        layout: '/auth',
      },
      {
        isVisible: true,
        path: '/rtl-support',
        name: 'RTL Support',
        rtlName: 'صودعم رتل',
        mini: 'RS',
        rtlMini: 'صو',
        component: Rtl,
        layout: '/rtl',
      },
      {
        isVisible: true,
        path: '/timeline',
        name: 'Timeline',
        rtlName: 'تيالجدول الزمني',
        mini: 'T',
        rtlMini: 'تي',
        component: Timeline,
        layout: '/admin',
      },
      {
        isVisible: true,
        path: '/login',
        name: 'Login',
        rtlName: 'هعذاتسجيل الدخول',
        mini: 'L',
        rtlMini: 'هعذا',
        component: Login,
        layout: '/auth',
      },
      {
        isVisible: true,
        path: '/verify/:id',
        name: 'Verify',
        rtlName: 'هعذاتسجيل الدخول',
        mini: 'V',
        rtlMini: 'هعذا',
        component: Verify,
        layout: '/auth',
      },
      {
        isVisible: true,
        path: '/register',
        name: 'Register',
        rtlName: 'تسجيل',
        mini: 'R',
        rtlMini: 'صع',
        component: Register,
        layout: '/auth',
      },
      {
        isVisible: true,
        path: '/lock-screen',
        name: 'Lock Screen',
        rtlName: 'اقفل الشاشة',
        mini: 'LS',
        rtlMini: 'هذاع',
        component: Lock,
        layout: '/auth',
      },
      {
        isVisible: true,
        path: '/user-profile',
        name: 'User Profile',
        rtlName: 'ملف تعريفي للمستخدم',
        mini: 'UP',
        rtlMini: 'شع',
        component: User,
        layout: '/admin',
      },
    ],
  },
  {
    isVisible: true,
    collapse: true,
    name: 'Components',
    rtlName: 'المكونات',
    icon: 'tim-icons icon-molecule-40',
    state: 'componentsCollapse',
    views: [
      {
        isVisible: true,
        collapse: true,
        name: 'Multi Level Collapse',
        rtlName: 'انهيار متعدد المستويات',
        mini: 'MLT',
        rtlMini: 'ر',
        state: 'multiCollapse',
        views: [
          {
            isVisible: true,
            path: '/buttons',
            name: 'Buttons',
            rtlName: 'وصفت',
            mini: 'B',
            rtlMini: 'ب',
            component: Buttons,
            layout: '/admin',
          },
        ],
      },
      {
        isVisible: true,
        path: '/buttons',
        name: 'Buttons',
        rtlName: 'وصفت',
        mini: 'B',
        rtlMini: 'ب',
        component: Buttons,
        layout: '/admin',
      },
      {
        isVisible: true,
        path: '/grid-system',
        name: 'Grid System',
        rtlName: 'نظام الشبكة',
        mini: 'GS',
        rtlMini: 'زو',
        component: Grid,
        layout: '/admin',
      },
      {
        isVisible: true,
        path: '/panels',
        name: 'Panels',
        rtlName: 'لوحات',
        mini: 'P',
        rtlMini: 'ع',
        component: Panels,
        layout: '/admin',
      },
      {
        isVisible: true,
        path: '/sweet-alert',
        name: 'Sweet Alert',
        rtlName: 'الحلو تنبيه',
        mini: 'SA',
        rtlMini: 'ومن',
        component: SweetAlert,
        layout: '/admin',
      },
      {
        isVisible: true,
        path: '/notifications',
        name: 'Notifications',
        rtlName: 'إخطارات',
        mini: 'N',
        rtlMini: 'ن',
        component: Notifications,
        layout: '/admin',
      },
      {
        isVisible: true,
        path: '/icons',
        name: 'Icons',
        rtlName: 'الرموز',
        mini: 'I',
        rtlMini: 'و',
        component: Icons,
        layout: '/admin',
      },
      {
        isVisible: true,
        path: '/typography',
        name: 'Typography',
        rtlName: 'طباعة',
        mini: 'T',
        rtlMini: 'ر',
        component: Typography,
        layout: '/admin',
      },
    ],
  },
  {
    isVisible: true,
    collapse: true,
    name: 'Forms',
    rtlName: 'إستمارات',
    icon: 'tim-icons icon-notes',
    state: 'formsCollapse',
    views: [
      {
        isVisible: true,
        path: '/regular-forms',
        name: 'Regular Forms',
        rtlName: 'أشكال عادية',
        mini: 'RF',
        rtlMini: 'صو',
        component: RegularForms,
        layout: '/admin',
      },
      {
        isVisible: true,
        path: '/extended-forms',
        name: 'Extended Forms',
        rtlName: 'نماذج موسعة',
        mini: 'EF',
        rtlMini: 'هوو',
        component: ExtendedForms,
        layout: '/admin',
      },
      {
        isVisible: true,
        path: '/validation-forms',
        name: 'Validation Forms',
        rtlName: 'نماذج التحقق من الصحة',
        mini: 'VF',
        rtlMini: 'تو',
        component: ValidationForms,
        layout: '/admin',
      },
      {
        isVisible: true,
        path: '/wizard',
        name: 'Wizard',
        rtlName: 'ساحر',
        mini: 'W',
        rtlMini: 'ث',
        component: Wizard,
        layout: '/admin',
      },
    ],
  },
  {
    isVisible: true,
    collapse: true,
    name: 'Tables',
    rtlName: 'الجداول',
    icon: 'tim-icons icon-puzzle-10',
    state: 'tablesCollapse',
    views: [
      {
        isVisible: true,
        path: '/regular-tables',
        name: 'Regular Tables',
        rtlName: 'طاولات عادية',
        mini: 'RT',
        rtlMini: 'صر',
        component: RegularTables,
        layout: '/admin',
      },
      {
        isVisible: true,
        path: '/extended-tables',
        name: 'Extended Tables',
        rtlName: 'جداول ممتدة',
        mini: 'ET',
        rtlMini: 'هور',
        component: ExtendedTables,
        layout: '/admin',
      },
      {
        isVisible: true,
        path: '/react-tables',
        name: 'React Tables',
        rtlName: 'رد فعل الطاولة',
        mini: 'RT',
        rtlMini: 'در',
        component: ReactTables,
        layout: '/admin',
      },
    ],
  },
  {
    isVisible: true,
    collapse: true,
    name: 'Maps',
    rtlName: 'خرائط',
    icon: 'tim-icons icon-pin',
    state: 'mapsCollapse',
    views: [
      {
        isVisible: true,
        path: '/google-maps',
        name: 'Google Maps',
        rtlName: 'خرائط جوجل',
        mini: 'GM',
        rtlMini: 'زم',
        component: GoogleMaps,
        layout: '/admin',
      },
      {
        isVisible: true,
        path: '/full-screen-map',
        name: 'Full Screen Map',
        rtlName: 'خريطة كاملة الشاشة',
        mini: 'FSM',
        rtlMini: 'ووم',
        component: FullScreenMap,
        layout: '/admin',
      },
      {
        isVisible: true,
        path: '/vector-map',
        name: 'Vector Map',
        rtlName: 'خريطة المتجه',
        mini: 'VM',
        rtlMini: 'تم',
        component: VectorMap,
        layout: '/admin',
      },
    ],
  },
  {
    isVisible: true,
    path: '/widgets',
    name: 'Widgets',
    rtlName: 'الحاجيات',
    icon: 'tim-icons icon-settings',
    component: Widgets,
    layout: '/admin',
  },
  {
    isVisible: true,
    path: '/charts',
    name: 'Charts',
    rtlName: 'الرسوم البيانية',
    icon: 'tim-icons icon-chart-bar-32',
    component: Charts,
    layout: '/admin',
  },
  {
    isVisible: true,
    path: '/calendar',
    name: 'Calendar',
    rtlName: 'التقويم',
    icon: 'tim-icons icon-time-alarm',
    component: Calendar,
    layout: '/admin',
  },
];

export default routes;

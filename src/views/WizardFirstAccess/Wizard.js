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
import React, { useState } from 'react';
// react plugin used to create a form with multiple steps
import ReactWizard from 'react-bootstrap-wizard';

// reactstrap components
import { Col } from 'reactstrap';

// wizard steps
import Step1 from './WizardSteps/Step1.js';
// import Step2 from './WizardSteps/Step2.js';
// import Step3 from './WizardSteps/Step3.js';
import Step3 from './WizardSteps/Step3.js';

import axios from 'axios';
import Config from '../../config.json';
import { useHistory } from 'react-router-dom';

var steps = [
  {
    stepName: 'About',
    stepIcon: 'tim-icons icon-single-02',
    component: Step1,
  },
  // {
  //   stepName: 'Account',
  //   stepIcon: 'tim-icons icon-settings-gear-63',
  //   component: Step2,
  // },
  // {
  //   stepName: 'Address',
  //   stepIcon: 'tim-icons icon-delivery-fast',
  //   component: Step3,
  // },
  {
    stepName: 'Equity',
    stepIcon: 'tim-icons icon-delivery-fast',
    component: Step3,
  },
];

const WizardFirstAccess = () => {
  const history = useHistory();
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const handleFinish = async (states) => {
    console.log(states);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${login.token}`,
      },
    };
    await axios
      .put(
        `${Config.SERVER_ADDRESS}/api/users/${login._id}`,
        {
          country: states.About.country,
          currency: states.About.currency,
          monthlySalary: states.Equity.monthlysalary,
          equityObjective: states.Equity.equityobjective,
        },
        config
      )
      .then((res) => {
        let userInfo = JSON.parse(localStorage.getItem('userInfo'));
        userInfo['isFirstAccess'] = false;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        console.log('testando 1,2,3..');
        history.push('/admin/dashboard');
      });
  };
  return (
    <>
      <div className='content'>
        <Col className='mr-auto ml-auto' md='10'>
          <ReactWizard
            steps={steps}
            navSteps
            validate
            title='Build Your Profile'
            description='This information will let us know more about you.'
            headerTextCenter
            finishButtonClasses='btn-wd btn-info'
            nextButtonClasses='btn-wd btn-info'
            previousButtonClasses='btn-wd'
            progressbar
            color='primary'
            finishButtonClick={(allStates) => handleFinish(allStates)}
          />
        </Col>
      </div>
    </>
  );
};

export default WizardFirstAccess;

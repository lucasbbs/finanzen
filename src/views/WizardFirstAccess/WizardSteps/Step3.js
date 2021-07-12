/*!

=========================================================
* Black Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.


*/ /*eslint-disable*/
import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
// react plugin used to create DropdownMenu for selecting items
import Select from 'react-select';

// reactstrap components
import { FormGroup, Input, Row, Col, Button, InputGroup } from 'reactstrap';
import classnames from 'classnames';
import { reverseFormatNumber } from 'helpers/functions';
import { currencies } from '../../pages/currencies';

const Step3 = React.forwardRef((props, ref) => {
  // const [step3Select, setstep3Select] = React.useState(null);
  React.useImperativeHandle(ref, () => ({
    isValidated: () => isValidated(),
    state: {
      equityobjective: reverseFormatNumber(equityobjective),
      monthlysalary: reverseFormatNumber(monthlysalary),
    },
  }));
  const [country] = useState(localStorage.getItem('tempCountry'));

  const [equityobjectiveFocus, setequityobjectiveFocus] = useState('');
  const [monthlysalaryFocus, setmonthlysalaryFocus] = useState('');
  const [equityobjectiveState, setequityobjectiveState] = useState('');
  const [equityobjective, setequityobjective] = useState('');
  const [monthlysalary, setmonthlysalary] = useState('');
  const [monthlysalaryState, setmonthlysalaryState] = useState('');

  const stateFunctions = {
    setequityobjectiveState: (value) => setequityobjectiveState(value),
    setmonthlysalaryState: (value) => setmonthlysalaryState(value),
    setmonthlysalary: (value) => setmonthlysalary(value),
    setequityobjective: (value) => setequityobjective(value),
  };
  const verifyCurrency = (value) => {
    return value !== '';
  };
  const change = (event, stateName, type, stateNameEqualTo, maxValue) => {
    switch (type) {
      case 'currency':
        if (verifyCurrency(event.target.value)) {
          stateFunctions[`set${stateName}State`]('has-success');
        } else {
          stateFunctions[`set${stateName}State`]('has-danger');
        }
        break;

      default:
        break;
    }
    stateFunctions[`set${stateName}`](event.target.value);
  };
  const isValidated = () => {
    if (
      monthlysalaryState === 'has-success' &&
      equityobjectiveState === 'has-success'
    ) {
      return true;
    } else {
      if (monthlysalaryState !== 'has-success') {
        setmonthlysalaryState('has-danger');
      }
      if (equityobjectiveState !== 'has-success') {
        setequityobjectiveState('has-danger');
      }

      return false;
    }
  };
  return (
    <>
      <form>
        <Row className='justify-content-center'>
          <Col sm='12'>
            <h5 className='info-text'>What about your life goals?</h5>
          </Col>
          <Col sm='3'>
            <label>Monthly Salary</label>
            <InputGroup
              className={classnames(monthlysalaryState, {
                // 'input-group-focus': countryFocus,
              })}
            >
              <NumberFormat
                required
                className='classToAvoidBug borderColor'
                value={monthlysalary}
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  // background: '#2b3553',
                }}
                type='text'
                placeholder={`${
                  currencies[localStorage.getItem('tempCurrency')].symbol_native
                }0,00`}
                thousandSeparator={'.'}
                decimalSeparator={','}
                prefix={
                  currencies[localStorage.getItem('tempCurrency')].symbol_native
                }
                customInput={Input}
                onChange={(e) => {
                  change(e, 'monthlysalary', 'currency');
                  // if (isEdit) {
                  //   setDateEl(document.querySelector('#IncomeDate').value);
                  // }
                  // setValueEl(e.target.value);
                }}
              />
            </InputGroup>
          </Col>
          <Col sm='3'>
            <label>Objective Equity</label>
            <InputGroup
              className={classnames(equityobjectiveState, {
                'input-group-focus': equityobjectiveFocus,
              })}
            >
              <NumberFormat
                className='classToAvoidBug borderColor'
                value={equityobjective}
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  // background: '#2b3553',
                }}
                type='text'
                placeholder={`${
                  currencies[localStorage.getItem('tempCurrency')].symbol_native
                }0,00`}
                thousandSeparator={'.'}
                decimalSeparator={','}
                prefix={
                  currencies[localStorage.getItem('tempCurrency')].symbol_native
                }
                customInput={Input}
                onChange={(e) => {
                  // if (isEdit) {
                  //   setDateEl(document.querySelector('#IncomeDate').value);
                  // }
                  change(e, 'equityobjective', 'currency');
                  // setValueEl(e.target.value);
                }}
                onFocus={(e) => setequityobjectiveFocus(true)}
                onBlur={(e) => setequityobjectiveFocus(false)}
              />
            </InputGroup>
          </Col>
        </Row>
      </form>
    </>
  );
});

export default Step3;

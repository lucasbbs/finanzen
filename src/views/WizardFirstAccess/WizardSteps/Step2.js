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
import React, { useState, useEffect } from 'react';
import NumberFormat from 'react-number-format';
import { Row, Col, Input, Label, InputGroup } from 'reactstrap';
import { currencies } from 'views/pages/currencies';
import classnames from 'classnames';
import { reverseFormatNumber } from 'helpers/functions';

const Step2 = React.forwardRef((props, ref) => {
  useEffect(() => {
    setaccountName(`${props.wizardData.About?.currency} Account`);
    setaccountNameState('has-success');
  }, [props.wizardData.About?.currency]);

  const [accountName, setaccountName] = useState('');
  const [accountNameState, setaccountNameState] = useState('');
  const [initialAmount, setinitialAmount] = useState('');
  const [initialAmountState, setinitialAmountState] = useState('');

  const stateFunctions = {
    setinitialAmountState: (value) => setinitialAmountState(value),
    setaccountNameState: (value) => setaccountNameState(value),
    setinitialAmount: (value) => setinitialAmount(value),
    setaccountName: (value) => setaccountName(value),
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
      case 'text':
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
      initialAmountState === 'has-success' &&
      accountNameState === 'has-success'
    ) {
      return true;
    } else {
      if (initialAmountState !== 'has-success') {
        setinitialAmountState('has-danger');
      }
      if (accountNameState !== 'has-success') {
        setaccountNameState('has-danger');
      }

      return false;
    }
  };

  React.useImperativeHandle(ref, () => ({
    isValidated: () => isValidated(),
    state: {
      accountName: accountName,
      initialAmount: reverseFormatNumber(initialAmount),
    },
  }));
  return (
    <>
      <h5 className='info-text'>
        Define your default account, which will be used to receive your monthly
        salary in the app
      </h5>
      <Row className='justify-content-center'>
        <Col sm='3'>
          <label>Account Name</label>
          <InputGroup className={classnames(accountNameState)}>
            <Input
              type='text'
              value={accountName}
              onChange={(e) => change(e, 'accountName', 'text')}
            ></Input>
          </InputGroup>
        </Col>
        {/* <Col className='text-center' lg='5'>
          <Row>
            <Label>Initial amount</Label>
            <Input type='text'></Input>
          </Row>
        </Col> */}
        <Col sm='3'>
          <label>Initial Amount</label>
          <InputGroup className={classnames(initialAmountState)}>
            <NumberFormat
              required
              className='classToAvoidBug borderColor'
              value={initialAmount}
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                // background: '#2b3553',
              }}
              type='text'
              placeholder={
                props.wizardData.About?.currency &&
                `${
                  currencies[props?.wizardData.About.currency]?.symbol_native
                }0`
              }
              thousandSeparator={'.'}
              decimalSeparator={','}
              prefix={
                props.wizardData.About?.currency &&
                currencies[props.wizardData.About.currency]?.symbol_native
              }
              customInput={Input}
              onChange={(e) => {
                change(e, 'initialAmount', 'currency');
                // if (isEdit) {
                //   setDateEl(document.querySelector('#IncomeDate').value);
                // }
                // setValueEl(e.target.value);
              }}
            />
          </InputGroup>
        </Col>
      </Row>
    </>
  );
});

export default Step2;

import React, { useState } from 'react';
import classnames from 'classnames';
// reactstrap components
import {
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from 'reactstrap';

import { countries } from '../../pages/countries';
import { currencies } from '../../pages/currencies';

const Step1 = React.forwardRef((props, ref) => {
  // eslint-disable
  const [country, setCountry] = useState('');
  const [countryState, setcountryState] = useState('');
  const [currencyState, setcurrencyState] = useState('');
  const [currency, setCurrency] = useState('');
  const [countryFocus, setcountryFocus] = React.useState('');
  const [currencyFocus, setcurrencyFocus] = React.useState('');

  const stateFunctions = {
    setcountryState: (value) => setcountryState(value),
    setcurrencyState: (value) => setcurrencyState(value),
    setcountry: (value) => setCountry(value),
    setcurrency: (value) => setCurrency(value),
  };

  const verifySelect = (value) => {
    if (value !== '') {
      return true;
    }
    return false;
  };

  const change = (event, stateName, type) => {
    switch (type) {
      case 'select':
        if (verifySelect(event.target.value)) {
          stateFunctions['set' + stateName + 'State']('has-success');
        } else {
          stateFunctions['set' + stateName + 'State']('has-danger');
        }
        break;

      default:
        break;
    }
    stateFunctions['set' + stateName](event.target.value);
  };
  const isValidated = () => {
    if (countryState === 'has-success' && currencyState === 'has-success') {
      return true;
    } else {
      if (countryState !== 'has-success') {
        setcountryState('has-danger');
      }
      if (currencyState !== 'has-success') {
        setcurrencyState('has-danger');
      }

      return false;
    }
  };
  React.useImperativeHandle(ref, () => ({
    isValidated: () => isValidated(),
    state: {
      country,
      currency,
    },
  }));

  return (
    <>
      <h5 className='info-text'>
        Let's start with the basic information (with validation)
      </h5>
      <Row className='justify-content-center mt-5'>
        <Col sm='3'>
          <label>Country</label>
          <InputGroup
            style={{ marginBottom: '0' }}
            className={classnames(countryState, {
              'input-group-focus': countryFocus,
            })}
          >
            <InputGroupAddon addonType='prepend'>
              <InputGroupText style={{ backgroundColor: '#2b3553' }}>
                <i className='tim-icons icon-square-pin' />
              </InputGroupText>
            </InputGroupAddon>

            <Input
              required
              style={{ backgroundColor: '#2b3553' }}
              type='select'
              value={country}
              onFocus={(e) => setcountryFocus(true)}
              onBlur={(e) => setcountryFocus(false)}
              onChange={(e) => {
                change(e, 'country', 'select');
                setCountry(e.target.value);
                localStorage.setItem('tempCountry', e.target.value);
              }}
            >
              <option value='' disabled={true}>
                Selecione uma opção
              </option>
              {Object.entries(countries).map((country) => (
                <option key={country[0]} id={country[0]} value={country[0]}>
                  {country[1]}
                </option>
              ))}
            </Input>
          </InputGroup>
          {countryState === 'has-danger' ? (
            <label
              style={{
                textAlign: 'right',
                color: '#ec250d',
                fontSize: '0.75rem',
                marginBottom: ' 5px',
                marginTop: '-10px',
              }}
              className='error'
            >
              This field is required.
            </label>
          ) : null}
        </Col>
        <Col style={{ paddingRight: '0' }} sm='3'>
          <label>Currency</label>
          <InputGroup
            style={{ marginBottom: '0' }}
            className={classnames(currencyState, {
              'input-group-focus': currencyFocus,
            })}
          >
            <InputGroupAddon addonType='prepend'>
              <InputGroupText style={{ backgroundColor: '#2b3553' }}>
                <i className='tim-icons icon-money-coins' />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              required
              style={{ backgroundColor: '#2b3553' }}
              type='select'
              value={currency}
              onFocus={(e) => setcurrencyFocus(true)}
              onBlur={(e) => setcurrencyFocus(false)}
              onChange={(e) => {
                change(e, 'currency', 'select');
                localStorage.setItem('tempCurrency', e.target.value);
              }}
            >
              <option value='' disabled={true}>
                Selecione uma opção
              </option>
              {Object.entries(currencies).map((currency) => (
                // (country) => console.log(country[1].name)
                <option key={currency[0]} value={currency[0]}>
                  {currency[1].name}
                </option>
              ))}
            </Input>
          </InputGroup>
          {currencyState === 'has-danger' ? (
            <label
              style={{
                textAlign: 'right',
                color: '#ec250d',
                fontSize: '0.75rem',
                marginBottom: ' 5px',
                marginTop: '-10px',
              }}
              className='error'
            >
              This field is required.
            </label>
          ) : null}
        </Col>
        <Col sm='10'></Col>
      </Row>
    </>
  );
});

export default Step1;

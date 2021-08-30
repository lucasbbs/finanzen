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
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { currencies } from './currencies';
import { countries } from './countries';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Label,
  UncontrolledTooltip,
} from 'reactstrap';
import Config from '../../config.json';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import { useHistory } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import { reverseFormatNumber } from 'helpers/functions';
import NotificationAlert from 'react-notification-alert';
// import DatePicker from 'react-date-picker';

const User = () => {
  let history = useHistory();
  // const [date, setDate] = useState(new Date());
  const [defaultAccount, setDefaultAccount] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).defaultAccount
      : null
  );
  const [accounts, setAccounts] = useState([]);
  const [accountsToFilter, setAccountsToFilter] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [monthlySalary, setMonthlySalary] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).monthlySalary
      : null
  );
  const [equityObjective, setEquityObjective] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).equityObjective
      : null
  );
  const [match, setMatch] = useState(true);
  const [password, setPassword] = useState(null);
  const [hasRegisteredInvest, setHasRegisteredInvest] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).hasRegisteredInvest
      : null
  );
  const [email, setEmail] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).email
      : null
  ); // eslint-disable-next-line
  const [hasEmail] = useState(
    JSON.parse(localStorage.getItem('userInfo')).email ? true : false
  ); // eslint-disable-next-line
  const [registerConfirmPassword, setregisterConfirmPassword] = useState('');
  const [alert, setAlert] = useState(null);
  const [source, setsource] = useState('');
  const [destination, setdestination] = useState('');
  const [sourceState, setsourceState] = useState('');
  const [destinationState, setdestinationState] = useState('');

  const [isHidden, setIsHidden] = useState(false);
  const [name, setName] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).name
      : null
  );
  const [userId] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))._id
      : null
  );
  // const [email] = useState(JSON.parse(localStorage.getItem('userInfo')).email);
  const [token] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).token
      : null
  );
  const [country, setCountry] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).country
      : null
  );
  const [currency, setCurrency] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).currency
      : null
  );

  useEffect(() => {
    const getAccounts = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const accountsfromTheAPI = await axios.get(
        `${Config.SERVER_ADDRESS}/api/accounts`,
        config
      );
      setAccountsToFilter(accountsfromTheAPI.data.accounts);
      setAccounts(
        accountsfromTheAPI.data.accounts.filter(
          (account) => account.currency === currency
        )
      );
    };
    getAccounts();
  }, []);

  useEffect(() => {
    setAccounts(
      accountsToFilter.filter((account) => account.currency === currency)
    );
  }, [currency]);
  // function that verifies if two strings are equal
  const compare = (string1, string2) => {
    if (string1 === string2) {
      return true;
    }
    return false;
  };

  const stateFunctions = {
    setsource: (value) => setsource(value),
    setdestination: (value) => setdestination(value),
    setsourceState: (value) => setsourceState(value),
    setdestinationState: (value) => setdestinationState(value),
    setregisterConfirmPassword: (value) => setregisterConfirmPassword(value),
  };
  const change = (event, stateName, type, stateNameEqualTo, maxValue) => {
    switch (type) {
      case 'equalTo':
        if (compare(event.target.value, stateNameEqualTo.value)) {
          stateFunctions['set' + stateName + 'State']('has-success');
          stateFunctions['set' + stateNameEqualTo.stateName + 'State'](
            'has-success'
          );
          setMatch(true);
          setPassword(event.target.value);
        } else {
          stateFunctions['set' + stateName + 'State']('has-danger');
          stateFunctions['set' + stateNameEqualTo.stateName + 'State'](
            'has-danger'
          );
          setMatch(false);
        }
        break;

      default:
        break;
    }
    stateFunctions['set' + stateName](event.target.value);
  };
  const fetchCurrency = async (code) => {
    const response = await fetch(
      `https://restcountries.eu/rest/v2/alpha/${code}`
    );
    const res = await response.json();
    setCurrency(res.currencies[0].code);
    // return await response.json();
  };
  const handleSave = async (userObj) => {
    if (source !== destination) {
      setsourceState('has-danger');
      setdestinationState('has-danger');
    } else {
      if (!match) {
      } else {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        await axios
          .put(`${Config.SERVER_ADDRESS}/api/users/${userId}`, userObj, config)
          .then((res) => {
            notify('You have successfully updated you info data');
            userInfo['country'] = country;
            userInfo['currency'] = currency;
            userInfo['name'] = name;
            userInfo['defaultAccount'] = defaultAccount;
            userInfo['hasRegisteredInvest'] = hasRegisteredInvest;
            userInfo['monthlySalary'] = monthlySalary;
            userInfo['equityObjective'] = equityObjective;
            userInfo['email'] = email;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
          })
          .catch((error) =>
            notify(
              error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
              'danger'
            )
          );
      }
    }
  };

  const handleDelete = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    await axios
      .delete(`${Config.SERVER_ADDRESS}/api/users/${userId}`, config)
      .then((res) => {
        successDelete();
        notify('You have successfully deleted your account');
        localStorage.removeItem('userInfo');
      })
      .catch((error) =>
        notify(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          'danger'
        )
      );
  };

  const successDelete = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: 'block', marginTop: '-100px' }}
        title='Deleted'
        onConfirm={() => {
          hideAlert();
          history.push('/auth/login');
        }}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle='success'
        btnSize=''
      >
        Your profile was deleted...
      </ReactBSAlert>
    );
  };
  const cancelDelete = () => {
    setAlert(
      <ReactBSAlert
        danger
        style={{ display: 'block', marginTop: '-100px' }}
        title='Cancelled'
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnText='Ok'
        confirmBtnBsStyle='success'
        btnSize=''
      ></ReactBSAlert>
    );
  };
  const warningWithConfirmAndCancelMessage = () => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block', marginTop: '-100px' }}
        title='Are you sure?'
        onConfirm={() => {
          try {
            handleDelete();
          } catch (error) {}
        }}
        onCancel={() => cancelDelete()}
        confirmBtnBsStyle='success'
        cancelBtnBsStyle='danger'
        confirmBtnText='Yes, delete!'
        cancelBtnText='Cancel'
        showCancel
        btnSize=''
      >
        you will not be able to restores your profile data
      </ReactBSAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
  const notificationAlertRef = useRef(null);
  const notify = (message, type = 'success', place = 'tc') => {
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>{message}</div>
        </div>
      ),
      type: type,
      icon: 'tim-icons icon-bell-55',
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };
  return (
    <>
      <div className='react-notification-alert-container'>
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div className='content'>
        {alert}
        <Row>
          <Col md='12'>
            <Card>
              <CardHeader>
                <h5 className='title'>Edit Profile</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    {/* <Col className='pr-md-1' md='5'>
                      <FormGroup>
                        <label>Company (disabled)</label>
                        <Input
                          // defaultValue='Creative Code Inc.'
                          className='borderColor'
                          disabled
                          type='text'
                        />
                      </FormGroup>
                    </Col> */}
                    <Col md='3' style={{ paddingRight: '0' }}>
                      <FormGroup>
                        <Label htmlFor='nameId'>Name</Label>
                        <Input
                          id='nameId'
                          value={name}
                          style={{ backgroundColor: '#2b3553' }}
                          onChange={(e) => setName(e.target.value)}
                          className='borderColor'
                          type='text'
                        />
                      </FormGroup>
                    </Col>
                    <Col md='3' style={{ paddingRight: '0' }}>
                      <FormGroup>
                        <Label htmlFor='emailId'>Email Address</Label>
                        <Input
                          id='emailId'
                          style={{
                            backgroundColor: '#2b3553',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }}
                          disabled
                          placeholder='email@email.com'
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete='username'
                          className='borderColor'
                          type='email'
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {/* <Row>
                    {/* <Col className='pr-md-1' md='6'>
                      <FormGroup>
                        <label>First Name</label>
                        <Input
                          defaultValue='Mike'
                          className='borderColor'
                          type='text'
                        />
                      </FormGroup>
                    </Col> */}
                  {/* <Col className='pl-md-1' md='6'>
                      <FormGroup>
                        <label>Last Name</label>
                        <Input
                          defaultValue='Andrew'
                          className='borderColor'
                          type='text'
                        />
                      </FormGroup>
                    </Col>
                  </Row> */}
                  {/* <Row>
                    <Col md='12'>
                      <FormGroup>
                        <label>Address</label>
                        <Input
                          defaultValue='Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09'
                          placeholder='Home Address'
                          className='borderColor'
                          type='text'
                        />
                      </FormGroup>
                    </Col>
                  </Row> */}
                  <Row>
                    {/* <Col className='pr-md-1' md='4'>
                      <FormGroup>
                        <label>City</label>
                        <Input
                          defaultValue='Minsk'
                          className='borderColor'
                          type='text'
                        />
                      </FormGroup>
                    </Col> */}
                    {/* <Col className='px-md-1' md='4'>
                      <FormGroup>
                        <label>Country</label>
                        <Input
                          defaultValue='Belarus'
                          className='borderColor'
                          type='text'
                        />
                      </FormGroup>
                    </Col>
                    <Col className='pl-md-1' md='4'>
                      <FormGroup>
                        <label>Postal Code</label>
                        <Input
                          placeholder='ZIP Code'
                          className='borderColor'
                          type='number'
                        />
                      </FormGroup>
                    </Col>*/}
                    <Col md='3' style={{ paddingRight: '0' }}>
                      <Label htmlFor='countryId'>Country</Label>
                      <Input
                        id='countryId'
                        required
                        style={{ backgroundColor: '#2b3553' }}
                        type='select'
                        value={country}
                        onChange={(e) => {
                          setCountry(e.target.value);
                          fetchCurrency(e.target[e.target.selectedIndex].id);
                          setIsHidden(false);
                        }}
                      >
                        <option value='' disabled={true}>
                          Select an option
                        </option>
                        {Object.entries(countries).map((country) => (
                          <option
                            key={country[0]}
                            id={country[0]}
                            value={country[0]}
                          >
                            {country[1]}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col md='3' hidden={isHidden} style={{ paddingRight: '0' }}>
                      <Label htmlFor='currencyId'>Currency</Label>
                      <Input
                        id='currencyId'
                        required
                        style={{ backgroundColor: '#2b3553' }}
                        type='select'
                        value={currency}
                        onChange={(e) => {
                          setCurrency(e.target.value);
                          setDefaultAccount('');
                        }}
                      >
                        <option value='' disabled={true}>
                          Select an option
                        </option>
                        {Object.entries(currencies).map((currency) => (
                          // (country) => console.log(country[1].name)
                          <option key={currency[0]} value={currency[0]}>
                            {currency[1].name}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </Row>
                  <Row>
                    <Col md='3' style={{ paddingRight: '0' }}>
                      <Label htmlFor='salaryId'>Monthly Salary</Label>
                      <NumberFormat
                        id='salaryId'
                        style={{ backgroundColor: '#2b3553' }}
                        onChange={(e) =>
                          setMonthlySalary(reverseFormatNumber(e.target.value))
                        }
                        type='text'
                        value={monthlySalary}
                        placeholder={`${currencies[currency]?.symbol_native}0,00`}
                        thousandSeparator={'.'}
                        decimalSeparator={','}
                        prefix={currencies[currency]?.symbol_native}
                        customInput={Input}
                      />
                    </Col>
                    <Col md='3' style={{ paddingRight: '0' }}>
                      <Label htmlFor='objectiveId'>Equity Objective</Label>
                      <NumberFormat
                        id='objectiveId'
                        style={{ backgroundColor: '#2b3553' }}
                        onChange={(e) =>
                          setEquityObjective(
                            reverseFormatNumber(e.target.value)
                          )
                        }
                        type='text'
                        value={equityObjective}
                        placeholder={`${currencies[currency]?.symbol_native}0,00`}
                        thousandSeparator={'.'}
                        decimalSeparator={','}
                        prefix={currencies[currency]?.symbol_native}
                        customInput={Input}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md='3'></Col>
                    <Col md='3' style={{ paddingRight: '0' }}>
                      <Label htmlFor='accountId'>
                        Default Account
                        <span
                          id='UncontrolledTooltipExample'
                          style={{ color: 'var(--primary)' }}
                        >
                          <i className='fas fa-info-circle'></i>
                        </span>
                        <UncontrolledTooltip
                          placement='top'
                          target='UncontrolledTooltipExample'
                        >
                          This is the account that is used to receive your
                          monthly salaries
                        </UncontrolledTooltip>
                      </Label>
                      <Input
                        id='accountId'
                        type='select'
                        style={{ backgroundColor: '#2b3553' }}
                        value={defaultAccount}
                        onChange={(e) => setDefaultAccount(e.target.value)}
                      >
                        <option value='' disabled={true}>
                          Select an option
                        </option>
                        {accounts.map((account) => (
                          <option key={account._id} value={account._id}>
                            {account.name}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </Row>
                  {/* <Row>
                    <Col md='8'>
                      <FormGroup>
                        <label>About Me</label>
                        <Input
                          cols='80'
                          className='borderColor'
                          defaultValue="Lamborghini Mercy, Your chick she so thirsty, I'm in
                            that two seat Lambo."
                          placeholder='Here can be your description'
                          rows='4'
                          type='textarea'
                        />
                      </FormGroup>
                    </Col>
                  </Row> */}
                  <Row>
                    <Label htmlFor='idSource' sm='2'>
                      Password
                    </Label>
                    <Col sm='2' style={{ paddingRight: '0' }}>
                      <FormGroup className={sourceState}>
                        <Input
                          id='idSource'
                          style={{ backgroundColor: '#2b3553' }}
                          className='borderColor'
                          placeholder='password'
                          autoComplete='new-password'
                          disabled={!hasEmail}
                          type='password'
                          onChange={(e) => {
                            change(e, 'source', 'password');
                            sourceState === 'has-danger' &&
                              change(e, 'source', 'equalTo', {
                                value: destination,
                                stateName: 'destination',
                              });
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm='2' style={{ paddingRight: '0' }}>
                      <FormGroup className={destinationState}>
                        <Input
                          id='idDestination'
                          style={{ backgroundColor: '#2b3553' }}
                          className='borderColor'
                          autoComplete='new-password'
                          placeholder='confirm password'
                          disabled={!hasEmail}
                          type='password'
                          onChange={(e) =>
                            change(e, 'destination', 'equalTo', {
                              value: source,
                              stateName: 'source',
                            })
                          }
                        />
                        {destinationState === 'has-danger' ? (
                          <Label className='error'>
                            Please enter the same value.
                          </Label>
                        ) : null}
                      </FormGroup>
                    </Col>
                    {/* <Col className='label-on-right' tag='label' sm='4'>
                    </Col> */}
                  </Row>
                </Form>
                <FormGroup check>
                  <Label check>
                    <Input
                      name='optionCheckboxes'
                      type='checkbox'
                      checked={hasRegisteredInvest}
                      onChange={(e) => setHasRegisteredInvest(e.target.checked)}
                    />
                    <span className='form-check-sign' />
                    Have loaded all previous investments
                  </Label>
                </FormGroup>
              </CardBody>
              <CardFooter>
                <Button
                  className='btn-fill'
                  color='primary'
                  type='submit'
                  onClick={() => {
                    handleSave({
                      name,
                      email,
                      country,
                      currency,
                      password,
                      hasRegisteredInvest,
                      monthlySalary,
                      equityObjective,
                    });
                  }}
                >
                  Save
                </Button>
                <Button
                  className='btn-fill'
                  color='danger'
                  type='submit'
                  onClick={() => warningWithConfirmAndCancelMessage()}
                >
                  Delete profile
                </Button>
              </CardFooter>
            </Card>
          </Col>
          {/* <Col md='4'>
            <Card className='card-user'>
              <CardBody>
                <CardText />
                <div className='author'>
                  <div className='block block-one' />
                  <div className='block block-two' />
                  <div className='block block-three' />
                  <div className='block block-four' />
                  <a href='#pablo' onClick={(e) => e.preventDefault()}>
                    <img
                      alt='...'
                      className='avatar'
                      src={require('assets/img/emilyz.jpg').default}
                    />
                    <h5 className='title'>Mike Andrew</h5>
                  </a>
                  <p className='description'>Ceo/Co-Founder</p>
                </div>
                <div className='card-description'>
                  Do not be scared of the truth because we need to restart the
                  human foundation in truth And I love you like Kanye loves
                  Kanye I love Rick Owens’ bed design but the back is...
                </div>
              </CardBody>
              <CardFooter>
                <div className='button-container'>
                  <Button className='btn-icon btn-round' color='facebook'>
                    <i className='fab fa-facebook' />
                  </Button>
                  <Button className='btn-icon btn-round' color='twitter'>
                    <i className='fab fa-twitter' />
                  </Button>
                  <Button className='btn-icon btn-round' color='google'>
                    <i className='fab fa-google-plus' />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </Col> */}
        </Row>
      </div>
    </>
  );
};

export default User;

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
import { getGPUTier } from 'detect-gpu';
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  InputGroupAddon,
  InputGroup,
  InputGroupText,
  CustomInput,
  CardText,
} from 'reactstrap';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import { useHistory } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import { reverseFormatNumber } from 'helpers/functions';
import NotificationAlert from 'react-notification-alert';
import classnames from 'classnames';
import { urlBase64ToUint8Array } from 'helpers/functions';
import { getOperatingSystemName } from 'helpers/functions';
// import DatePicker from 'react-date-picker';

const User = () => {
  let history = useHistory();
  // const [date, setDate] = useState(new Date());
  const [
    checkboxSendPushNotifications,
    setCheckboxSendPushNotifications,
  ] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
          .isSendNotificationsActivated
      : false
  );
  const [checkboxBondYieldDates, setCheckboxBondYieldDates] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
          .isSendBondYieldDatesNotificationsActivated
      : true
  );
  const [checkboxDueDate, setCheckboxDueDate] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
          .isSendDueDatesNotificationsActivated
      : true
  );
  const [newEmailFocus, setnewEmailFocus] = useState(false);
  const [registerNewEmailState, setregisterNewEmailState] = useState('');
  const [registerNewEmail, setregisterNewEmail] = useState('');
  const [defaultAccount, setDefaultAccount] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).defaultAccount
      : ''
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
  // const [newEmail, setNewEmail] = useState('');
  const [code, setCode] = useState('');
  const [hasEmail] = useState(
    JSON.parse(localStorage.getItem('userInfo')).email ? true : false
  ); // eslint-disable-next-line
  const [registerConfirmPassword, setregisterConfirmPassword] = useState('');
  const [alert, setAlert] = useState(null);
  const [source, setsource] = useState('');
  const [destination, setdestination] = useState('');
  const [sourceState, setsourceState] = useState('');
  const [destinationState, setdestinationState] = useState('');
  const [modal, setModal] = useState(false);
  const [modalConfirmChangeEmail, setModalConfirmChangeEmail] = useState(false);
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

  const address = process.env.REACT_APP_SERVER_ADDRESS;

  const toggle = () => setModal(!modal);
  const toggleModalConfirmChangeEmail = () =>
    setModalConfirmChangeEmail(!modalConfirmChangeEmail);
  useEffect(() => {
    const getAccounts = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const accountsFromTheAPI = await axios.get(
        `${address}/api/accounts`,
        config
      );
      setAccountsToFilter(accountsFromTheAPI.data.accounts);
      setAccounts(
        accountsFromTheAPI.data.accounts.filter(
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

  const verifyEmail = (value) => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRex.test(value) ? true : false;
  };
  const stateFunctions = {
    setsource: (value) => setsource(value),
    setdestination: (value) => setdestination(value),
    setsourceState: (value) => setsourceState(value),
    setdestinationState: (value) => setdestinationState(value),
    setregisterConfirmPassword: (value) => setregisterConfirmPassword(value),
    setregisterNewEmailState: (value) => setregisterNewEmailState(value),
    setregisterNewEmail: (value) => setregisterNewEmail(value),
  };
  const change = (event, stateName, type, stateNameEqualTo, maxValue) => {
    switch (type) {
      case 'email':
        if (verifyEmail(event.target.value)) {
          stateFunctions['set' + stateName + 'State']('has-success');
        } else {
          stateFunctions['set' + stateName + 'State']('has-danger');
        }
        break;
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
          .put(`${address}/api/users/${userId}`, userObj, config)
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
            userInfo[
              'isSendNotificationsActivated'
            ] = checkboxSendPushNotifications;
            userInfo['isSendDueDatesNotificationsActivated'] = checkboxDueDate;
            userInfo[
              'isSendBondYieldDatesNotificationsActivated'
            ] = checkboxBondYieldDates;

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
      .delete(`${address}/api/users/${userId}`, config)
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
  const closeBtn = (
    <button color='danger' className='close' onClick={toggle}>
      <span style={{ color: 'white' }}>×</span>
    </button>
  );
  const closeBtnModalConfirmChangeEmail = (
    <button
      color='danger'
      className='close'
      onClick={toggleModalConfirmChangeEmail}
    >
      <span style={{ color: 'white' }}>×</span>
    </button>
  );
  const submitChangeEmailHandler = async (e) => {
    e.preventDefault();
    if (registerNewEmailState === '') {
      setregisterNewEmailState('has-danger');
    }

    if (
      registerNewEmailState === '' ||
      registerNewEmailState === 'has-danger'
    ) {
      return;
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    await axios
      .put(
        `${address}/api/users/change-email/${userInfo._id}`,
        { newEmail: registerNewEmail },
        config
      )
      .then((res) => {
        notify(res.data.message);
        toggleModalConfirmChangeEmail();
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

  const submitConfirmEmailHandler = async () => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios
      .put(
        `${address}/api/users/confirm-change-email/${code}`,
        { code },
        config
      )
      .then((res) => {
        notify('You have successfully updated your email');
        setEmail(res.data.email);
        userInfo.email = res.data.email;
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
  };

  const checkAlreadySubmited = async () => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(
      `${address}/api/register/check-by-user/${userInfo._id}`,
      config
    );
    if (data.found) {
      toggleModalConfirmChangeEmail();
    } else {
      toggle();
    }
  };
  const askForNotificationPermission = (condition) => {
    Notification.requestPermission(function (result) {
      // console.log('User Choice', result);
      if (result !== 'granted') {
        // console.log('No notification permission granted!');
      } else {
        configurePushSub(condition);
      }
    });
  };

  function configurePushSub(condition) {
    if (!('serviceWorker' in navigator)) {
      return;
    }
    let hasUnsubscribed = false;
    var reg;
    // console.log(
    //   'running',
    //   navigator.serviceWorker,
    //   navigator.serviceWorker.ready
    // );
    navigator.serviceWorker.ready
      .then(function (swreg) {
        // console.log(swreg, 'navigator has loaded');
        reg = swreg;
        return swreg.pushManager.getSubscription();
      })
      .then((sub) => {
        if (!!sub) {
          return sub.unsubscribe().then(function (s) {
            // console.log('has unsubscribed 1,2,3');
            hasUnsubscribed = true;
            return navigator.serviceWorker.ready;
          });
        }
        return navigator.serviceWorker.ready;
      })
      .then(function (sub) {
        var vapidPublicKey =
          'BOChVD1tKTc0Of3c-0JplT1y5FPOm6oijP_4stWBXwoQe6xI4GGt6cnpdu4JLwt_Znj23bj_hku8OSois1y9fLE';

        var convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);

        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidPublicKey,
        });
      })
      .then(async function (newSub) {
        let key;
        let authSecret;
        let endPoint;
        if (newSub) {
          const rawKey = newSub.getKey ? newSub.getKey('p256dh') : '';
          key = rawKey
            ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey)))
            : '';
          var rawAuthSecret = newSub.getKey ? newSub.getKey('auth') : '';
          authSecret = rawAuthSecret
            ? btoa(
                String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))
              )
            : '';

          endPoint = newSub.endpoint;
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          };
          const gpuTier = await getGPUTier();
          const info = getOperatingSystemName(this);
          // console.log(info);
          if (hasUnsubscribed) {
            await axios.put(
              `${address}/api/pushNotifications/id`,
              {
                isAdding: condition,
                endpoint: endPoint,
                key,
                auth: authSecret,
                gpu: gpuTier.gpu,
                operating_system: `${info.os} ${info.osVersion}`,
                device: info.mobile ? 'mobile' : 'desktop',
                browser: `${info.browser} ${info.browserMajorVersion}`,
                operating_system_architecture: info.arch,
              },
              config
            );
          } else {
            await axios.post(
              `${address}/api/pushNotifications/`,
              {
                endpoint: endPoint,
                key,
                auth: authSecret,
                gpu: gpuTier.gpu,
                operating_system: `${info.os} ${info.osVersion}`,
                device: info.mobile ? 'mobile' : 'desktop',
                browser: `${info.browser} ${info.browserMajorVersion}`,
                operating_system_architecture: info.arch,
              },
              config
            );
          }
        }
      })
      .then(function (res) {
        displayConfirmNotification();
      })
      .catch(function (error) {
        console.error(error);
      });
  }
  function displayConfirmNotification() {
    if ('serviceWorker' in navigator) {
      var options = {
        body: 'You successfully subscribed to our Notification service!',
        icon: 'https://i.ibb.co/XCJJ8K7/logo.png',
        image: 'https://i.ibb.co/2k3XBDy/purple-heavy-dollar-sign.png',
        dir: 'ltr',
        data: { url: 'https://finanzen-app.netlify.app/' },
        lang: 'en-US', // BCP 47,
        vibrate: [100, 50, 200],
        badge: 'https://i.ibb.co/2k3XBDy/purple-heavy-dollar-sign.png',
        tag: 'confirm-notification',
        renotify: true,
        actions: [
          {
            action: 'confirm',
            title: 'Okay',
            icon: 'https://i.ibb.co/2k3XBDy/purple-heavy-dollar-sign.png',
          },
          {
            action: 'cancel',
            title: 'Cancel',
            icon: 'https://i.ibb.co/2k3XBDy/purple-heavy-dollar-sign.png',
          },
        ],
      };
      navigator.serviceWorker.ready.then(function (swreg) {
        swreg.showNotification('Successfully subscribed!', options);
      });
    }
  }

  const handleDeleteAllNotifications = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await axios.delete(`${address}/api/pushNotifications/`, config);
      notify(
        'You have successfully deleted the push notifications in all of your devices!'
      );
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      await subscription.unsubscribe();
    } catch (error) {
      notify(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
        'danger'
      );
    }
  };

  return (
    <>
      <Modal modalClassName='modal-black' isOpen={modal} toggle={toggle}>
        <ModalHeader close={closeBtn} toggle={toggle}>
          Change e-mail
        </ModalHeader>
        <ModalBody>
          {/* <Input
            type='email'
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            style={{ backgroundColor: 'rgb(43, 53, 83)' }}
          ></Input> */}

          <InputGroup
            className={classnames(registerNewEmailState, {
              'input-group-focus': newEmailFocus,
            })}
          >
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <i className='tim-icons icon-email-85' />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              id='registerNewEmail'
              name='newEmail'
              autoComplete='new-password'
              placeholder='Email...'
              type='email'
              onChange={(e) => change(e, 'registerNewEmail', 'email')}
              onFocus={(e) => setnewEmailFocus(true)}
              onBlur={(e) => setnewEmailFocus(false)}
            />
          </InputGroup>
          {registerNewEmailState === 'has-danger' ? (
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
        </ModalBody>
        <ModalFooter>
          <Button onClick={submitChangeEmailHandler}>Submit</Button>
          <Button color='danger' onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        modalClassName='modal-black'
        isOpen={modalConfirmChangeEmail}
        toggle={toggleModalConfirmChangeEmail}
      >
        <ModalHeader
          close={closeBtnModalConfirmChangeEmail}
          toggle={toggleModalConfirmChangeEmail}
        >
          Please confirm the code we've sent you in your new e-mail
        </ModalHeader>
        <ModalBody>
          <Input
            type='text'
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ backgroundColor: 'rgb(43, 53, 83)' }}
          ></Input>
        </ModalBody>
        <ModalFooter>
          <Button onClick={submitConfirmEmailHandler}>Confirm</Button>
          <Button color='danger' onClick={toggleModalConfirmChangeEmail}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
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
                    <Col md='2'>
                      <Button
                        className='btn-simple '
                        color='danger'
                        onClick={(e) => {
                          e.preventDefault();
                          checkAlreadySubmited();
                        }}
                      >
                        <span style={{ fontSize: '14px' }}>
                          Change <br /> e-mail
                        </span>
                      </Button>
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
                    <Col md='5'>
                      <div
                        style={{
                          backgroundColor: '#fff',
                          boxShadow: '0 1px 4px 0',
                          position: 'relative',
                          height: '80px',
                          gridTemplateRows: '24px auto 24px',
                          gridTemplateColumns: '96px auto',
                          margin: '20px',
                          width: '360px',
                          display: 'grid',
                          boxSizing: 'border-box',
                        }}
                        tabIndex='0'
                        aria-label='Imagem de notificação na área de trabalho'
                      >
                        <div
                          style={{
                            gridRow: 1,
                            gridColumn: 2,
                            alignSelf: 'end',
                            fontSize: '14px',
                            color: '#333',
                          }}
                        >
                          {name}
                        </div>
                        <div
                          style={{
                            gridRow: 2,
                            gridColumn: 2,
                            alignSelf: 'start',
                            fontSize: '12px',
                            color: '#333',
                          }}
                        >
                          Invitation for a future event
                        </div>
                        <div
                          style={{
                            gridRow: 3,
                            gridColumn: 2,
                            alignSelf: 'start',
                            fontSize: '11px',
                            color: '#333',
                          }}
                        >
                          {address}
                        </div>
                        <img
                          style={{
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            display: 'none',
                          }}
                          src='//outlook-1.cdn.office.net/owamail/20210920004.10/resources/images/webpush-mock/chrome.png'
                        />
                        <img
                          style={{
                            marginLeft: '14px',
                            gridRow: '1/span 3',
                            gridColumn: 1,
                            alignSelf: 'center',
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            maxHeight: '48px',
                            width: '60px',
                          }}
                          src={require('assets/img/logo.png').default}
                        />
                        <img
                          style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            content: '',
                            width: '59px',
                            height: '32px',
                            margin: 0,
                            padding: 0,
                            border: 0,
                            font: 'inherit',
                            verticalAlign: 'baseline',
                          }}
                          src='//outlook-1.cdn.office.net/owamail/20210920004.10/resources/images/webpush-mock/chrome_icons.png'
                        />
                      </div>
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
                        placeholder={`${currencies[currency]?.symbol_native}0`}
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
                        placeholder={`${currencies[currency]?.symbol_native}0`}
                        thousandSeparator={'.'}
                        decimalSeparator={','}
                        prefix={currencies[currency]?.symbol_native}
                        customInput={Input}
                      />
                    </Col>
                    <Col md='6'>
                      <CustomInput
                        type='switch'
                        id='switch-4'
                        label='Send me desktop notifications'
                        checked={checkboxSendPushNotifications}
                        onChange={(e) => {
                          setCheckboxSendPushNotifications(e.target.checked);

                          askForNotificationPermission(e.target.checked);
                        }}
                      />
                      <FormGroup check>
                        <Col>
                          <Row>
                            <Label check>
                              <Input
                                id='DueDatesId'
                                disabled={!checkboxSendPushNotifications}
                                checked={checkboxDueDate}
                                onChange={(e) =>
                                  setCheckboxDueDate(e.target.checked)
                                }
                                type='checkbox'
                                label='Some label goes here'
                              />
                              <span className='form-check-sign'>
                                <span className='check' />
                              </span>
                            </Label>
                            <Label
                              htmlFor='DueDatesId'
                              style={{ marginBottom: 0, marginRight: '10px' }}
                            >
                              Due dates investment
                            </Label>
                          </Row>
                        </Col>
                      </FormGroup>
                      <FormGroup check>
                        <Col>
                          <Row>
                            <Label check>
                              <Input
                                id='BondYieldDatesId'
                                checked={checkboxBondYieldDates}
                                disabled={!checkboxSendPushNotifications}
                                type='checkbox'
                                label='Some label goes here'
                                onChange={(e) =>
                                  setCheckboxBondYieldDates(e.target.checked)
                                }
                              />
                              <span className='form-check-sign'>
                                <span className='check' />
                              </span>
                            </Label>
                            <Label
                              htmlFor='BondYieldDatesId'
                              style={{ marginBottom: 0, marginRight: '10px' }}
                            >
                              Bond yields dates
                            </Label>
                          </Row>
                        </Col>
                      </FormGroup>
                      <Button
                        color='primary'
                        onClick={() => handleDeleteAllNotifications()}
                        className='btn-link'
                      >
                        Turn off desktop notifications on all devices
                      </Button>
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
                          // disabled={!hasEmail}
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
                          // disabled={!hasEmail}
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
                      defaultAccount,
                      isSendNotificationsActivated: checkboxSendPushNotifications,
                      isSendDueDatesNotificationsActivated: checkboxDueDate,
                      isSendBondYieldDatesNotificationsActivated: checkboxBondYieldDates,
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
          <Col md='4'></Col>
        </Row>
      </div>
    </>
  );
};

export default User;

/*eslint-disable*/
import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';
import styles from '../assets/scss/black-dashboard-pro-react/MyCustomCSS/login.module.scss';
import Config from '../config.json';
import NotificationAlert from 'react-notification-alert';
import classnames from 'classnames';
import { GlobalContext } from 'context/GlobalState';

const Login = ({ location }) => {
  const { emptyState } = useContext(GlobalContext);

  let history = useHistory();

  const [fullnameFocus, setfullnameFocus] = useState('');
  const [emailFocus, setemailFocus] = useState('');
  const [passwordFocus, setPasswordFocus] = useState('');
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState('');
  const [container, setContainer] = useState();
  const [match, setMatch] = useState(true);
  const [password, setPassword] = useState(null);
  const [registerEmailState, setregisterEmailState] = useState('');
  const [registerEmailForgetState, setregisterEmailForgetState] = useState('');
  const [registerEmailForget, setregisterEmailForget] = useState('');

  const [registerEmail, setregisterEmail] = useState('');

  const [source, setsource] = useState('');
  const [destination, setdestination] = useState('');
  const [sourceState, setsourceState] = useState('');
  const [destinationState, setdestinationState] = useState('');
  const [loginFullName, setloginFullName] = useState('');
  const [loginFullNameState, setloginFullNameState] = useState('');
  const [login, setLogin] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );

  const redirect = location.search ? location.search.split('=')[1] : '/';
  useEffect(() => {
    emptyState();
    if (login !== null) {
      history.push(redirect);
      window.location.reload();
    }
    setContainer(document.getElementById('container'));
  }, [login, history, redirect]);

  const userInfoParam = location.search ? location.search.split('=')[0] : null;

  useEffect(() => {
    if (userInfoParam === '?userInfo') {
      const userInfoFromOauth = atob(
        location.search.split('userInfo=').slice(1).join()
      );
      localStorage.setItem('userInfo', userInfoFromOauth);
      notify('You are now logged in, redirecting you...');
      setTimeout(function () {
        setLogin(userInfoFromOauth);
      }, 1800);
    }
  }, [userInfoParam]);
  const handleClick = () => {
    container.classList.toggle(styles.rightPanelActive);
  };
  const config = {
    headers: { 'Content-Type': 'application/json' },
  };

  const doLogin = async (e, email, password) => {
    e.preventDefault();

    await axios
      .post(
        `${Config.SERVER_ADDRESS}/api/users/login`,
        {
          email,
          password,
        },
        config
      )
      .then((res) => {
        if (res.data.isValidated) {
          localStorage.setItem('userInfo', JSON.stringify(res.data));
          notify('You have successfully logged in');
          setTimeout(function () {
            setLogin(JSON.stringify(res.data));
          }, 1800);
        } else {
          history.push(`/auth/verify/${res.data._id}`);
        }
      })
      .catch((error) => {
        console.error(error);
        notify(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          'danger'
        );
      });
  };

  const doRegister = async (e, name, email, password, confirmPassword) => {
    e.preventDefault();
    if (registerEmailState === '') {
      setregisterEmailState('has-danger');
    }

    if (loginFullNameState === '') {
      setloginFullNameState('has-danger');
    }
    if (
      sourceState === '' ||
      destinationState === '' ||
      source === '' ||
      destination === ''
    ) {
      setsourceState('has-danger');
      setdestinationState('has-danger');
    }

    if (
      registerEmailState === '' ||
      registerEmailState === 'has-danger' ||
      loginFullNameState === '' ||
      loginFullNameState === 'has-danger' ||
      sourceState === '' ||
      source === '' ||
      sourceState === 'has-danger' ||
      destinationState === '' ||
      destination === '' ||
      destinationState === 'has-danger'
    ) {
      return;
    }
    e.preventDefault();
    if (password !== confirmPassword) {
      setsourceState('has-danger');
      setdestinationState('has-danger');
      notify(
        'You must be sure that your password is correctly typed',
        'danger'
      );
    } else {
      await axios
        .post(
          `${Config.SERVER_ADDRESS}/api/users`,
          {
            name,
            email,
            password,
          },
          config
        )
        .then((res) => {
          // setLogin(JSON.stringify(res.data));
          notify(
            'You have successfully registered your user, to continue, check the link we forwarded to you through the email you provided'
          );

          history.push(`/auth/verify/${res.data._id}`);
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
  const stateFunctions = {
    setregisterEmailForgetState: (value) => setregisterEmailForgetState(value),
    setregisterEmailForget: (value) => setregisterEmailForget(value),
    setloginFullName: (value) => setloginFullName(value),
    setloginFullNameState: (value) => setloginFullNameState(value),
    setregisterEmail: (value) => setregisterEmail(value),
    setregisterEmailState: (value) => setregisterEmailState(value),
    setsource: (value) => setsource(value),
    setdestination: (value) => setdestination(value),
    setsourceState: (value) => setsourceState(value),
    setdestinationState: (value) => setdestinationState(value),
    // setregisterConfirmPassword: (value) => setregisterConfirmPassword(value),
  };
  const verifyEmail = (value) => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };
  const compare = (string1, string2) => {
    if (string1 === string2) {
      return true;
    }
    return false;
  };
  const verifyLength = (value, length) => {
    if (value.length >= length) {
      return true;
    }
    return false;
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
      case 'length':
        if (verifyLength(event.target.value, stateNameEqualTo)) {
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
  (function () {
    var CLASSES = {
      button: 'btn',
      checkbox: 'toggle__checkbox',
      container: 'content',
      form: '[data-toggle="form"]',
      input: 'inputfield__input',
      inputfield: 'inputfield',
    };
    var CONTAINER_CLASSES = [styles.isAmnesia, styles.isLogin];
    var CONTAINER = document.getElementById(CLASSES.container);
    var FORMTOGGLE = document.querySelectorAll('[data-toggle="form"]');
    [].slice.call(FORMTOGGLE).forEach(function (el) {
      var $target = document.getElementById(el.getAttribute('data-target'));
      var $type = 'is-' + el.getAttribute('data-type');
      el.addEventListener('click', function (e) {
        if (e) e.preventDefault();
        if (!$target) return;
        var children = $target.parentNode.children;
        Array.prototype.filter.call(children, function (child) {
          if (child !== $target) {
            child.classList.remove(styles.isActive);
          }
        });
        if (!$target.classList.contains(styles.isActive)) {
          $target.classList.add(styles.isActive);
        }

        CONTAINER_CLASSES.forEach(function (c) {
          CONTAINER.classList.remove(c);
        });
        if ($type === 'is-login') {
          CONTAINER.classList.add(styles.isLogin);
        } else {
          CONTAINER.classList.add(styles.isAmnesia);
        }
      });
    });
  })();
  const handleResetPassword = async () => {
    axios
      .post(`${Config.SERVER_ADDRESS}/api/resetlogin`, {
        email: document.querySelector('#emailResetPasword').value,
      })
      .then((res) => {
        notify('You have successfully sent a request to reset your access');
        window.location.reload();
      })
      .catch((error) => {
        notify(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          'danger'
        );
      });
  };
  return (
    <>
      <div className='react-notification-alert-container'>
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div
        id='content'
        className='content'
        style={{
          overflow: 'hidden',
          padding: '100px',
          height: '100%',
          minHeight: '100%',
        }}
      >
        <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div
            id='amnesiaId'
            style={{
              backgroundColor: '#1e1e2f',
            }}
            className={[styles.containerAmnesia, styles.cardAmnesia].join(' ')}
          >
            <div
              className={styles.overlay}
              style={{
                height: '300px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <img
                style={{
                  width: '300px',
                }}
                alt='Finanzen'
                src={require('assets/img/logo.png').default}
              />

              <h1 className={styles.h1Style} style={{ textAlign: 'center' }}>
                Don't worry!
              </h1>
              <p className={styles.paragraphStyle}>
                Just write down below your email and the rest is on us!
              </p>
            </div>
            <InputGroup
              className={[
                classnames(registerEmailForgetState, {
                  'input-group-focus': emailFocus,
                }),
                'mt-5',
              ].join(' ')}
            >
              <InputGroupAddon addonType='prepend'>
                <InputGroupText>
                  <i className='tim-icons icon-email-85' />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                id='emailResetPasword'
                name='email'
                autoComplete='new-password'
                placeholder='Email...'
                type='email'
                onChange={(e) => change(e, 'registerEmailForget', 'email')}
                onFocus={(e) => setemailFocus(true)}
                onBlur={(e) => setemailFocus(false)}
              />
            </InputGroup>
            {registerEmailForgetState === 'has-danger' ? (
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
            <br />
            <Button
              color='primary'
              className={[styles.buttonStyle, 'm-4'].join(' ')}
              onClick={handleResetPassword}
            >
              Reset Password
            </Button>
            <Button
              data-toggle='form'
              data-target='container'
              data-type='login'
              color='danger'
              style={{ float: 'right' }}
              className={[styles.buttonStyle, 'm-4'].join(' ')}
            >
              Cancel
            </Button>
          </div>
          <div
            className={[
              styles.container,
              styles.cardLogin,
              styles.isActive,
            ].join(' ')}
            id='container'
          >
            <div
              className={[styles.formContainer, styles.signUpContainer].join(
                ' '
              )}
            >
              <Form autoComplete='off' className={styles.formStyle} action='#'>
                <h1 className={styles.h1Style}>Create Account</h1>
                <div className={styles.socialContainer}>
                  <a
                    href='http://localhost:4000/api/auth/facebook'
                    className={[styles.linkStyle, styles.social].join(' ')}
                  >
                    <i className='fab fa-facebook-f'></i>
                  </a>
                  <a
                    href='http://localhost:4000/api/auth/google'
                    className={[styles.linkStyle, styles.social].join(' ')}
                  >
                    <i className='fab fa-google-plus-g'></i>
                  </a>
                  <a
                    href='http://localhost:4000/api/auth/linkedin'
                    className={[styles.linkStyle, styles.social].join(' ')}
                  >
                    <i className='fab fa-linkedin-in'></i>
                  </a>
                </div>
                <span className={`mb-2 ${styles.spanClass}`}>
                  or use your email for registration
                </span>
                <InputGroup
                  className={classnames(loginFullNameState, {
                    'input-group-focus': fullnameFocus,
                  })}
                >
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>
                      <i className='tim-icons icon-single-02' />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id='registerName'
                    name='registerName'
                    placeholder='Full Name...'
                    type='text'
                    onChange={(e) => change(e, 'loginFullName', 'length', 1)}
                    onFocus={(e) => setfullnameFocus(true)}
                    onBlur={(e) => setfullnameFocus(false)}
                  />
                </InputGroup>
                {loginFullNameState === 'has-danger' ? (
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
                <InputGroup
                  className={classnames(registerEmailState, {
                    'input-group-focus': emailFocus,
                  })}
                >
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>
                      <i className='tim-icons icon-email-85' />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id='registerEmail'
                    name='email'
                    autoComplete='new-password'
                    placeholder='Email...'
                    type='email'
                    onChange={(e) => change(e, 'registerEmail', 'email')}
                    onFocus={(e) => setemailFocus(true)}
                    onBlur={(e) => setemailFocus(false)}
                  />
                </InputGroup>
                {registerEmailState === 'has-danger' ? (
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
                <InputGroup
                  className={classnames(sourceState, {
                    'input-group-focus': passwordFocus,
                  })}
                >
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>
                      <i className='tim-icons icon-lock-circle' />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id='registerPassword'
                    name='password'
                    autoComplete='new-password'
                    placeholder='Password...'
                    type='password'
                    onChange={(e) => change(e, 'source', 'password')}
                    onFocus={(e) => setPasswordFocus(true)}
                    onBlur={(e) => setPasswordFocus(false)}
                  />
                </InputGroup>
                {sourceState === 'has-danger' ? (
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

                <InputGroup
                  className={classnames(destinationState, {
                    'input-group-focus': confirmPasswordFocus,
                  })}
                >
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>
                      <i className='tim-icons icon-lock-circle' />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id='confirm'
                    equalto='#registerPassword'
                    name='pasword'
                    placeholder='Confirm password...'
                    type='password'
                    onChange={(e) =>
                      change(e, 'destination', 'equalTo', {
                        value: source,
                        stateName: 'source',
                      })
                    }
                    onFocus={(e) => setConfirmPasswordFocus(true)}
                    onBlur={(e) => setConfirmPasswordFocus(false)}
                  />
                </InputGroup>
                {destinationState === 'has-danger' ? (
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
                <FormGroup check>
                  <Label check>
                    <Input name='optionCheckboxes' type='checkbox' />
                    <span className='form-check-sign' />
                    Accept the terms and conditions
                  </Label>
                </FormGroup>
                <Button
                  color='primary'
                  className={styles.buttonStyle}
                  onClick={(e) =>
                    doRegister(
                      e,
                      document.querySelector('#registerName').value,
                      document.querySelector('#registerEmail').value,
                      document.querySelector('#registerPassword').value,
                      document.querySelector('#confirm').value
                    )
                  }
                >
                  Sign Up
                </Button>
              </Form>
            </div>

            <div
              className={[styles.formContainer, styles.signInContainer].join(
                ' '
              )}
            >
              <Form className={styles.formStyle} action='#'>
                <h1 className={styles.h1Style}>Sign in</h1>
                <div className={styles.socialContainer}>
                  <a
                    href='http://localhost:4000/api/auth/facebook'
                    className={[styles.linkStyle, styles.social].join(' ')}
                  >
                    <i className='fab fa-facebook-f'></i>
                  </a>
                  <a
                    href='http://localhost:4000/api/auth/google'
                    className={[styles.linkStyle, styles.social].join(' ')}
                  >
                    <i className='fab fa-google-plus-g'></i>
                  </a>
                  <a
                    href='http://localhost:4000/api/auth/linkedin'
                    className={[styles.linkStyle, styles.social].join(' ')}
                  >
                    <i className='fab fa-linkedin-in'></i>
                  </a>
                </div>
                <span className={styles.spanClass}>or use your account</span>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid #2b3553',
                    borderRadius: '0.4285rem',
                    margin: '8px 0',
                  }}
                  onFocus={(e) => {
                    e.target.parentElement.classList.add('formControl');
                  }}
                  onBlur={(e) =>
                    e.target.parentElement.classList.remove('formControl')
                  }
                >
                  <i
                    style={{ marginLeft: '5px' }}
                    onClick={(e) => e.target.nextElementSibling.focus()}
                    className='tim-icons icon-email-85'
                  ></i>
                  <Input
                    autoComplete='new-password'
                    id='email'
                    required
                    style={{ width: '100%', border: 'none', margin: '0' }}
                    className={styles.inputSyle}
                    type='email'
                    placeholder='Email'
                  />
                </div>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid #2b3553',
                    borderRadius: '0.4285rem',
                    margin: '8px 0',
                  }}
                  onFocus={(e) => {
                    e.target.parentElement.classList.add('formControl');
                  }}
                  onBlur={(e) =>
                    e.target.parentElement.classList.remove('formControl')
                  }
                >
                  <i
                    style={{ marginLeft: '5px' }}
                    onClick={(e) => e.target.nextElementSibling.focus()}
                    className='tim-icons icon-lock-circle'
                  ></i>
                  <Input
                    autoComplete='new-password'
                    id='password'
                    required
                    style={{ width: '100%', border: 'none', margin: '0' }}
                    className={styles.inputSyle}
                    type='password'
                    placeholder='Password'
                  />
                </div>

                <a
                  className={styles.linkStyle}
                  href='#'
                  data-toggle='form'
                  data-target='amnesiaId'
                  data-type='amnesia'
                >
                  Forgot your password?
                </a>
                <Button
                  style={{ display: 'static' }}
                  color='primary'
                  className={styles.buttonStyle}
                  onClick={(e) =>
                    doLogin(
                      e,
                      document.querySelector('#email').value,
                      document.querySelector('#password').value
                    )
                  }
                >
                  Sign In
                </Button>
              </Form>
            </div>
            <div className={styles.overlayContainer}>
              <div
                className={styles.overlay}
                style={{ height: '100%', left: '-100%', width: '200%' }}
              >
                <div
                  className={[styles.overlayPanel, styles.overlayLeft].join(
                    ' '
                  )}
                >
                  <img
                    style={{ width: '320px' }}
                    alt='Finanzen'
                    src={require('assets/img/logo.png').default}
                  />
                  <h1 className={styles.h1Style}>Welcome Back!</h1>
                  <p className={styles.paragraphStyle}>
                    To keep connected with us please login with your personal
                    info
                  </p>
                  <button
                    onClick={() => handleClick(container)}
                    className={[styles.buttonStyle, styles.ghost].join(' ')}
                    id='signIn'
                  >
                    Sign In
                  </button>
                </div>
                <div
                  className={[styles.overlayPanel, styles.overlayRight].join(
                    ' '
                  )}
                >
                  <img
                    style={{ width: '320px' }}
                    alt='Finanzen'
                    src={require('assets/img/logo.png').default}
                  />
                  <h1 className={styles.h1Style}>Hello, Friend!</h1>
                  <p className={styles.paragraphStyle}>
                    Enter your personal details and start journey with us
                  </p>
                  <button
                    onClick={handleClick}
                    className={[styles.buttonStyle, styles.ghost].join(' ')}
                    id='signUp'
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Row>
      </div>
    </>
  );
};

export default Login;

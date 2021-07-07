import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
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

/*eslint-disable*/
const Login = ({ location }) => {
  let history = useHistory();

  const [fullnameFocus, setfullnameFocus] = useState('');
  const [emailFocus, setemailFocus] = useState('');
  const [passwordFocus, setPasswordFocus] = useState('');
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState('');
  const [container, setContainer] = useState();
  const [match, setMatch] = useState(true);
  const [password, setPassword] = useState(null);
  const [registerEmailState, setregisterEmailState] = useState('');
  const [registerEmail, setregisterEmail] = useState('');

  const [source, setsource] = useState('');
  const [destination, setdestination] = useState('');
  const [sourceState, setsourceState] = useState('');
  const [loginFullName, setloginFullName] = useState('');
  const [loginFullNameState, setloginFullNameState] = useState('');
  const [destinationState, setdestinationState] = useState('');
  const [login, setLogin] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );

  const redirect = location.search ? location.search.split('=')[1] : '/';
  useEffect(() => {
    if (login !== null) {
      history.push(redirect);
    }
    setContainer(document.getElementById('container'));
  }, [login, history, redirect]);

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
          setLogin(JSON.stringify(res.data));
        } else {
          history.push(`/auth/verify/${res.data._id}`);
        }
      })
      .catch((err) => {
        console.error(err);
        notify(err.response?.data, 'danger');
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
            'Você cadastrou com sucesso o seu usuário, para continuar, verifique o link que encaminhamos para você através do e-mail informado'
          );
          console.log('teste de sucesso ao cadastrar um usuario');
          history.push(`/auth/verify/${res.data._id}`);
        })
        .catch((err) => notify(err.response.data, 'danger'));
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
    setloginFullName: (value) => setloginFullName(value),
    setloginFullNameState: (value) => setloginFullNameState(value),
    setregisterEmail: (value) => setregisterEmail(value),
    setregisterEmailState: (value) => setregisterEmailState(value),
    setsource: (value) => setsource(value),
    setdestination: (value) => setdestination(value),
    setsourceState: (value) => setsourceState(value),
    setdestinationState: (value) => setdestinationState(value),
    setregisterConfirmPassword: (value) => setregisterConfirmPassword(value),
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
  return (
    <>
      <div className='react-notification-alert-container'>
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div className='content' style={{ padding: '100px' }}>
        <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div className={styles.container} id='container'>
            <div
              className={[styles.formContainer, styles.signUpContainer].join(
                ' '
              )}
            >
              <Form autoComplete='off' className={styles.formStyle} action='#'>
                <h1 className={styles.h1Style}>Create Account</h1>
                <div className={styles.socialContainer}>
                  <a
                    href='#'
                    className={[styles.linkStyle, styles.social].join(' ')}
                  >
                    <i className='fab fa-facebook-f'></i>
                  </a>
                  <a
                    href='#'
                    className={[styles.linkStyle, styles.social].join(' ')}
                  >
                    <i className='fab fa-google-plus-g'></i>
                  </a>
                  <a
                    href='#'
                    className={[styles.linkStyle, styles.social].join(' ')}
                  >
                    <i className='fab fa-linkedin-in'></i>
                  </a>
                </div>
                <span className={styles.spanClass}>
                  or use your email for registration
                </span>
                <label htmlFor=''>teste</label>
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
                {/* <FormGroup
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0',
                  }}
                  className={`has-label ${loginFullNameState}`}
                >
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
                      className='tim-icons icon-single-02'
                    ></i>
                    <Input
                     
                      autoComplete='none'
                      required
                      style={{
                        width: '100%',
                        border: 'none',
                        margin: '0',
                        backgroundColor: 'transparent !important',
                        color: 'white !important',
                      }}
                      className={styles.inputSyle}
                      type='text'
                      placeholder='Name'
                      onChange={(e) => change(e, 'loginFullName', 'length', 1)}
                    />
                  </div>
                </FormGroup>

                {loginFullNameState === 'has-danger' ? (
                  <label
                    style={{
                      color: '#ec250d',
                      fontSize: '12px',
                      marginTop: '-8px',
                    }}
                    className='error mb-0'
                  >
                    This field is required.
                  </label>
                ) : null} */}
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
                {/* <FormGroup
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0',
                  }}
                  className={`has-label ${registerEmailState}`}
                >
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
                      className='tim-icons icon-email-85'
                      onClick={(e) => e.target.nextElementSibling.focus()}
                    ></i>
                    <Input
                      id='registerEmail'
                      autoComplete='none'
                      required
                      style={{
                        width: '100%',
                        border: 'none',
                        margin: '0',
                        backgroundColor: 'transparent !important',
                        color: 'white !important',
                      }}
                      className={styles.inputSyle}
                      onChange={(e) => change(e, 'registerEmail', 'email')}
                      type='email'
                      placeholder='Email'
                    />
                  </div>
                </FormGroup>
                {registerEmailState === 'has-danger' ? (
                  <label
                    style={{
                      color: '#ec250d',
                      fontSize: '12px',
                      marginTop: '-8px',
                    }}
                    className='error'
                  >
                    Please enter a valid email address.
                  </label>
                ) : null} */}
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
                {/* <FormGroup
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0',
                  }}
                  className={sourceState}
                >
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
                      className='tim-icons icon-lock-circle'
                      style={{ marginLeft: '5px' }}
                      onClick={(e) => e.target.nextElementSibling.focus()}
                    ></i>
                    <Input
                      id='registerPassword'
                      style={{ width: '100%', border: 'none', margin: '0' }}
                      className={styles.inputSyle}
                      placeholder='password'
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
                  </div>
                </FormGroup> */}

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
                {/* <FormGroup
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0',
                  }}
                  className={destinationState}
                >
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
                      className='tim-icons icon-lock-circle'
                      style={{ marginLeft: '5px' }}
                      onClick={(e) => e.target.nextElementSibling.focus()}
                    ></i>
                    <Input
                      equalto='#registerPassword'
                      id='confirm'
                      style={{ width: '100%', border: 'none', margin: '0' }}
                      className={styles.inputSyle}
                      placeholder='confirm password'
                      type='password'
                      onChange={(e) =>
                        change(e, 'destination', 'equalTo', {
                          value: source,
                          stateName: 'source',
                        })
                      }
                    />
                  </div>
                </FormGroup>
                {destinationState === 'has-danger' ? (
                  <label
                    style={{
                      color: '#ec250d',
                      fontSize: '12px',
                      marginTop: '-8px',
                    }}
                    className='error mb-0'
                  >
                    Please, verify your password typed.
                  </label>
                ) : null} */}
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
                    href='#'
                    className={[styles.linkStyle, styles.social].join(' ')}
                  >
                    <i className='fab fa-facebook-f'></i>
                  </a>
                  <a
                    href='#'
                    className={[styles.linkStyle, styles.social].join(' ')}
                  >
                    <i className='fab fa-google-plus-g'></i>
                  </a>
                  <a
                    href='#'
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
                    autoComplete='new password'
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
                    autoComplete='off'
                    id='password'
                    required
                    style={{ width: '100%', border: 'none', margin: '0' }}
                    className={styles.inputSyle}
                    type='password'
                    placeholder='Password'
                  />
                </div>

                <a className={styles.linkStyle} href='#'>
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
              <div className={styles.overlay}>
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
          {/* <script src='main.js'></script> */}
        </Row>
      </div>
    </>
  );
};

export default Login;

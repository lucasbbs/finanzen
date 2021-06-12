import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form, Input, Row } from 'reactstrap';
import styles from '../assets/scss/black-dashboard-pro-react/MyCustomCSS/login.module.scss';
import Config from '../config.json';
/*eslint-disable*/
const Login = ({ location }) => {
  let history = useHistory();

  const [container, setContainer] = useState();
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
          console.log(res.data);
        }
      })
      .catch((err) => console.log(err.response.data));
  };

  const doRegister = async (e, name, email, password, confirmPassword) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log('You must be sure that your password is correctly typed');
    } else {
      console.log('teste');
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
          // localStorage.setItem('userInfo', JSON.stringify(res.data));
          setLogin(JSON.stringify(res.data));
          console.log(res.data);
        })
        .catch((err) => console.log(err.response.data));
    }
  };
  return (
    <>
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
                    id='registerName'
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
                    className='tim-icons icon-lock-circle'
                    style={{ marginLeft: '5px' }}
                    onClick={(e) => e.target.nextElementSibling.focus()}
                  ></i>
                  <Input
                    id='registerPassword'
                    autoComplete='new-password'
                    required
                    style={{ width: '100%', border: 'none', margin: '0' }}
                    className={styles.inputSyle}
                    type='password'
                    placeholder='Password'
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
                    className='tim-icons icon-lock-circle'
                    style={{ marginLeft: '5px' }}
                    onClick={(e) => e.target.nextElementSibling.focus()}
                  ></i>
                  <Input
                    id='confirm'
                    autoComplete='new-password'
                    required
                    style={{ width: '100%', border: 'none', margin: '0' }}
                    className={styles.inputSyle}
                    type='password'
                    placeholder='Confirm Password'
                  />
                </div>
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

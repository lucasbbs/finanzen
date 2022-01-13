import { useRef, useState } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';
import { hasRestoredLogin } from 'services/auth';
import { useHistory } from 'react-router-dom';
import NotificationAlert from 'react-notification-alert';

const RestoreAccess = () => {
  let history = useHistory();
  const [destinationState, setdestinationState] = useState('');
  const [match, setMatch] = useState(true);
  const [password, setPassword] = useState(null);
  const [source, setsource] = useState('');
  const [destination, setdestination] = useState('');
  const [sourceState, setsourceState] = useState('');
  const [passwordFocus, setPasswordFocus] = useState('');
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState('');

  const address = process.env.REACT_APP_SERVER_ADDRESS;

  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );

  const stateFunctions = {
    setsource: (value) => setsource(value),
    setdestination: (value) => setdestination(value),
    setsourceState: (value) => setsourceState(value),
    setdestinationState: (value) => setdestinationState(value),
  };
  const compare = (string1, string2) => {
    if (string1 === string2) {
      return true;
    }
    return false;
  };

  const change = (event, stateName, type, stateNameEqualTo) => {
    switch (type) {
      case 'equalTo':
        if (
          compare(event.target.value, stateNameEqualTo.value) &&
          event.target.value.trim() !== ''
        ) {
          stateFunctions['set' + stateName + 'State']('has-success');
          stateFunctions['set' + stateNameEqualTo.stateName + 'State'](
            'has-success'
          );
          setMatch(true);
          setPassword(event.target.value.trim());
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
  const handleSubmitResetPassword = async (e, password, confirmPassword) => {
    e.preventDefault();
    if (password !== confirmPassword || password.trim() === '') {
      setsourceState('has-danger');
      setdestinationState('has-danger');
      notify(
        'You must be sure that your password is correctly typed',
        'danger'
      );
    } else {
      const config = { headers: { Authorization: `Bearer ${login.token}` } };

      await axios
        .put(`${address}/api/users/${login._id}`, { password }, config)
        .then((res) => {
          delete login['hasRestoredLogin'];
          localStorage.setItem('userInfo', JSON.stringify(login));
          notify('You have successfully restored access to your account');
          setTimeout(function () {
            history.push('/admin/dashboard');
          }, 1800);
        });
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
  return (
    <>
      <div className='react-notification-alert-container'>
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div className='content' style={{ overflow: 'hidden' }}>
        <Row className='justify-content-center align-items-center'>
          <Col md='6'>
            <Form>
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
              <Button
                type='submit'
                style={{ marginLeft: '40%', marginRight: '40%' }}
                color='warning'
                onClick={(e) =>
                  handleSubmitResetPassword(
                    e,
                    document.querySelector('#registerPassword').value,
                    document.querySelector('#confirm').value
                  )
                }
              >
                <span style={{ whiteSpace: 'nowrap' }}>Reset Password</span>
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default RestoreAccess;

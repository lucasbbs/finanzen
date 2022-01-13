import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from 'reactstrap';
import NotificationAlert from 'react-notification-alert';

const Verify = () => {
  const address = process.env.REACT_APP_SERVER_ADDRESS;

  let history = useHistory();
  const { id } = useParams();
  useEffect(() => {
    const codes = document.querySelectorAll('.code');
    // codes[0].focus();
    codes.forEach((code, idx) => {
      code.addEventListener('keydown', (e) => {
        if (e.key >= 0 && e.key <= 9) {
          setTimeout(() => {
            idx !== 5 && codes[idx + 1].focus();
          }, 10);
        } else if (e.key === 'Backspace') {
          setTimeout(() => {
            idx !== 0 && codes[idx - 1].focus();
          }, 10);
        }
      });
    });

    const firstOne = document.querySelector('#firstOne');

    firstOne.addEventListener('paste', (event) => {
      let paste = (event.clipboardData || window.clipboardData)
        .getData('text')
        .trim();

      if (!isNaN(paste) && paste.length === 6) {
        paste = paste.split('');
        for (let i = 0; i < paste.length; i++) {
          codes[i].value = paste[i];
        }
      }
    });
  }, []);
  const handleSubmit = async (code) => {
    console.log(code);
    await axios
      .get(`${address}/api/register/${id}`)
      .then(async (res) => {
        if (res.data.code === code) {
          const config = {
            headers: {
              'Content-Type': 'application/json',
            },
          };

          await axios
            .put(
              `${address}/api/users/verify/${res.data.emailToken}`,
              null,
              config
            )
            .then((res) => {
              notify("yeah, you've done it");
              localStorage.setItem('userInfo', JSON.stringify(res.data));
              history.push('/admin/dashboard');
            })
            .catch((error) =>
              notify(
                error.response && error.response.data.message
                  ? error.response.data.message
                  : error.message,
                'danger'
              )
            );
        } else {
          throw new Error("You've typed the wrong code");
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
        // notify(err ? err.message : "You've done something wrong", 'danger');
      });
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
      {' '}
      <div className='react-notification-alert-container'>
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div
        className='row  align-items-center'
        style={{ width: '100vw', height: '95vh' }}
      >
        <div className='container'>
          <h2 style={{ color: 'black' }}>Verify your account</h2>
          <p style={{ color: 'black' }}>
            We emailed you in the mail box which you have informed <br /> Enter
            the code below to confirm your email address.
          </p>
          <div className='code-container'>
            <div id='firstOne' style={{ width: '684px' }}>
              <input
                id='secondOne'
                type='text'
                className='code'
                placeholder='0'
                min='0'
                max='9'
                maxLength='1'
                required
              />
              <input
                type='text'
                className='code'
                placeholder='0'
                min='0'
                max='9'
                maxLength='1'
                required
              />
              <input
                type='text'
                className='code'
                placeholder='0'
                min='0'
                max='9'
                maxLength='1'
                required
              />
              <input
                type='text'
                className='code'
                placeholder='0'
                min='0'
                max='9'
                maxLength='1'
                required
              />
              <input
                type='text'
                className='code'
                placeholder='0'
                min='0'
                max='9'
                maxLength='1'
                required
              />
              <input
                id='lastOne'
                type='text'
                className='code'
                placeholder='0'
                min='0'
                max='9'
                maxLength='1'
                required
              />
            </div>
          </div>
          <Button
            color='primary'
            onClick={() => {
              const codes = Array.from(document.querySelectorAll('.code'));
              handleSubmit(codes.reduce((acc, curr) => acc + curr.value, ''));
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};

export default Verify;

import { useEffect, useRef } from 'react';
import Spinner from 'components/Spinner/Spinner';
import NotificationAlert from 'react-notification-alert';
import { useState } from 'react';

const AccountDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
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
      <div className='content'>{isLoading ? <Spinner /> : <></>}</div>
    </>
  );
};

export default AccountDetails;

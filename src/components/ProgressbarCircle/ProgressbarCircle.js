import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import style from '../../assets/scss/black-dashboard-pro-react/MyCustomCSS/progressbarCircular.module.scss';
import Config from '../../config.json';
import NotificationAlert from 'react-notification-alert';

const ProgressbarCircle = ({
  handleAddIncomeCall,
  incomesObj,
  id,
  isTheLastOne,
}) => {
  console.log(isTheLastOne);
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

  useEffect(() => {
    if (handleAddIncomeCall) {
      handleAddIncome(incomesObj, id);
    } // eslint-disable-next-line
  }, [handleAddIncomeCall]);
  const [percentage, setPercentage] = useState(0);
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const handleAddIncome = async (incomesObj, id) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${login.token}`,
      },
      onUploadProgress: (progressEvent) => {
        setPercentage(
          parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          )
        );
      },
    };
    await axios
      .put(
        `${Config.SERVER_ADDRESS}/api/investments/${id}/incomes`,
        incomesObj,
        config
      )
      .then((response) => {
        if (id === isTheLastOne) {
          notify(`You have successfully bulk updated your investments`);
        }
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
      <div className='col-sm-3 col-md-2 pt-3'>
        <div className={style.progress} data-percentage={percentage}>
          <span className={style.progressLeft}>
            <span className={style.progressBar}></span>
          </span>
          <span className={style.progressRight}>
            <span className={style.progressBar}></span>
          </span>
          <div className={style.progressValue} style={{ fontSize: '14px' }}>
            {percentage}%
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressbarCircle;

import axios from 'axios';
import React from 'react';
import { useHistory } from 'react-router-dom';

const Verify = ({ location }) => {
  const address = process.env.REACT_APP_SERVER_ADDRESS;
  const history = useHistory();
  const getDataVerified = async () => {
    const emailToken = location.pathname.replace('/verify/users/', '');

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await axios
      .put(`${address}/api/users/verify/${emailToken}`, null, config)
      .then((res) => {
        console.log(res);
        history.push('/admin/dashboard');
      })
      .catch((error) => console.log(error));
    // const putMethod = {
    // method: 'PUT', // Method itself
    // headers: {
    //   'Content-type': 'application/json', // Indicates the content
    // },
    // body: JSON.stringify(emailToken), // We send data in JSON format
    // };

    // make the HTTP put request using fetch api
    // fetch(address, putMethod)
    //   .then((response) => response.json())
    //   .then((data) => console.log(data)) // Manipulate the data retrieved back, if we want to do something with it
    //   .catch((err) => console.log(err)); // Do something with the error
    // console.log(address);
  };
  getDataVerified();
  return <></>;
};

export default Verify;

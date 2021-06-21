import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Config from '../config.json';
const Test = () => {
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const [broker, setBroker] = useState('');
  const [brokers, setBrokers] = useState([]);
  useEffect(() => {
    const asyncFunction = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${login.token}`,
        },
      };
      const brokersFromTheAPI = await axios.get(
        `${Config.SERVER_ADDRESS}/api/brokers`,
        config
      );
      setBrokers(brokersFromTheAPI.data);
    };

    asyncFunction();
  }, []);

  return (
    <div className='content'>
      <select>
        <option value='' disabled={true}>
          Selecione uma opção
        </option>
        {brokers.map((broker) => (
          <option key={broker._id} value={broker._id}>
            {broker.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Test;

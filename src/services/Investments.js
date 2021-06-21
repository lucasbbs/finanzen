import axios from 'axios';
import Config from '../config.json';

export async function fetchInvestments(id = '', login) {
  let config = {};
  if (login !== undefined) {
    config = {
      headers: {
        Authorization: `Bearer ${login.token}`,
      },
    };
  }

  const res = await axios(
    `${Config.SERVER_ADDRESS}/api/investments/${id}`,
    config
  );
  return res.data;
}

export async function fetchArchiveInvestments(id = '', login) {
  let config = {};
  if (login !== undefined) {
    config = {
      headers: {
        Authorization: `Bearer ${login.token}`,
      },
    };
  }

  const res = await axios(
    `${Config.SERVER_ADDRESS}/api/investments/archive${id}`,
    config
  );
  return res.data;
}

export async function fetchAllInvestments(id = '', login) {
  let config = {};
  if (login !== undefined) {
    config = {
      headers: {
        Authorization: `Bearer ${login.token}`,
      },
    };
  }

  const res = await axios(
    `${Config.SERVER_ADDRESS}/api/investments/all${id}`,
    config
  );
  return res.data;
}

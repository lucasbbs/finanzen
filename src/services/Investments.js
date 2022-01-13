import axios from 'axios';

const address = process.env.REACT_APP_SERVER_ADDRESS;

export async function fetchInvestments(id = '', login) {
  let config = {};
  if (login !== undefined) {
    config = {
      headers: {
        Authorization: `Bearer ${login.token}`,
      },
    };
  }

  const res = await axios(`${address}/api/investments/${id}`, config);
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

  const res = await axios(`${address}/api/investments/archive${id}`, config);
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

  const res = await axios(`${address}/api/investments/all${id}`, config);
  return res.data;
}

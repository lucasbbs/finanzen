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

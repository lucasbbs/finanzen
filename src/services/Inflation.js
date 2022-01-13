import axios from 'axios';

export async function fetchInflation() {
  const response = await fetch(
    `https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json`
  );

  return await response.json();
}
export async function fetchInflationsFromLocalAPI(alpha2Code) {
  const address = process.env.REACT_APP_SERVER_ADDRESS;
  const inflations = await axios.get(`${address}/api/inflations/${alpha2Code}`);
  return inflations.data.values.map((inflation) => {
    const dateParts = Object.entries(inflation)[0][0].split('-');
    return {
      data: `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`,
      valor: Object.entries(inflation)[0][1].toFixed(2),
    };
  });
}

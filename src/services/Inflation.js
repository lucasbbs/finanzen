export async function fetchInflation() {
  const response = await fetch(
    `https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json`
  );

  return await response.json();
}

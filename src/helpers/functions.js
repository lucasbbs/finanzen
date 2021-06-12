import { addDays } from 'date-fns';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
// import { startOfMonth } from 'date-fns';

export function reverseFormatNumber(val, locale) {
  var group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, '');
  var decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, '');
  // try {
  var reversedVal = val
    .replace(new RegExp('\\' + group, 'g'), '')
    .replace(new RegExp('\\' + decimal, 'g'), '.')
    .replace(/[^0-9.]/g, '');
  // } catch (error) {
  //   console.log(error);
  // }

  return Number.isNaN(reversedVal) ? 0 : Number(reversedVal);
}

export function currencyFormat(label) {
  let formatCurrency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
  return formatCurrency.format(Number(label));
}

export var fullyloaded = false;

export const getDataForTheFirstChart = (
  income,
  firstPeriod = undefined,
  lastPeriod = undefined
) => {
  var isInitialUndefined = false;
  let dates = [];
  const incomesarray = [];

  income.forEach((data) => {
    dates = dates.concat([...data.incomes.map((key) => Object.keys(key)[0])]);
    incomesarray.push(...data.incomes.map((value) => Object.entries(value)[0]));
  });
  let datesSet = new Set(dates);
  datesSet = [...datesSet].sort();
  if (firstPeriod === undefined) {
    isInitialUndefined = true;
    firstPeriod = datesSet[0];
  }
  if (lastPeriod === undefined) {
    lastPeriod = datesSet[datesSet.length - 1];
  }

  const initialSlice = isInitialUndefined
    ? datesSet.indexOf(firstPeriod)
    : datesSet.indexOf(firstPeriod);
  const finalSlice = datesSet.sort().indexOf(lastPeriod) + 1;

  datesSet = datesSet.map((date) =>
    incomesarray.filter((e) => e[0].includes(date))
  );
  let labels = [];
  let values = [];
  datesSet.forEach((el) => {
    labels.push(
      ...new Set(
        el.map((date) =>
          format(addDays(new Date(date[0]), 1), 'MMM/yyyy', { locale: ptBR })
        )
      )
    );
    values.push(
      el.map((value) => value[1]).reduce((acc, curr) => acc + curr, 0)
    );
  });
  fullyloaded = true;
  labels = labels.slice(initialSlice, finalSlice);
  values = values.slice(initialSlice, finalSlice);

  return [values, labels];
};

export const handleSlicesOfInvestments = (
  investments,
  initialDate,
  finalDate
) => {
  const initialSlice =
    investments[1].indexOf(
      format(new Date(initialDate), 'MMM/yyyy', { locale: ptBR })
    ) === -1
      ? 0
      : investments[1].indexOf(
          format(new Date(initialDate), 'MMM/yyyy', { locale: ptBR })
        );
  const finalSlice =
    investments[1].indexOf(
      format(new Date(finalDate), 'MMM/yyyy', { locale: ptBR })
    ) + 1;

  return initialSlice !== -2 && finalSlice !== 0
    ? [
        investments[0].slice(initialSlice, finalSlice),
        investments[1].slice(initialSlice, finalSlice),
      ]
    : investments;
};

export const getDataForTheInflationChart = (
  inflation,
  firstPeriod = undefined,
  lastPeriod = undefined
) => {
  if (firstPeriod === undefined || firstPeriod === '-01') {
    firstPeriod = inflation[0].data;
  }
  if (lastPeriod === undefined || lastPeriod === '-01') {
    lastPeriod = inflation[inflation.length - 1].data;
  }

  let inflations = inflation.slice(
    inflation.map((e) => e.data).indexOf(firstPeriod),
    inflation.map((e) => e.data).indexOf(lastPeriod) + 1
  );
  const cumulativeProduct = ((product) => (value) => (product *= value))(1);

  inflations = inflations.map((inf) => {
    return {
      data: inf.data,
      valor: (cumulativeProduct(inf.valor) - 1) * 100,
    };
  });

  const labels = [];
  const values = [];
  inflations.forEach((e) => {
    labels.push(
      format(addDays(new Date(e.data), 1), 'MMM/yyyy', { locale: ptBR })
    );
    values.push(e.valor);
  });
  return [values, labels];
};

export const getDataForTheTopInvestmentsTable = (investments) => {
  const currentMonth = '2021-03-01';
  let incomes = investments.map((investment) =>
    investment.incomes.filter(
      (date) =>
        [investment.name, Object.entries(date)[0]][1][0] === currentMonth
    )
  );
  const indexes = [];
  for (let i = 0; i < incomes.length; i++) {
    incomes[i].length === 0 && indexes.push(i);
  }

  incomes = incomes.filter((e) => e.length !== 0);
  investments = investments.filter((e, index) => !(index in indexes));

  const returns = [];
  for (let i = 0; i < investments.length; i++) {
    returns.push([
      investments[i]._id,
      investments[i].name,
      Object.values(incomes[i][0])[0] /
        (investments[i].initial_amount + investments[i].accrued_income),
      investments[i].initial_amount + investments[i].accrued_income,
    ]);
  }
  return returns.sort((a, b) => b[2] - a[2]).slice(0, 7);
};
// Codigo usado para representar numero como percentuais
// .toLocaleString('pt-br', { style: 'percent', minimumFractionDigits: 2 }

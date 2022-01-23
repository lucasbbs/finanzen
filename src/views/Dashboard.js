// eslint-disable
import { addDays, format, parse } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import React, { useContext, useEffect, useState } from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// react plugin used to create charts
import { Line, Bar, Pie } from 'react-chartjs-2';
// react plugin for creating vector maps
import { VectorMap } from 'react-jvectormap';
// reactstrap components
//prettier-ignore
import { Button, ButtonGroup, Card, CardHeader, CardBody, CardFooter, CardTitle, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, Label, FormGroup, Input, Table, Row, Col, Form, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { countries } from './pages/countries';

// core components
//prettier-ignore
import { chartDefault } from 'variables/charts.js';
//prettier-ignore
import { currencyFormat, percentageFormat, decimalFormat, ISODateFormat, getDataForTheAverageInflationAllThePeriod, getDataForTheAverageYearlyBasisInflation, setDataAccountsSpendingCategories, setDataAccountsTotalExpensesAndRevenues, setDataAccountsSumExpesesGroupedByMonth, generateRandomColors, setDataForModalMonthlyPermformanceInvestments } from '../helpers/functions';
// eslint-disable-next-line
import TableTopInvestments from '../components/TableTopInvestments/TableTopInvestments';
import TableSalaries from '../components/TableSalaries/TableSalaries';
import { fetchInvestments, fetchAllInvestments } from '../services/Investments';
import {
  getDataForTheFirstChart,
  getDataForTheInflationChart,
  handleSlicesOfInvestments,
  getDataForTotalTaxes,
  getGlobalAverageReturn,
  getHowMuchMoneyToFinancialFreedom,
  getDataForTheInflationChartTotalPeriod,
  getTopInvestmentsByLocation,
  geometricMeanReturnInvestments,
} from '../helpers/functions';
import { fetchInflationsFromLocalAPI } from '../services/Inflation';
import Spinner from '../components/Spinner/Spinner';
import axios from 'axios';
import { GlobalContext } from 'context/GlobalState';
import CollapsibleItem from 'components/CollapsibleItem/CollapsibleItem';
import { chartExample2 } from 'variables/charts';
import { Link } from 'react-router-dom';
import MyTooltip from 'components/Tooltip/MyTooltip';

// import { Link } from 'react-router-dom';
import moment from 'moment';

/*eslint-disable*/
Array.prototype.max = function () {
  return Math.max.apply(null, this);
};

Array.prototype.min = function () {
  return Math.min.apply(null, this);
};

const Dashboard = () => {
  // console.log(
  //   process.env.REACT_APP_SERVER_ADDRESS,
  //   'That is the server address'
  // );
  const { accounts, updateAccounts } = useContext(GlobalContext);
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const [incomesArray, setIncomesArray] = useState([]);
  const [dateInput, setDateInput] = useState('');
  const [selectedAccountId1, setSelectedAccountId1] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).graph1Account
      : null
  );
  const [selectedAccount1, setSelectedAccount1] = useState('');
  const [selectedAccountId2, setSelectedAccountId2] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).graph2Account
      : null
  );
  const [selectedAccount2, setSelectedAccount2] = useState('');
  const [selectedAccountId3, setSelectedAccountId3] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).graph3Account
      : null
  );
  const [selectedAccount3, setSelectedAccount3] = useState('');
  const [revenues, setRevenues] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balance, setBalance] = useState([]);
  const [balanceLabels, setBalanceLabels] = useState([]);

  const [firstMonth, setFirstMonth] = useState('');
  const [lastMonth, setLastMonth] = useState('');

  const [lines, setLines] = useState([]);
  const [geometricMeane, setGeometricMeane] = useState(0);

  // const [loadedCurrencies, setLoadedCurrencies] = useState(false);
  const [equivalentAnnualRate, setEquivalentAnnualRate] = useState(
    '0,0000000000%'
  );
  const [topSpendingCategories, setTopSpendingCategories] = useState([]);
  const [dateForTopInvestments, setDateForTopInvestments] = useState(
    `${new Date().toISOString().slice(0, 8)}01`
  );
  const [currencyExhangeRates, setCurrencyExhangeRates] = useState({});
  const [mapData, setMapData] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [
    dataForInvestmentsTopLocation,
    setdataForInvestmentsTopLocation,
  ] = useState([]);
  const [kindOfInflation, setKindOfInflation] = useState('movingAverage');
  const [
    inflationsForTheTotalPeriod,
    setInflationsForTheTotalPeriod,
  ] = useState([]);
  const [globalAverageReturn, setGlobalAverageReturn] = useState(
    '0,0000000000%'
  );
  const [currencies, setCurrencies] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [taxesToBeDisplayed, setTaxesToBeDisplayed] = useState(0);
  const [filterForTaxes, setFilterForTaxes] = useState('');
  // const [filterForReturn, setFilterForReturn] = useState('');
  const [filterForGlobalAverage, setFilterForGlobalAverage] = useState('');
  const [investments, setInvestments] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [investmentsToBeDisplayed, setInvestmentsToBeDisplayed] = useState([]);
  const [inflations, setInflations] = useState([]);
  const [inflationsToBeDisplayed, setInflationsToBeDisplayed] = useState([]);
  const [
    inflationsAverageToBeDisplayed,
    setInflationsAverageToBeDisplayed,
  ] = useState([]);
  const [inflation12Months, setInflation12Months] = useState([]);
  const [
    dataChartInvetmentsPerBrokers,
    setDataChartInvetmentsPerartBrokers,
  ] = useState([]);
  const [modalBankStatements, setModalBankStatements] = useState(false);
  const [
    modalInvestmentsPerformancePerMonth,
    setModalInvestmentsPerformancePerMonth,
  ] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [modal3, setModal3] = useState(false);
  const [bigChartData, setbigChartData] = useState('data1');

  const toggleModalInvestmentsPerformancePerMonth = () => {
    setDateInput('');
    setModalInvestmentsPerformancePerMonth(
      !modalInvestmentsPerformancePerMonth
    );
  };
  const toggle1 = () => {
    setModal1(!modal1);
  };
  const toggle2 = () => {
    setModal2(!modal2);
  };
  const toggle3 = () => {
    setModal3(!modal3);
  };

  const setBgChartData = (name) => {
    setbigChartData(name);
  };

  const handleTransactions = (value) => {
    setTransactions([...transactions, value]);
  };

  const address = process.env.REACT_APP_SERVER_ADDRESS;
  useEffect(() => {
    const getTransactions = async () => {
      const config = { headers: { Authorization: `Bearer ${login.token}` } };
      const res = await axios.get(`${address}/api/transactions`, config);
      setTransactions(res.data.transactions);
    };
    getTransactions();
  }, []);

  useEffect(() => {
    if (dateInput) {
      const date = format(
        parse(dateInput, 'MMM/yyyy', new Date()),
        'yyyy-MM-dd'
      );

      const incomeArray = setDataForModalMonthlyPermformanceInvestments(
        investments,
        date
      );
      const objArray = [];
      incomeArray.forEach((income) => {
        const obj = { ...income[0] };
        obj.incomes = income[1];
        objArray.push(obj);
      });

      setIncomesArray(objArray);
      toggleModalInvestmentsPerformancePerMonth();
    }
  }, [investments, dateInput]);

  useEffect(() => {
    const getInflations = async () => {
      const inflation = await fetchInflationsFromLocalAPI(login.country); //fetchInflation();

      inflation.forEach((inf) => {
        const dataPartes = inf.data.split('/');
        inf.data = `${dataPartes[2]}-${dataPartes[1]}-${dataPartes[0]}`;
        inf.valor = Number(inf.valor) / 100 + 1;
      });
      setInflations(inflation);
      setInflation12Months(getDataForTheInflationChart(inflation));
      setInflationsToBeDisplayed(getDataForTheInflationChart(inflation));

      getDataForTheInflationChartTotalPeriod(inflation);

      setInflationsAverageToBeDisplayed(
        getDataForTheAverageYearlyBasisInflation(inflation)
      );
      setInflationsForTheTotalPeriod(
        getDataForTheInflationChartTotalPeriod(inflation)
      );
    };

    getInflations();
  }, []);
  useEffect(() => {
    if (accounts && accounts.length) {
      setSelectedAccount1(
        selectedAccountId1
          ? accounts.find((account) => account._id === selectedAccountId1)
          : accounts[0]
      );

      setSelectedAccount2(
        selectedAccountId2
          ? accounts.find((account) => account._id === selectedAccountId2)
          : accounts[0]
      );

      setSelectedAccount3(
        selectedAccountId3
          ? accounts.find((account) => account._id === selectedAccountId3)
          : accounts[0]
      );
    }
    const getInvestments = async () => {
      const investment = await fetchAllInvestments('', login);
      setGeometricMeane(geometricMeanReturnInvestments(investment));
      const currentInvestments = await fetchInvestments('', login);

      setInvestments(investment);

      if (dataForInvestmentsTopLocation.length === 0) {
        const topLocations = getTopInvestmentsByLocation(
          currentInvestments.investments
        );

        const config = {
          headers: {
            Authorization: `Bearer ${login.token}`,
            'Content-Type': 'application/json',
          },
        };

        const locationsForLoop = new Set();
        topLocations.forEach((location) => locationsForLoop.add(location[1]));

        Object.values(accounts).forEach((location) =>
          locationsForLoop.add(location.currency)
        );

        locationsForLoop.add(login.currency);
        setCurrencies([...locationsForLoop]);

        // for (const location of locationsForLoop) {
        // if (
        //   location !== login.currency &&
        //   !(`${location}_${login.currency}` in currencyExhangeRates)
        // ) {
        // try {
        if (Object.keys(currencyExhangeRates).length === 0) {
          axios
            .post(
              `${address}/api/exchanges`,
              {
                currencies: Array.from(locationsForLoop),
                localCurrency: login.currency,
              },
              config
            )
            .then((res) => {
              // console.log(res.data);
              setCurrencyExhangeRates(res.data);
            });
        }
        // } catch (error) {
        //   currencyExhangeRates[`${location}_${login.currency}`] = 1.5;
        // }
        if (Object.keys(currencyExhangeRates).length !== 0) {
          for (const location of Array.from(currencyExhangeRates)) {
            // console.log(location);
            mapdata[location[0]] = mapdata[location[0]] || 0;
            mapdata[location[0]] += location[2] * Object.values(location)[0];
          }
          // console.log(topLocations);
          topLocations.sort((a, b) => b[2] - a[2]);
          setdataForInvestmentsTopLocation(topLocations);
          const mapdata = {};
          topLocations.forEach((location) => {
            mapdata[location[0]] = mapdata[location[0]] || 0;
            mapdata[location[0]] +=
              currencyExhangeRates[`${location[1]}_${login.currency}`] *
              location[2];
          });
          setMapData(mapdata);
        }

        // } else {
        //   if (!(`${location}_${login.currency}` in currencyExhangeRates)) {
        //     currencyExhangeRates[`${location}_${login.currency}`] = 1;
        //   }
        // }
        // }
      }
      if (Object.keys(currencyExhangeRates).length !== 0) {
        const dataForTheFirstChart = getDataForTheFirstChart(
          investment,
          undefined,
          undefined,
          currencyExhangeRates,
          login.currency
        );
        setIncomes(dataForTheFirstChart);
        setInvestmentsToBeDisplayed(dataForTheFirstChart);
        const brokers = [
          ...new Set(
            currentInvestments.investments.map((invest) => invest.broker.name)
          ),
        ];
        const somas = [];
        for (let i = 0; i < brokers.length; i++) {
          let soma = 0;
          for (let j = 0; j < currentInvestments.investments.length; j++) {
            if (currentInvestments.investments[j].broker.name === brokers[i]) {
              soma +=
                currentInvestments.investments[j].broker.currency !==
                login.currency
                  ? (currentInvestments.investments[j].initial_amount +
                      currentInvestments.investments[j].accrued_income) *
                    currencyExhangeRates[
                      `${currentInvestments.investments[j].broker.currency}_${login.currency}`
                    ]
                  : currentInvestments.investments[j].initial_amount +
                    currentInvestments.investments[j].accrued_income;
            }
          }
          somas.push(soma);
        }
        setDataChartInvetmentsPerartBrokers([[...somas], [...brokers]]);
      }
    };
    if (dataChartInvetmentsPerBrokers.length === 0) {
      getInvestments();
    }
    // let newDate = new Date().toISOString();
    // newDate = newDate.split('T');
    if (incomes.length !== 0) {
      // let date =
      //   Incomes[1].length !== 0
      //     ? parse(Incomes[1][Incomes[1].length - 1], 'MMM/yyyy', new Date(), {
      //         locale: ptBR,
      //       })
      //     : new Date();

      setGlobalAverageReturn(percentageFormat(geometricMeane));
      setEquivalentAnnualRate(percentageFormat((geometricMeane + 1) ** 12 - 1));

      setFilterForGlobalAverage('');
    }
  }, [investments, incomes, accounts]);
  useEffect(() => {
    setTopSpendingCategories(
      setDataAccountsSpendingCategories(selectedAccount1, transactions)
    );
    let res = setDataAccountsTotalExpensesAndRevenues(
      selectedAccount2,
      transactions
    );

    setExpenses(res[0]);
    setRevenues(res[1]);
    setBalance(res[2]);
    setBalanceLabels(
      res[2][1].map((date) =>
        format(parse(date, 'yyyy-MM', new Date()), 'MMM/yy')
      )
    );
    res = setDataAccountsSumExpesesGroupedByMonth(
      selectedAccount3,
      transactions
    );

    const colors = generateRandomColors(res[1].length);
    setLines([
      res[0],
      res[1].map((el, idx) => ({
        label: el.category,
        fill: false,
        borderColor: colors[idx],
        data: el.transactions,
      })),
    ]);

    // console.log(
    //   res[1].map((el, idx) => ({
    //     label: el.category,
    //     fill: true,
    //     borderColor: colors[idx],
    //     data: el.transactions,
    //   }))
    // );
    //
  }, [selectedAccount1, selectedAccount2, selectedAccount3, transactions]);
  // eslint-disable-next-line

  const handleFilterForTaxes = (input) => {
    setTaxesToBeDisplayed(taxes[1][taxes[0].indexOf(`${input}-01`)]);
  };

  const handleFilterForGlobalAverage = (input) => {
    setGlobalAverageReturn(
      percentageFormat(getGlobalAverageReturn(investments, `${input}-01`))
    );
    setEquivalentAnnualRate(
      percentageFormat(
        ((getGlobalAverageReturn(investments, `${input}-01`) / 100 + 1) ** 12 -
          1) *
          100
      )
    );
  };

  const chartExample8 = {
    data: {
      labels: balanceLabels,
      datasets: [
        {
          label: 'Expenses',
          fill: true,
          backgroundColor: 'rgb(0, 130, 200)',
          hoverBackgroundColor: ' rgb(0, 130, 200)',
          borderColor: 'rgb(0, 130, 200)',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          data: expenses[0],
        },
        {
          label: 'Revenue',
          fill: true,
          backgroundColor: 'rgb(166, 204, 234)',
          hoverBackgroundColor: 'rgb(166, 204, 234)',
          borderColor: 'rgb(166, 204, 234)',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          data: revenues[0],
        },
        {
          label: 'Balance',
          fill: true,
          backgroundColor: 'rgb(204, 20, 57)',
          hoverBackgroundColor: '  rgb(204, 20, 57)',
          borderColor: 'rgb(204, 20, 57)',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          data: balance[0],
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          padding: 8,
          boxWidth: 11,
          boxHeight: 14,
          fontColor: 'white',
          fontSize: 11.5,
        },
      },
      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: 'nearest',
        intersect: 0,
        position: 'nearest',
        callbacks: {
          label: function (tooltipItem, data) {
            var indice = tooltipItem.index;
            var label = data.datasets[tooltipItem.datasetIndex].label + ': ';
            return `${label}:  ${currencyFormat(
              data.datasets[tooltipItem.datasetIndex].data[indice],
              selectedAccount2.currency
            )}`;
          },
        },
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            gridLines: {
              drawBorder: true,
              color: 'white',
              zeroLineColor: 'white',
            },
            ticks: {
              maxTicksLimit: 5,
              padding: 20,
              fontColor: 'white',
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              drawBorder: false,
            },
            ticks: {
              padding: 20,
              fontColor: 'white',
            },
          },
        ],
      },
    },
  };
  const chartExample10 = {
    data: {
      labels: topSpendingCategories[1],
      datasets: [
        {
          label: 'Emails',
          pointRadius: 0,
          pointHoverRadius: 0,
          backgroundColor: [
            'rgb(0, 130, 200)',
            'rgb(191, 229, 255)',
            'rgb(204, 20, 57)',
            'rgb(230, 140, 124)',
            'rgb(83, 179, 54)',
            'rgb(165, 211, 142)',
            'rgb(230, 138, 0)',
            'rgb(243, 218, 97)',
            'rgb(151, 107, 179)',
            'rgb(204, 184, 204)',
          ],

          borderWidth: 0,
          data: topSpendingCategories[0],
        },
      ],
    },
    options: {
      cutoutPercentage: 0,
      legend: {
        display: true,

        position: 'bottom',
        labels: {
          padding: 8,
          boxWidth: 11,
          boxHeight: 14,
          fontColor: 'white',
          fontSize: 11.5,
        },
      },
      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: 'nearest',
        intersect: 0,
        position: 'nearest',
        callbacks: {
          label: function (tooltipItem, data) {
            var indice = tooltipItem.index;
            var label = data.datasets[tooltipItem.datasetIndex].label + ': ';

            return `${data.labels[indice]}:  ${currencyFormat(
              data.datasets[tooltipItem.datasetIndex].data[indice],
              selectedAccount1.currency
            )}`;
          },
        },
      },
      scales: {
        yAxes: [
          {
            display: 0,
            ticks: {
              display: false,
            },
            gridLines: {
              drawBorder: false,
              zeroLineColor: 'transparent',
              color: 'rgba(255,255,255,0.05)',
            },
          },
        ],
        xAxes: [
          {
            display: 0,
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(255,255,255,0.1)',
              zeroLineColor: 'transparent',
            },
            ticks: {
              display: false,
            },
          },
        ],
      },
    },
  };
  let chart1_2_options = {
    onClick:
      bigChartData === 'data1'
        ? function (c, i) {
            let e = i[0];
            if (e !== undefined) {
              // console.log(e._index);
              var x_value = this.data.labels[e._index];
              var y_value = this.data.datasets[0].data[e._index];
              setDateInput(x_value);
              // console.log(y_value);
            }
          }
        : null,
    maintainAspectRatio: false,
    legend: {
      display: false,
      onHover: function (e) {
        e.target.style.cursor =
          bigChartData === 'data1' ? 'pointer' : 'default';
      },
    },
    hover: {
      onHover: function (e) {
        var point = this.getElementAtEvent(e);
        if (point.length)
          e.target.style.cursor =
            bigChartData === 'data1' ? 'pointer' : 'default';
        else e.target.style.cursor = 'default';
      },
    },
    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: 'nearest',
      intersect: 0,
      position: 'nearest',
      callbacks: {
        label: function (tooltipItem, data) {
          var indice = tooltipItem.index;
          var label = data.datasets[tooltipItem.datasetIndex].label + ': ';
          return bigChartData === 'data1'
            ? `${data.labels[indice]}:  ${currencyFormat(
                data.datasets[tooltipItem.datasetIndex].data[indice],
                login.currency
              )}`
            : (label += new Intl.NumberFormat('pt-BR', {
                style: 'percent',
                minimumFractionDigits: 2,
              }).format(tooltipItem.value));

          // console.log(data.datasets[context.datasetIndex]); //[context.dataseIndex]);
        },

        // `${data.labels[indice]}:  ${(
        //     data.datasets[0].data[indice] / 100
        //   ).toLocaleString('pt-br', {
        //     style: 'percent',
        //     minimumFractionDigits: 2,
        //   })}
        // `;
      },
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: 'transparent',
          },
          ticks: {
            count: 0,
            callback: (label) =>
              bigChartData === 'data1'
                ? currencyFormat(Number(label), login.currency)
                : Number(label).toLocaleString('pt-br', {
                    style: 'percent',
                    minimumFractionDigits: 2,
                  }),
            suggestedMin: 60,
            padding: 20,
            fontColor: '#9a9a9a',
          },
        },
      ],
      xAxes: [
        {
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: 'transparent',
          },
          ticks: {
            padding: 20,
            fontColor: '#9a9a9a',
          },
        },
      ],
    },
  };
  if (bigChartData === 'data2') {
    chart1_2_options.scales.yAxes.ticks = {
      ...chart1_2_options.scales.yAxes.ticks,
      ...{
        suggestedMax: Math.ceil(inflationsToBeDisplayed[0].max() / 10) * 10,
      },
    };
  }

  let chartExample1 = {
    data1: (canvas) => {
      let ctx = canvas.getContext('2d');

      let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

      gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
      gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
      gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors

      return {
        gradientStroke,
        labels: investmentsToBeDisplayed[1],
        datasets: [
          {
            label: 'Income',
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#1f8ef1',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#1f8ef1',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#1f8ef1',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: investmentsToBeDisplayed[0],
          },
        ],
      };
    },
    data2: (canvas) => {
      let ctx = canvas.getContext('2d');

      let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

      gradientStroke.addColorStop(1, 'rgba(237, 248, 29,0.3)');
      gradientStroke.addColorStop(0.4, 'rgba(237, 248, 29,0.1)');
      gradientStroke.addColorStop(0, 'rgba(237, 248, 29,0)'); //yellow colors

      let redColor = ctx.createLinearGradient(0, 230, 0, 50);

      redColor.addColorStop(1, 'rgba(255, 68, 36,0.3)');
      redColor.addColorStop(0.4, 'rgba(255, 68, 36,0.1)');

      redColor.addColorStop(0, 'rgba(255, 68, 36,0.0)'); //red colors

      return {
        gradientStroke,
        labels: inflationsToBeDisplayed[1],
        datasets: [
          {
            label: 'Inflation',
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: 'rgba(237, 248, 29)',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: 'rgba(237, 248, 29)',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: 'rgba(237, 248, 29)',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: inflationsToBeDisplayed[0], //
          },
          {
            label: 'Average Inflation',
            fill: true,
            backgroundColor: redColor,
            borderColor: 'rgba(255, 68, 36)',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: 'rgba(255, 68, 36)',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: 'rgba(255, 68, 36)',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: inflationsAverageToBeDisplayed[0], //
          },
        ],
      };
    },
    options: chart1_2_options,
  };
  // #########################################
  // // // used inside src/views/Dashboard.js
  // #########################################

  function handleFilter() {
    const initialDate = document.querySelector('#InitialDate').value;
    const finalDate = document.querySelector('#FinalDate').value;
    if (kindOfInflation === 'movingAverage') {
      setInflationsToBeDisplayed(
        getDataForTheInflationChart(
          inflations,
          initialDate + '-01',
          finalDate + '-01'
        )
      );
      setInflationsAverageToBeDisplayed(
        getDataForTheAverageYearlyBasisInflation(
          inflations,
          initialDate + '-01',
          finalDate + '-01'
        )
      );
    } else {
      setInflationsToBeDisplayed(
        getDataForTheInflationChartTotalPeriod(
          inflations,
          initialDate + '-01',
          finalDate + '-01'
        )
      );
      setInflationsAverageToBeDisplayed(
        getDataForTheAverageInflationAllThePeriod(
          inflations,
          initialDate + '-01',
          finalDate + '-01'
        )
      );
    }

    setInvestmentsToBeDisplayed(
      handleSlicesOfInvestments(incomes, initialDate + '-02', finalDate + '-02')
    );
  }

  const handleCurrentMoney = async (salary) => {
    const config = { headers: { Authorization: `Bearer ${login.token}` } };
    accounts[login.currency] += salary;

    await axios
      .put(
        `${address}/api/users/${login._id}`,
        { fundsToInvest: accounts, salary: salary },
        config
      )
      .then((res) => {
        //   // login['fundsToInvest'] = accounts;
        //setCurrentMoney(accounts);
        //   // // setFundsToBeInvested;
        //   // localStorage.setItem('userInfo', JSON.stringify(login));
        updateAccounts();
      });
  };

  const handleTotalMoney = (array) => {
    let total = 0;
    if (array) {
      for (const account of array) {
        total +=
          (account['initialAmmount'] +
            account['dueToAccount'].reduce(
              (acc, curr) =>
                curr.type === 'Expense' || curr.type === 'Transfer'
                  ? acc - curr.ammount
                  : acc + curr.ammount,
              0
            ) +
            account['dueFromAccount'].reduce(
              (acc, curr) =>
                curr.exchangeRate
                  ? acc + curr.ammount * curr.exchangeRate
                  : acc + curr.ammount,
              0
            )) *
          currencyExhangeRates[`${account['currency']}_${login.currency}`];
      }
      return total;
    }
  };

  const handleShowAccountStatements = () => {
    setModalBankStatements(!modalBankStatements);
  };

  const closeBtn = (fn) => {
    return (
      <button className='close' onClick={() => fn()}>
        <span style={{ color: 'white' }}>×</span>
      </button>
    );
  };

  useEffect(() => {
    const taxesInUseEffects = getDataForTotalTaxes(
      investments,
      currencyExhangeRates,
      login.currency
    );
    setTaxes(taxesInUseEffects);

    setTaxesToBeDisplayed(
      taxesInUseEffects[1].reduce((acc, curr) => acc + curr, 0)
    );
  }, [investments, currencyExhangeRates]);

  const handleDefineAccount1 = async () => {
    const account = accounts.find(
      (account) => account._id === selectedAccountId1
    );
    const config = { headers: { Authorization: `Bearer ${login.token}` } };
    await axios.put(
      `${address}/api/users/graph1account`,
      {
        graph1Account: selectedAccountId1,
      },
      config
    );

    login['graph1Account'] = selectedAccountId1;

    localStorage.setItem('userInfo', JSON.stringify(login));
    setSelectedAccount1(account);
    toggle1();
  };
  const handleDefineAccount2 = async () => {
    const account = accounts.find(
      (account) => account._id === selectedAccountId2
    );
    const config = { headers: { Authorization: `Bearer ${login.token}` } };
    await axios.put(
      `${address}/api/users/graph2account`,
      {
        graph2Account: selectedAccountId2,
      },
      config
    );

    login['graph2Account'] = selectedAccountId2;

    localStorage.setItem('userInfo', JSON.stringify(login));
    setSelectedAccount2(account);
    toggle2();
  };
  const handleDefineAccount3 = async () => {
    const account = accounts.find(
      (account) => account._id === selectedAccountId3
    );
    const config = { headers: { Authorization: `Bearer ${login.token}` } };
    await axios.put(
      `${address}/api/users/graph3account`,
      {
        graph3Account: selectedAccountId3,
      },
      config
    );

    login['graph3Account'] = selectedAccountId3;

    localStorage.setItem('userInfo', JSON.stringify(login));

    setSelectedAccount3(account);
    toggle3();
  };

  return (
    <>
      <div className='content'>
        {!dataChartInvetmentsPerBrokers.length ||
        !investmentsToBeDisplayed.length ? (
          <>
            <Spinner />
          </>
        ) : (
          <>
            <Modal
              modalClassName='modal-black'
              size='lg'
              style={{ maxWidth: '1600px', width: '80%' }}
              isOpen={modalInvestmentsPerformancePerMonth}
              toggle={() => toggleModalInvestmentsPerformancePerMonth()}
            >
              <ModalHeader
                close={closeBtn(toggleModalInvestmentsPerformancePerMonth)}
              >
                Investments Performance per Month
              </ModalHeader>
              <ModalBody>
                <Table>
                  <thead>
                    <tr>
                      <th
                        style={{
                          maxWidth: '200px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          display: 'inline-block',
                          textOverflow: 'ellipsis',
                          minWidth: '30px',
                        }}
                      >
                        Name
                      </th>
                      <th>Broker</th>
                      <th>Type</th>
                      <th>Rate</th>
                      <th>Investment date</th>
                      <th>Due date</th>
                      <th>Initial amount</th>
                      <th
                        style={{
                          maxWidth: '200px',
                          overflow: 'hidden',
                          display: 'inline-block',
                          textOverflow: 'ellipsis',
                          minWidth: '80px',
                          textAlign: 'center',
                        }}
                      >
                        Yield in the period
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomesArray.map((income) => (
                      <tr key={income._id}>
                        <td>
                          <Link
                            to={`/admin/investment/${income._id}`}
                            onClick={toggleModalInvestmentsPerformancePerMonth}
                          >
                            <span
                              id={`Tooltip-${income._id}`}
                              style={{
                                height: '20px',
                                maxWidth: '200px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                display: 'inline-block',
                                textOverflow: 'ellipsis',
                                minWidth: '30px',
                              }}
                            >
                              {income.name}
                              <MyTooltip
                                placement='left'
                                target={`Tooltip-${income._id}`}
                              >
                                {income.name}
                                <br />
                              </MyTooltip>
                            </span>
                          </Link>
                        </td>
                        <td>{income.broker.name}</td>
                        <td>{income.type}</td>
                        <td>{income.rate}</td>
                        <td>
                          {moment(income.investment_date).format('DD/MM/YYYY')}
                        </td>
                        <td>{moment(income.due_date).format('DD/MM/YYYY')}</td>
                        <td>
                          {currencyFormat(
                            income.initial_amount,
                            income.broker.currency
                          )}
                        </td>
                        <td>
                          <div
                            style={{
                              height: '20px',
                              maxWidth: '180px',
                              overflow: 'hidden',
                              display: 'inline-block',
                              textOverflow: 'ellipsis',
                              minWidth: '80px',
                              textAlign: 'right',
                            }}
                          >
                            <span>
                              {currencyFormat(
                                income.incomes.value - income.incomes.tax,
                                income.broker.currency
                              )}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    {currencies.map((currency) => (
                      <tr key={currency}>
                        <td>Total by Currency</td>
                        <td>{currency}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          {currencyFormat(
                            incomesArray
                              .filter((inv) => inv.broker.currency === currency)
                              .reduce(
                                (acum, curr) => acum + curr.initial_amount,
                                0
                              ),
                            currency
                          )}
                        </td>
                        <td>
                          <div
                            style={{
                              height: '20px',
                              maxWidth: '180px',
                              overflow: 'hidden',
                              display: 'inline-block',
                              textOverflow: 'ellipsis',
                              minWidth: '80px',
                              textAlign: 'right',
                            }}
                          >
                            <span>
                              {currencyFormat(
                                incomesArray
                                  .filter(
                                    (inv) => inv.broker.currency === currency
                                  )
                                  .reduce(
                                    (acum, curr) =>
                                      acum +
                                      Number(
                                        (
                                          curr.incomes.value - curr.incomes.tax
                                        ).toFixed(2)
                                      ),
                                    0
                                  ),
                                currency
                              )}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td>Grand Total</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        <div
                          style={{
                            height: '20px',
                            maxWidth: '180px',
                            overflow: 'hidden',
                            display: 'inline-block',
                            textOverflow: 'ellipsis',
                            minWidth: '80px',
                            textAlign: 'right',
                          }}
                        >
                          <span>
                            {currencyFormat(
                              Number(
                                currencies
                                  .map(
                                    (currency) =>
                                      incomesArray
                                        .filter(
                                          (inv) =>
                                            inv.broker.currency === currency
                                        )
                                        .reduce(
                                          (acum, curr) =>
                                            acum +
                                            Number(
                                              (
                                                curr.incomes.value -
                                                curr.incomes.tax
                                              ).toFixed(2)
                                            ),
                                          0
                                        ) *
                                      currencyExhangeRates[
                                        `${currency}_${login.currency}`
                                      ]
                                  )
                                  .reduce((acum, curr) => acum + curr, 0)
                                  .toFixed(2)
                              ),
                              login.currency
                            )}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </Modal>
            <Modal
              isOpen={modal1}
              toggle={() => toggle1()}
              modalClassName='modal-black'
              keyboard={true}
            >
              <ModalHeader close={closeBtn(toggle1)}>Settings</ModalHeader>
              <ModalBody>
                <Label htmlFor='accountSelectorId'>
                  Select an account for Top 10 Spending Categories for the
                  period Chart
                </Label>
                <Input
                  id='accountSelectorId'
                  style={{ backgroundColor: '#2b3553' }}
                  type='select'
                  value={selectedAccountId1}
                  onChange={(e) =>
                    setSelectedAccountId1(
                      accounts.find((account) => account._id === e.target.value)
                        ._id
                    )
                  }
                >
                  <option value='' disabled selected>
                    Select an option
                  </option>
                  {accounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.name}
                    </option>
                  ))}
                </Input>
                <Row className='mt-2'>
                  <Col md={6}>
                    <Label htmlFor='firstMonthId'>
                      Filter by initial month
                    </Label>
                    <Input
                      id='firstMonthId'
                      style={{ backgroundColor: '#2b3553' }}
                      type='month'
                      onChange={(e) => setFirstMonth(e.target.value)}
                      value={firstMonth}
                    />
                  </Col>
                  <Col md={6}>
                    <Label htmlFor='lastMonthId'>Filter by last month</Label>
                    <Input
                      id='lastMonthId'
                      style={{ backgroundColor: '#2b3553' }}
                      type='month'
                      onChange={(e) => setLastMonth(e.target.value)}
                      value={lastMonth}
                    />
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={() => {
                    handleDefineAccount1();
                    setTopSpendingCategories(
                      setDataAccountsSpendingCategories(
                        selectedAccount1,
                        transactions,
                        firstMonth,
                        lastMonth
                      )
                    );
                  }}
                  color='success'
                >
                  Define
                </Button>
              </ModalFooter>
            </Modal>
            <Modal
              isOpen={modal2}
              toggle={() => toggle2()}
              modalClassName='modal-black'
              keyboard={true}
            >
              <ModalHeader close={closeBtn(toggle2)}>Settings</ModalHeader>
              <ModalBody>
                <Label htmlFor='accountSelectorId'>
                  Select an account for the Total Expenses x Total Revenues
                  Chart
                </Label>
                <Input
                  id='accountSelectorId'
                  style={{ backgroundColor: '#2b3553' }}
                  type='select'
                  value={selectedAccountId2}
                  onChange={(e) =>
                    setSelectedAccountId2(
                      accounts.find((account) => account._id === e.target.value)
                        ._id
                    )
                  }
                >
                  <option value='' disabled selected>
                    Select an option
                  </option>
                  {accounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.name}
                    </option>
                  ))}
                </Input>
              </ModalBody>
              <ModalFooter>
                <Button onClick={handleDefineAccount2} color='success'>
                  Define
                </Button>
              </ModalFooter>
            </Modal>
            <Modal
              isOpen={modal3}
              toggle={() => toggle3()}
              modalClassName='modal-black'
              keyboard={true}
            >
              <ModalHeader close={closeBtn(toggle3)}>Settings</ModalHeader>
              <ModalBody>
                <Label htmlFor='accountSelectorId'>
                  Select an account for the Sum of Expenses Grouped by Month
                  Chart
                </Label>
                <Input
                  id='accountSelectorId'
                  style={{ backgroundColor: '#2b3553' }}
                  type='select'
                  value={selectedAccountId3}
                  onChange={(e) =>
                    setSelectedAccountId3(
                      accounts.find((account) => account._id === e.target.value)
                        ._id
                    )
                  }
                >
                  <option value='' disabled selected>
                    Select an option
                  </option>
                  {accounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.name}
                    </option>
                  ))}
                </Input>
              </ModalBody>
              <ModalFooter>
                <Button onClick={handleDefineAccount3} color='success'>
                  Define
                </Button>
              </ModalFooter>
            </Modal>

            <Modal
              isOpen={modalBankStatements}
              modalClassName='modal-black'
              keyboard={true}
              scrollable={true}
              toggle={() => handleShowAccountStatements()}
              style={{
                position: 'fixed',
                left: '50%',
                top: '40%',
                maxHeight: '600px',
                minWidth: '700px',
                background:
                  'linear-gradient(180deg,#222a42 0,#1d253b)!important',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <ModalHeader
                close={closeBtn(handleShowAccountStatements)}
                toggle={() => handleShowAccountStatements()}
              >
                Check your account statements
              </ModalHeader>
              <ModalBody>
                <Card>
                  <CardHeader>
                    <CardTitle tag='h3'>Account Statements</CardTitle>
                  </CardHeader>

                  <div
                    aria-multiselectable={true}
                    className='card-collapse'
                    id='accordion'
                    role='tablist'
                  >
                    {accounts
                      ? accounts.map((account) => (
                          <CollapsibleItem
                            id={account._id}
                            transactions={transactions.filter(
                              (transact) =>
                                transact.dueToAccount?._id === account._id ||
                                transact.dueFromAccount?._id === account._id
                            )}
                            key={account._id}
                            name={account.name}
                            currency={account.currency}
                            initialAmmount={account.initialAmmount}
                            balance={account.balance}
                            icon={account.icon}
                          />
                        ))
                      : null}
                  </div>
                </Card>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </Modal>
            <Row>
              <Col xs='12'>
                <h1 className='card-title'>
                  <i className='tim-icons icon-chart-pie-36'></i> Dashboard
                </h1>
                <Card className='card-chart'>
                  <CardHeader>
                    <Row>
                      <Col md='12'>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <Form inline>
                            <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                              <Col sm='12'>
                                <Label for='InitialDate'>
                                  Inform a initial date
                                </Label>
                                <Input
                                  className='borderColor'
                                  id='InitialDate'
                                  type='month'
                                  min={format(
                                    ISODateFormat(inflations[0]['data']),
                                    'yyyy-MM'
                                    // { locale: ptBR }
                                  )}
                                  max={
                                    //prettier-ignore
                                    format(ISODateFormat(inflations[inflations.length - 1]['data']), 'yyyy-MM', 
                                    // { locale: ptBR }
                                    )
                                  }
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                              <Col sm='12'>
                                <Label for='FinalDate'>
                                  Inform a final date
                                </Label>
                                <Input
                                  className='borderColor'
                                  id='FinalDate'
                                  type='month'
                                  min={format(
                                    ISODateFormat(inflations[0]['data']),
                                    'yyyy-MM'
                                    // { locale: ptBR }
                                  )}
                                  max={format(
                                    ISODateFormat(
                                      inflations[inflations.length - 1]['data']
                                    ),
                                    'yyyy-MM'
                                    // { locale: ptBR }
                                  )}
                                />
                              </Col>
                            </FormGroup>

                            <Button onClick={handleFilter}>Filtrar</Button>
                          </Form>
                        </div>
                      </Col>
                      <Col className='text-left' sm='6'>
                        {/* <h5 className='card-category'>Total Shipments</h5> */}
                        <CardTitle tag='h2'>Performance</CardTitle>
                      </Col>
                      <Col sm='6'>
                        {bigChartData === 'data2' ? (
                          <ButtonGroup
                            className='btn-group-toggle'
                            data-toggle='buttons'
                          >
                            <Button
                              color='warning'
                              id='0'
                              size='sm'
                              tag='label'
                              className={classNames('btn-simple', {
                                active: kindOfInflation === 'movingAverage',
                              })}
                              onClick={() => {
                                setKindOfInflation('movingAverage');
                                setInflationsToBeDisplayed(
                                  getDataForTheInflationChart(
                                    inflations,
                                    document.querySelector('#InitialDate')
                                      .value + '-01',
                                    document.querySelector('#FinalDate').value +
                                      '-01'
                                  )
                                );
                                setInflationsAverageToBeDisplayed(
                                  getDataForTheAverageYearlyBasisInflation(
                                    inflations,
                                    document.querySelector('#InitialDate')
                                      .value + '-01',
                                    document.querySelector('#FinalDate').value +
                                      '-01'
                                  )
                                );
                              }}
                            >
                              <span className='d-none d-sm-block d-md-block d-lg-block d-xl-block'>
                                12 months
                              </span>
                              <span className='d-block d-sm-none'>
                                <i className='tim-icons icon-single-02' />
                              </span>
                            </Button>
                            <Button
                              color='warning'
                              id='1'
                              size='sm'
                              tag='label'
                              className={classNames('btn-simple', {
                                active: kindOfInflation === 'totalPeriod',
                              })}
                              onClick={() => {
                                setKindOfInflation('totalPeriod');
                                setInflationsToBeDisplayed(
                                  getDataForTheInflationChartTotalPeriod(
                                    inflations,
                                    document.querySelector('#InitialDate')
                                      .value + '-01',
                                    document.querySelector('#FinalDate').value +
                                      '-01'
                                  )
                                );
                                setInflationsAverageToBeDisplayed(
                                  getDataForTheAverageInflationAllThePeriod(
                                    inflations,
                                    document.querySelector('#InitialDate')
                                      .value + '-01',
                                    document.querySelector('#FinalDate').value +
                                      '-01'
                                  )
                                );
                              }}
                            >
                              <span className='d-none d-sm-block d-md-block d-lg-block d-xl-block'>
                                Total period
                              </span>
                              <span className='d-block d-sm-none'>
                                <i className='tim-icons icon-gift-2' />
                              </span>
                            </Button>
                          </ButtonGroup>
                        ) : null}
                        <ButtonGroup
                          className='btn-group-toggle float-right'
                          data-toggle='buttons'
                        >
                          <Button
                            color='info'
                            id='0'
                            size='sm'
                            tag='label'
                            className={classNames('btn-simple', {
                              active: bigChartData === 'data1',
                            })}
                            onClick={() => setBgChartData('data1')}
                          >
                            <span className='d-none d-sm-block d-md-block d-lg-block d-xl-block'>
                              Incomes
                            </span>
                            <span className='d-block d-sm-none'>
                              <i className='tim-icons icon-single-02' />
                            </span>
                          </Button>
                          <Button
                            color='info'
                            id='1'
                            size='sm'
                            tag='label'
                            className={classNames('btn-simple', {
                              active: bigChartData === 'data2',
                            })}
                            onClick={() => setBgChartData('data2')}
                          >
                            <span className='d-none d-sm-block d-md-block d-lg-block d-xl-block'>
                              Inflation
                            </span>
                            <span className='d-block d-sm-none'>
                              <i className='tim-icons icon-gift-2' />
                            </span>
                          </Button>
                          {/* <Button
                            color='info'
                            id='2'
                            size='sm'
                            tag='label'
                            className={classNames('btn-simple', {
                              active: bigChartData === 'data3',
                            })}
                            onClick={() => setBgChartData('data3')}
                          >
                            <span className='d-none d-sm-block d-md-block d-lg-block d-xl-block'>
                              Sessions
                            </span>
                            <span className='d-block d-sm-none'>
                              <i className='tim-icons icon-tap-02' />
                            </span>
                          </Button> */}
                        </ButtonGroup>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <div className='chart-area'>
                      <Line
                        options={chartExample1.options}
                        data={chartExample1[bigChartData]}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg='3' md='6'>
                <Card className='card-stats'>
                  <CardBody style={{ paddingBottom: '12px' }}>
                    <Row>
                      <Col xs='2'>
                        <div className='info-icon text-center icon-success'>
                          <i className='tim-icons icon-money-coins' />
                        </div>
                      </Col>
                      <Col xs='10'>
                        <div className='numbers'>
                          <p className='card-category'>
                            Your current funds to invest
                          </p>
                          <CardTitle tag='h3' style={{ marginBottom: 0 }}>
                            {currencyFormat(
                              handleTotalMoney(accounts),
                              login.currency
                            )}
                          </CardTitle>
                          <Button
                            className='btn-link'
                            color='primary'
                            style={{ float: 'right', padding: 0, margin: 0 }}
                            onClick={handleShowAccountStatements}
                          >
                            Show account statements
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter>
                    <hr />

                    <div
                      style={{
                        overflow: 'hidden',
                        height: '60px',
                        width: 'inherit',
                      }}
                      className='stats table-full-width table-responsive'
                    >
                      <TableSalaries
                        handleCurrentMoney={handleCurrentMoney}
                        handleTransactions={handleTransactions}
                      />
                    </div>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg='3' md='6'>
                <Card className='card-stats'>
                  <CardBody>
                    <Row>
                      <Col xs='5'>
                        <div className='info-icon text-center icon-primary'>
                          <i className='tim-icons icon-shape-star' />
                        </div>
                      </Col>
                      <Col xs='7'>
                        <div className='numbers'>
                          <p className='card-category'>Taxes</p>
                          <CardTitle tag='h3'>
                            {currencyFormat(taxesToBeDisplayed, login.currency)}
                          </CardTitle>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter>
                    <hr />
                    <div
                      className='stats'
                      style={{ height: '60px', width: '92%' }}
                    >
                      <div>
                        <i className='tim-icons icon-calendar-60' />{' '}
                        <span>Filter period</span>
                        <Button
                          onClick={() => {
                            setFilterForTaxes('');
                            setTaxesToBeDisplayed(
                              taxes[1].reduce((acc, curr) => acc + curr, 0)
                            );
                          }}
                          className='btn-link'
                          color='primary'
                          style={{ float: 'right', padding: 0, margin: 0 }}
                        >
                          Clear Filter &times;
                        </Button>
                      </div>
                      <Input
                        type='month'
                        value={filterForTaxes}
                        onChange={(e) => {
                          if (e.target.value) {
                            setFilterForTaxes(e.target.value);
                            handleFilterForTaxes(e.target.value);
                          } else {
                            setFilterForTaxes('');
                            setTaxesToBeDisplayed(
                              taxes[1].reduce((acc, curr) => acc + curr, 0)
                            );
                          }
                        }}
                        max={
                          incomes[1].length === 0
                            ? format(new Date(), 'yyyy-MM')
                            : format(
                                addDays(
                                  parse(
                                    incomes[1][incomes[1].length - 1],
                                    'MMM/yyyy',
                                    new Date()
                                    // { locale: ptBR }
                                  ),
                                  1
                                ),
                                'yyyy-MM'
                                // { locale: ptBR }
                              )
                        }
                      />
                    </div>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg='3' md='6'>
                <Card className='card-stats'>
                  <CardBody>
                    <Row>
                      <Col xs='3'>
                        <div className='info-icon text-center icon-warning'>
                          <i className='tim-icons icon-trophy' />
                        </div>
                      </Col>
                      <Col xs='9'>
                        <div className='numbers'>
                          <p className='card-category'>
                            How much until your financial freedom
                          </p>
                          <CardTitle tag='h3'>
                            {currencyFormat(
                              getHowMuchMoneyToFinancialFreedom(
                                login.equityObjective,
                                investments,
                                login.currency,
                                currencyExhangeRates,
                                accounts
                              ),
                              login.currency
                            )}
                          </CardTitle>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter>
                    <hr />
                    <div
                      className='stats'
                      style={{ height: '60px', width: '92%' }}
                    >
                      <i className='tim-icons icon-single-02' /> Customers
                      feedback
                    </div>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg='3' md='6'>
                <Card className='card-stats'>
                  <CardBody>
                    <Row>
                      <Col xs='2'>
                        <div className='info-icon text-center icon-danger'>
                          <i className='fas fa-percent'></i>
                        </div>
                      </Col>
                      <Col xs='10'>
                        <div className='numbers'>
                          <p className='card-category'>Global Average Return</p>
                          <CardTitle tag='h3' style={{ marginBottom: 0 }}>
                            {globalAverageReturn}
                          </CardTitle>
                          <h6 style={{ marginBottom: 0 }}>
                            {`Equivalent annual rate of ${equivalentAnnualRate}`}
                          </h6>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter>
                    <hr />
                    <div
                      className='stats'
                      style={{ height: '60px', width: 'inherit' }}
                    >
                      <i className='tim-icons icon-calendar-60' />{' '}
                      <span>Filter Period</span>
                      <Button
                        onClick={() => {
                          setFilterForGlobalAverage('');
                          setGlobalAverageReturn(
                            percentageFormat(geometricMeane)
                          );
                          setEquivalentAnnualRate(
                            percentageFormat((geometricMeane + 1) ** 12 - 1)
                          );
                        }}
                        className='btn-link'
                        color='primary'
                        style={{ float: 'right', padding: 0, margin: 0 }}
                      >
                        Clear Filter &times;
                      </Button>
                      <Input
                        type='month'
                        value={filterForGlobalAverage}
                        onChange={(e) => {
                          if (e.target.value) {
                            setFilterForGlobalAverage(e.target.value);
                            handleFilterForGlobalAverage(e.target.value);
                          } else {
                            setFilterForGlobalAverage('');
                            setGlobalAverageReturn(
                              percentageFormat(geometricMeane)
                            );
                            setEquivalentAnnualRate(
                              percentageFormat((geometricMeane + 1) ** 12 - 1)
                            );
                          }
                        }}
                        max={
                          incomes[1].length === 0
                            ? format(new Date(), 'yyyy-MM')
                            : format(
                                addDays(
                                  parse(
                                    incomes[1][incomes[1].length - 1],
                                    'MMM/yyyy',
                                    new Date()
                                    // { locale: ptBR }
                                  ),
                                  1
                                ),
                                'yyyy-MM'
                                // { locale: ptBR }
                              )
                        }
                      />
                    </div>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg='4'>
                <Card className='card-chart'>
                  <CardHeader>
                    <CardTitle tag='h4'>
                      Top 10 Spending Categories for the period
                    </CardTitle>
                    <UncontrolledDropdown>
                      <DropdownToggle
                        caret
                        className='btn-icon'
                        color='link'
                        data-toggle='dropdown'
                        type='button'
                      >
                        <i className='tim-icons icon-settings-gear-63' />
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem
                          href='#'
                          onClick={(e) => {
                            e.preventDefault();
                            toggle1();
                          }}
                        >
                          Settings
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </CardHeader>
                  <CardBody>
                    {/* <div className='chart-area'> */}
                    <Pie
                      height={150}
                      // options={{ maintainAspectRatio: false }}
                      data={chartExample10.data}
                      options={chartExample10.options}
                    />
                    {/* </div> */}
                  </CardBody>
                </Card>
              </Col>
              <Col lg='4'>
                <Card className='card-chart'>
                  <CardHeader>
                    <CardTitle tag='h4'>
                      Total Expenses x Total Revenues
                    </CardTitle>

                    <UncontrolledDropdown>
                      <DropdownToggle
                        caret
                        className='btn-icon'
                        color='link'
                        data-toggle='dropdown'
                        type='button'
                      >
                        <i className='tim-icons icon-settings-gear-63' />
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem
                          href='#'
                          onClick={(e) => {
                            toggle2();
                            e.preventDefault();
                          }}
                        >
                          Settings
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </CardHeader>
                  <CardBody>
                    {/* <div className='chart-area'> */}
                    <Bar
                      height={280}
                      data={chartExample8.data}
                      options={chartExample8.options}
                    />
                    {/* </div> */}
                  </CardBody>
                </Card>
              </Col>
              <Col lg='4'>
                <Card className='card-chart'>
                  <CardHeader>
                    <CardTitle tag='h4'>
                      Sum of Expenses Grouped by Month
                    </CardTitle>

                    <UncontrolledDropdown>
                      <DropdownToggle
                        caret
                        className='btn-icon'
                        color='link'
                        data-toggle='dropdown'
                        type='button'
                      >
                        <i className='tim-icons icon-settings-gear-63' />
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem
                          href='#'
                          onClick={(e) => {
                            toggle3();
                            e.preventDefault();
                          }}
                        >
                          Settings
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </CardHeader>
                  <CardBody>
                    {/* <div className='chart-area'> */}
                    <Line
                      height={280}
                      data={chartExample2.data(lines)}
                      options={chartExample2.options(selectedAccount3.currency)}
                    />
                    {/* </div> */}
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg='5'>
                <Card className='card-tasks'>
                  <CardHeader>
                    <h6 className='title d-inline'>Investments by brokers</h6>
                  </CardHeader>
                  <CardBody>
                    <Pie
                      data={chartDefault(
                        dataChartInvetmentsPerBrokers[0],
                        dataChartInvetmentsPerBrokers[1],
                        login.currency
                      )}
                      options={
                        chartDefault(
                          dataChartInvetmentsPerBrokers[0],
                          dataChartInvetmentsPerBrokers[1],
                          login.currency
                        ).options
                      }
                    />
                  </CardBody>
                </Card>
              </Col>
              <Col lg='7'>
                <TableTopInvestments
                  investments={investments}
                  date={dateForTopInvestments}
                  setDate={setDateForTopInvestments}
                />
              </Col>
              <Col lg='12'>
                <Card>
                  <CardHeader>
                    <CardTitle tag='h4'>
                      Global Investments by Top Locations
                    </CardTitle>
                    <p className='card-category'>
                      All investments that were made
                    </p>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col md='6' style={{ overflowX: 'auto' }}>
                        <Table>
                          <tbody>
                            {dataForInvestmentsTopLocation.map(
                              (data, index) => (
                                <tr key={index}>
                                  <td style={{ padding: 0, minWidth: 40 }}>
                                    <div className='flag'>
                                      <img
                                        alt={`${data[0]}`}
                                        src={`/flags/${data[0]}.png`}
                                      />
                                    </div>
                                  </td>
                                  <td>{countries[data[0]]}</td>
                                  <td className='text-right'>
                                    {`${data[1]}_${
                                      login.currency
                                    } ${decimalFormat(
                                      currencyExhangeRates[
                                        `${data[1]}_${login.currency}`
                                      ],
                                      4
                                    )}`}
                                  </td>
                                  <td className='text-right'>
                                    {currencyFormat(data[2], data[1])}
                                  </td>
                                  <td className='text-right'>
                                    {currencyFormat(
                                      data[2] *
                                        currencyExhangeRates[
                                          `${data[1]}_${login.currency}`
                                        ],
                                      login.currency
                                    )}
                                  </td>
                                  <td className='text-right'>
                                    {percentageFormat(
                                      (data[2] *
                                        currencyExhangeRates[
                                          `${data[1]}_${login.currency}`
                                        ]) /
                                        dataForInvestmentsTopLocation.reduce(
                                          (acc, curr) =>
                                            acc +
                                            curr[2] *
                                              currencyExhangeRates[
                                                `${curr[1]}_${login.currency}`
                                              ],
                                          0
                                        ),
                                      2
                                    )}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </Table>
                      </Col>
                      <Col className='ml-auto mr-auto' md='6'>
                        <VectorMap
                          map={'world_mill'}
                          backgroundColor='transparent'
                          zoomOnScroll={false}
                          containerStyle={{
                            width: '100%',
                            height: '300px',
                          }}
                          regionStyle={{
                            initial: {
                              fill: '#e4e4e4',
                              'fill-opacity': 0.9,
                              stroke: 'none',
                              'stroke-width': 0,
                              'stroke-opacity': 0,
                            },
                          }}
                          series={{
                            regions: [
                              {
                                values: mapData,
                                scale: ['#AAAAAA', '#444444'],
                                normalizeFunction: 'polynomial',
                              },
                            ],
                          }}
                        />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;

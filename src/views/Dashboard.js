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
import {Button,ButtonGroup,Card,CardHeader,CardBody,CardFooter,CardTitle,DropdownToggle,DropdownMenu,DropdownItem,UncontrolledDropdown,Label,FormGroup,Input,Progress,Table,Row,Col,UncontrolledTooltip,Form,} from 'reactstrap';
import { countries } from './pages/countries';

// core components
//prettier-ignore
import {chartExample2,chartExample3,chartExample4,chartDefault} from 'variables/charts.js';
//prettier-ignore
import { currencyFormat, percentageFormat, decimalFormat, reverseFormatNumber, geometricMeanReturnInvestments } from '../helpers/functions';
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
} from '../helpers/functions';
import { fetchInflationsFromLocalAPI } from '../services/Inflation';
import Spinner from '../components/Spinner/Spinner';
import axios from 'axios';
import Config from '../config.json';
import { GlobalContext } from 'context/GlobalState';
// import { Link } from 'react-router-dom';
// import { locale } from 'moment';

/*eslint-disable*/
Array.prototype.max = function () {
  return Math.max.apply(null, this);
};

Array.prototype.min = function () {
  return Math.min.apply(null, this);
};

const Dashboard = () => {
  const [loadedCurrencies, setLoadedCurrencies] = useState(false);
  const { accounts, updateAccounts, getAccounts } = useContext(GlobalContext);
  const [equivalentAnnualRate, setEquivalentAnnualRate] = useState(
    '0,0000000000%'
  );
  const [dateForTopInvestments, setDateForTopInvestments] = useState(
    `${new Date().toISOString().slice(0, 8)}01`
  );
  const [currencyExhangeRates, setCurrencyExhangeRates] = useState({});
  const [mapData, setMapData] = useState({});
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
  const [taxes, setTaxes] = useState([]);
  const [taxesToBeDisplayed, setTaxesToBeDisplayed] = useState(0);
  const [filterForTaxes, setFilterForTaxes] = useState('');
  const [filterForGlobalAverage, setFilterForGlobalAverage] = useState('');
  const [currentMoney, setCurrentMoney] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).fundsToInvest
      : 0
  );
  const [investments, setInvestments] = useState([]);
  const [Incomes, setIncomes] = useState([]);
  const [investmentsToBeDisplayed, setInvestmentsToBeDisplayed] = useState([]);

  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const [inflations, setInflations] = useState([]);
  const [inflationsToBeDisplayed, setInflationsToBeDisplayed] = useState([]);
  const [inflation12Months, setInflation12Months] = useState([]);
  const [
    dataChartInvetmentsPerBrokers,
    setDataChartInvetmentsPerartBrokers,
  ] = useState([]);

  const [bigChartData, setbigChartData] = useState('data1');
  const setBgChartData = (name) => {
    setbigChartData(name);
  };

  useEffect(() => {
    if (Object.keys(accounts).length === 0) {
      getAccounts();
    }
    const getInvestments = async () => {
      const investment = await fetchAllInvestments('', login);
      geometricMeanReturnInvestments(investment);
      const currentInvestments = await fetchInvestments('', login);

      setInvestments(investment);

      if (dataForInvestmentsTopLocation.length === 0) {
        const topLocations = getTopInvestmentsByLocation(
          currentInvestments.investments
        );

        const config = {
          headers: { Authorization: `Bearer ${login.token}` },
        };

        const locationsForLoop = new Set();
        topLocations.forEach((location) => locationsForLoop.add(location[1]));

        Object.keys(accounts).forEach((location) =>
          locationsForLoop.add(location)
        );

        for (const location of locationsForLoop) {
          if (
            location !== login.currency &&
            !(`${location}_${login.currency}` in currencyExhangeRates)
          ) {
            try {
              const res = await axios.get(
                `${Config.SERVER_ADDRESS}/api/exchanges/${location}_${login.currency}`,
                config
              );
              currencyExhangeRates[
                `${location}_${login.currency}`
              ] = Object.values(res.data)[0];
            } catch (error) {
              currencyExhangeRates[`${location}_${login.currency}`] = 1.5;
            }
            // const res = await axios.get(
            //   `${Config.SERVER_ADDRESS}/api/exchanges/${location}_${login.currency}`,
            //   config
            // );
            // currencyExhangeRates[
            //   `${location}_${login.currency}`
            // ] = Object.values(res.data)[0];
            // mapdata[location[0]] = mapdata[location[0]] || 0;
            // mapdata[location[0]] += location[2] * Object.values(res.data)[0];
          } else {
            if (!(`${location}_${login.currency}` in currencyExhangeRates)) {
              currencyExhangeRates[`${location}_${login.currency}`] = 1;
            }
          }
        }
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

      setIncomes(getDataForTheFirstChart(investment));
      setInvestmentsToBeDisplayed(getDataForTheFirstChart(investments));
      setTaxes(getDataForTotalTaxes(investments));

      setTaxesToBeDisplayed(
        getDataForTotalTaxes(investments)[1].reduce(
          (acc, curr) => acc + curr,
          0
        )
      );
      if (inflations.length === 0) {
        const inflation = await fetchInflationsFromLocalAPI(login.country); //fetchInflation();

        inflation.forEach((inf) => {
          const dataPartes = inf.data.split('/');
          inf.data = `${dataPartes[2]}-${dataPartes[1]}-${dataPartes[0]}`;
          inf.valor = Number(inf.valor) / 100 + 1;
        });
        setInflations(inflation);
        setInflation12Months(getDataForTheInflationChart(inflation));
        setInflationsToBeDisplayed(getDataForTheInflationChart(inflation));
        setInflationsForTheTotalPeriod(
          getDataForTheInflationChartTotalPeriod(inflation)
        );
      }

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
    };
    if (dataChartInvetmentsPerBrokers.length === 0) {
      getInvestments();
    }
    let newDate = new Date().toISOString();
    newDate = newDate.split('T');
    if (Incomes.length !== 0) {
      let date =
        Incomes[1].length !== 0
          ? parse(Incomes[1][Incomes[1].length - 1], 'MMM/yyyy', new Date(), {
              locale: ptBR,
            })
          : new Date();

      setGlobalAverageReturn(
        percentageFormat(
          getGlobalAverageReturn(investments, format(date, 'yyyy-MM-dd'))
        )
      );
      setEquivalentAnnualRate(
        percentageFormat(
          ((getGlobalAverageReturn(investments, format(date, 'yyyy-MM-dd')) /
            100 +
            1) **
            12 -
            1) *
            100
        )
      );
      setFilterForGlobalAverage(format(date, 'yyyy-MM'));
    }
  }, [investments, Incomes]);
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

  let chart1_2_options = {
    onClick:
      bigChartData === 'data1'
        ? function (c, i) {
            let e = i[0];
            if (e !== undefined) {
              console.log(e._index);
              var x_value = this.data.labels[e._index];
              var y_value = this.data.datasets[0].data[e._index];
              console.log(x_value);
              console.log(y_value);
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

          return bigChartData === 'data1'
            ? `${data.labels[indice]}:  ${currencyFormat(
                data.datasets[0].data[indice],
                login.currency
              )}`
            : `${data.labels[indice]}:  ${(
                data.datasets[0].data[indice] / 100
              ).toLocaleString('pt-br', {
                style: 'percent',
                minimumFractionDigits: 2,
              })}
          `;
        },
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
                : (Number(label) / 100).toLocaleString('pt-br', {
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

      gradientStroke.addColorStop(1, 'rgba(237, 248, 29,0.2)');
      gradientStroke.addColorStop(0.4, 'rgba(237, 248, 29,0.0)');
      gradientStroke.addColorStop(0, 'rgba(237, 248, 29,0)'); //yellow colors

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
    } else {
      setInflationsToBeDisplayed(
        getDataForTheInflationChartTotalPeriod(
          inflations,
          initialDate + '-01',
          finalDate + '-01'
        )
      );
    }

    setInvestmentsToBeDisplayed(
      handleSlicesOfInvestments(Incomes, initialDate + '-02', finalDate + '-02')
    );
  }

  const handleCurrentMoney = async (salary) => {
    const config = { headers: { Authorization: `Bearer ${login.token}` } };
    accounts[login.currency] += salary;

    await axios
      .put(
        `${Config.SERVER_ADDRESS}/api/users/${login._id}`,
        { fundsToInvest: accounts },
        config
      )
      .then((res) => {
        login['fundsToInvest'] = accounts;
        setCurrentMoney(accounts);
        // setFundsToBeInvested;
        localStorage.setItem('userInfo', JSON.stringify(login));
        updateAccounts(accounts);
      });
  };

  const handleTotalMoney = (object) => {
    let total = 0;
    for (const currency of Object.entries(object)) {
      total +=
        currency[1] * currencyExhangeRates[`${currency[0]}_${login.currency}`];
    }
    return total;
  };
  return (
    <>
      <div className='content'>
        {!dataChartInvetmentsPerBrokers.length ? (
          <>
            <Spinner />
          </>
        ) : (
          <>
            <Row>
              <Col xs='12'>
                <h1>
                  <i className='tim-icons icon-chart-pie-36'></i> Dashboard
                  <i className='icomoon-100'></i>
                </h1>
                <Card className='card-chart'>
                  <CardHeader>
                    <Row>
                      <Col md='12'>
                        <div
                          style={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <Form inline>
                            <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                              <Col sm='12'>
                                <Label for='InitialDate'>
                                  Informe uma data inicial
                                </Label>
                                <Input
                                  className='borderColor'
                                  id='InitialDate'
                                  type='month'
                                  min={format(
                                    addDays(
                                      new Date(inflations[0]['data']),
                                      28
                                    ),
                                    'yyyy-MM',
                                    { locale: ptBR }
                                  )}
                                  max={
                                    //prettier-ignore
                                    format(addDays(new Date(inflations[inflations.length - 1]['data']),1),'yyyy-MM',{ locale: ptBR })
                                  }
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                              <Col sm='12'>
                                <Label for='FinalDate'>
                                  Informe uma data final
                                </Label>
                                <Input
                                  className='borderColor'
                                  id='FinalDate'
                                  type='month'
                                  min={format(
                                    addDays(
                                      new Date(inflations[0]['data']),
                                      28
                                    ),
                                    'yyyy-MM',
                                    { locale: ptBR }
                                  )}
                                  max={format(
                                    addDays(
                                      new Date(
                                        inflations[inflations.length - 1][
                                          'data'
                                        ]
                                      ),
                                      1
                                    ),
                                    'yyyy-MM',
                                    { locale: ptBR }
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
                              Rendimentos
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
                              Inflação
                            </span>
                            <span className='d-block d-sm-none'>
                              <i className='tim-icons icon-gift-2' />
                            </span>
                          </Button>
                          <Button
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
                          </Button>
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
                  <CardBody>
                    <Row>
                      <Col xs='5'>
                        <div className='info-icon text-center icon-success'>
                          <i className='tim-icons icon-money-coins' />
                        </div>
                      </Col>
                      <Col xs='7'>
                        <div className='numbers'>
                          <p className='card-category'>
                            Your current funds to invest
                          </p>
                          <CardTitle tag='h3'>
                            {currencyFormat(
                              handleTotalMoney(accounts),
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
                      style={{
                        overflow: 'hidden',
                        height: '60px',
                        width: 'inherit',
                      }}
                      className='stats table-full-width table-responsive'
                    >
                      <TableSalaries
                        accounts={accounts}
                        handleCurrentMoney={handleCurrentMoney}
                        currentMoney={accounts}
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
                          setFilterForTaxes(e.target.value);
                          handleFilterForTaxes(e.target.value);
                        }}
                        max={
                          Incomes[1].length === 0
                            ? format(new Date(), 'yyyy-MM')
                            : format(
                                addDays(
                                  parse(
                                    Incomes[1][Incomes[1].length - 1],
                                    'MMM/yyyy',
                                    new Date(),
                                    { locale: ptBR }
                                  ),
                                  1
                                ),
                                'yyyy-MM',
                                { locale: ptBR }
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
                                currencyExhangeRates
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
                      <Input
                        type='month'
                        value={filterForGlobalAverage}
                        onChange={(e) => {
                          setFilterForGlobalAverage(e.target.value);
                          handleFilterForGlobalAverage(e.target.value);
                        }}
                        max={
                          Incomes[1].length === 0
                            ? format(new Date(), 'yyyy-MM')
                            : format(
                                addDays(
                                  parse(
                                    Incomes[1][Incomes[1].length - 1],
                                    'MMM/yyyy',
                                    new Date(),
                                    { locale: ptBR }
                                  ),
                                  1
                                ),
                                'yyyy-MM',
                                { locale: ptBR }
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
                    <h5 className='card-category'>Total Shipments</h5>
                    <CardTitle tag='h3'>
                      <i className='tim-icons icon-bell-55 text-primary' />{' '}
                      763,215
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <div className='chart-area'>
                      <Line
                        data={chartExample2.data}
                        options={chartExample2.options}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg='4'>
                <Card className='card-chart'>
                  <CardHeader>
                    <h5 className='card-category'>Daily Sales</h5>
                    <CardTitle tag='h3'>
                      <i className='tim-icons icon-delivery-fast text-info' />{' '}
                      3,500€
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <div className='chart-area'>
                      <Bar
                        data={chartExample3.data}
                        options={chartExample3.options}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg='4'>
                <Card className='card-chart'>
                  <CardHeader>
                    <h5 className='card-category'>Completed Tasks</h5>
                    <CardTitle tag='h3'>
                      <i className='tim-icons icon-send text-success' /> 12,100K
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <div className='chart-area'>
                      <Line
                        data={chartExample4.data}
                        options={chartExample4.options}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg='5'>
                <Card className='card-tasks'>
                  <CardHeader>
                    <h6 className='title d-inline'>
                      Investimentos por Corretoras
                    </h6>
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
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          Action
                        </DropdownItem>
                        <DropdownItem
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          Another action
                        </DropdownItem>
                        <DropdownItem
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          Something else
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
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
                      <Col md='6'>
                        <Table>
                          <tbody>
                            {dataForInvestmentsTopLocation.map(
                              (data, index) => (
                                <tr key={index}>
                                  <td>
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

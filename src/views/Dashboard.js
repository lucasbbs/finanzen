// eslint-disable
import { addDays, format, parse } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import React, { useEffect, useState } from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// react plugin used to create charts
import { Line, Bar, Pie } from 'react-chartjs-2';
// react plugin for creating vector maps
import { VectorMap } from 'react-jvectormap';
// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Progress,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
  Form,
} from 'reactstrap';

// core components
import {
  // chartExample1,
  chartExample2,
  chartExample3,
  chartExample4,
  chartDefault,
} from 'variables/charts.js';
import {
  currencyFormat,
  percentageFormat,
  reverseFormatNumber,
} from '../helpers/functions';
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
  getSimpleMovingAverage,
} from '../helpers/functions';
import {
  // fetchInflation,
  fetchInflationsFromLocalAPI,
} from '../services/Inflation';
import Spinner from '../components/Spinner/Spinner';
import axios from 'axios';
import Config from '../config.json';
// import { Link } from 'react-router-dom';
// import { locale } from 'moment';

var mapData = {
  AU: 760,
  BR: 550,
  CA: 120,
  DE: 1300,
  FR: 540,
  GB: 690,
  GE: 200,
  IN: 200,
  RO: 600,
  RU: 300,
  US: 2920,
};
/*eslint-disable*/
Array.prototype.max = function () {
  return Math.max.apply(null, this);
};

Array.prototype.min = function () {
  return Math.min.apply(null, this);
};

const Dashboard = () => {
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
  const [
    dataChartInvetmentsPerBrokers,
    setDataChartInvetmentsPerartBrokers,
  ] = useState([]);

  const [bigChartData, setbigChartData] = useState('data1');
  const setBgChartData = (name) => {
    setbigChartData(name);
  };

  useEffect(() => {
    const getInvestments = async () => {
      const investment = await fetchAllInvestments('', login);
      const currentInvestments = await fetchInvestments('', login);
      const inflation = await fetchInflationsFromLocalAPI(login.country); //fetchInflation();
      setInvestments(investment);
      inflation.forEach((inf) => {
        const dataPartes = inf.data.split('/');
        inf.data = `${dataPartes[2]}-${dataPartes[1]}-${dataPartes[0]}`;
        inf.valor = Number(inf.valor) / 100 + 1;
      });
      setIncomes(getDataForTheFirstChart(investment));
      setInvestmentsToBeDisplayed(getDataForTheFirstChart(investment));
      setTaxes(getDataForTotalTaxes(investment));

      setTaxesToBeDisplayed(
        getDataForTotalTaxes(investment)[1].reduce((acc, curr) => acc + curr, 0)
      );
      setInflations(inflation);
      setInflationsToBeDisplayed(getDataForTheInflationChart(inflation));
      console.log(getSimpleMovingAverage(inflation));
      const inflationsFromLocalStorate = await fetchInflationsFromLocalAPI(
        login.country
      );
      console.log(inflationsFromLocalStorate);
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
              currentInvestments.investments[j].initial_amount +
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
  };

  let chart1_2_options = {
    onClick: function (c, i) {
      let e = i[0];
      if (e !== undefined) {
        console.log(e._index);
        var x_value = this.data.labels[e._index];
        var y_value = this.data.datasets[0].data[e._index];
        console.log(x_value);
        console.log(y_value);
      }
    },
    maintainAspectRatio: false,
    legend: {
      display: false,
      onHover: function (e) {
        e.target.style.cursor = 'pointer';
      },
    },
    hover: {
      onHover: function (e) {
        var point = this.getElementAtEvent(e);
        if (point.length) e.target.style.cursor = 'pointer';
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
    setInflationsToBeDisplayed(
      getDataForTheInflationChart(
        inflations,
        initialDate + '-01',
        finalDate + '-01'
      )
    );

    setInvestmentsToBeDisplayed(
      handleSlicesOfInvestments(Incomes, initialDate + '-02', finalDate + '-02')
    );
  }

  const handleCurrentMoney = async (salary) => {
    const config = { headers: { Authorization: `Bearer ${login.token}` } };
    await axios
      .put(
        `${Config.SERVER_ADDRESS}/api/users/${login._id}`,
        { fundsToInvest: currentMoney + salary },
        config
      )
      .then((res) => {
        login['fundsToInvest'] = currentMoney + salary;
        setCurrentMoney(currentMoney + salary);
        localStorage.setItem('userInfo', JSON.stringify(login));
      });
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
                                      31
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
                                      31
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
                            {currencyFormat(currentMoney, login.currency)}
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
                        handleCurrentMoney={handleCurrentMoney}
                        currentMoney={currentMoney}
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
                                investments
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
                      <Col xs='3'>
                        <div className='info-icon text-center icon-danger'>
                          <i className='fas fa-percent'></i>
                        </div>
                      </Col>
                      <Col xs='9'>
                        <div className='numbers'>
                          <p className='card-category'>Global Average Return</p>
                          <CardTitle tag='h3' style={{ marginBottom: 0 }}>
                            {globalAverageReturn}
                          </CardTitle>
                          <h6 style={{ marginBottom: 0 }}>
                            {`Equivalent annual rate of ${percentageFormat(
                              (reverseFormatNumber(globalAverageReturn) / 100 +
                                1) **
                                12 -
                                1
                            )}`}
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
                        dataChartInvetmentsPerBrokers[1]
                      )}
                      options={chartDefault().options}
                    />
                  </CardBody>
                </Card>
              </Col>
              <Col lg='7'>
                <Card>
                  <CardHeader>
                    <div className='tools float-right'>
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
                          <DropdownItem
                            className='text-danger'
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                          >
                            Remove Data
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                    <CardTitle tag='h5'>Management Table</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Table>
                      <thead className='text-primary'>
                        <tr>
                          <th className='text-center'>#</th>
                          <th>Name</th>
                          <th>Job Position</th>
                          <th>Milestone</th>
                          <th className='text-right'>Salary</th>
                          <th className='text-right'>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className='text-center'>
                            <div className='photo'>
                              <img
                                alt='...'
                                src={require('assets/img/tania.jpg').default}
                              />
                            </div>
                          </td>

                          <td id={'sel'}>Tania Mike</td>
                          <td>Develop</td>
                          <td className='text-center'>
                            <div className='progress-container progress-sm'>
                              <Progress multi>
                                <span className='progress-value'>25%</span>
                                <Progress bar max='100' value='25' />
                              </Progress>
                            </div>
                          </td>
                          <td className='text-right'>€ 99,225</td>
                          <td className='text-right'>
                            <Button
                              className='btn-link btn-icon btn-neutral'
                              color='success'
                              id='tooltip618296632'
                              size='sm'
                              title='Refresh'
                              type='button'
                            >
                              <i className='tim-icons icon-refresh-01' />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target='tooltip618296632'
                            >
                              Tooltip on top
                            </UncontrolledTooltip>
                            <Button
                              className='btn-link btn-icon btn-neutral'
                              color='danger'
                              id='tooltip707467505'
                              size='sm'
                              title='Delete'
                              type='button'
                            >
                              <i className='tim-icons icon-simple-remove' />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target='tooltip707467505'
                            >
                              Tooltip on top
                            </UncontrolledTooltip>
                          </td>
                        </tr>
                        <tr>
                          <td className='text-center'>
                            <div className='photo'>
                              <img
                                alt='...'
                                src={require('assets/img/robi.jpg').default}
                              />
                            </div>
                          </td>
                          <td>John Doe</td>
                          <td>CEO</td>
                          <td className='text-center'>
                            <div className='progress-container progress-sm'>
                              <Progress multi>
                                <span className='progress-value'>77%</span>
                                <Progress bar max='100' value='77' />
                              </Progress>
                            </div>
                          </td>
                          <td className='text-right'>€ 89,241</td>
                          <td className='text-right'>
                            <Button
                              className='btn-link btn-icon btn-neutral'
                              color='success'
                              id='tooltip216846074'
                              size='sm'
                              title='Refresh'
                              type='button'
                            >
                              <i className='tim-icons icon-refresh-01' />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target='tooltip216846074'
                            >
                              Tooltip on top
                            </UncontrolledTooltip>
                            <Button
                              className='btn-link btn-icon btn-neutral'
                              color='danger'
                              id='tooltip391990405'
                              size='sm'
                              title='Delete'
                              type='button'
                            >
                              <i className='tim-icons icon-simple-remove' />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target='tooltip391990405'
                            >
                              Tooltip on top
                            </UncontrolledTooltip>
                          </td>
                        </tr>
                        <tr>
                          <td className='text-center'>
                            <div className='photo'>
                              <img
                                alt='...'
                                src={require('assets/img/lora.jpg').default}
                              />
                            </div>
                          </td>
                          <td>Alexa Mike</td>
                          <td>Design</td>
                          <td className='text-center'>
                            <div className='progress-container progress-sm'>
                              <Progress multi>
                                <span className='progress-value'>41%</span>
                                <Progress bar max='100' value='41' />
                              </Progress>
                            </div>
                          </td>
                          <td className='text-right'>€ 92,144</td>
                          <td className='text-right'>
                            <Button
                              className='btn-link btn-icon btn-neutral'
                              color='success'
                              id='tooltip191500186'
                              size='sm'
                              title='Refresh'
                              type='button'
                            >
                              <i className='tim-icons icon-refresh-01' />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target='tooltip191500186'
                            >
                              Tooltip on top
                            </UncontrolledTooltip>
                            <Button
                              className='btn-link btn-icon btn-neutral'
                              color='danger'
                              id='tooltip320351170'
                              size='sm'
                              title='Delete'
                              type='button'
                            >
                              <i className='tim-icons icon-simple-remove' />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target='tooltip320351170'
                            >
                              Tooltip on top
                            </UncontrolledTooltip>
                          </td>
                        </tr>
                        <tr>
                          <td className='text-center'>
                            <div className='photo'>
                              <img
                                alt='...'
                                src={require('assets/img/jana.jpg').default}
                              />
                            </div>
                          </td>
                          <td>Jana Monday</td>
                          <td>Marketing</td>
                          <td className='text-center'>
                            <div className='progress-container progress-sm'>
                              <Progress multi>
                                <span className='progress-value'>50%</span>
                                <Progress bar max='100' value='50' />
                              </Progress>
                            </div>
                          </td>
                          <td className='text-right'>€ 49,990</td>
                          <td className='text-right'>
                            <Button
                              className='btn-link btn-icon'
                              color='success'
                              id='tooltip345411997'
                              size='sm'
                              title='Refresh'
                              type='button'
                            >
                              <i className='tim-icons icon-refresh-01' />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target='tooltip345411997'
                            >
                              Tooltip on top
                            </UncontrolledTooltip>
                            <Button
                              className='btn-link btn-icon'
                              color='danger'
                              id='tooltip601343171'
                              size='sm'
                              title='Delete'
                              type='button'
                            >
                              <i className='tim-icons icon-simple-remove' />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target='tooltip601343171'
                            >
                              Tooltip on top
                            </UncontrolledTooltip>
                          </td>
                        </tr>
                        <tr>
                          <td className='text-center'>
                            <div className='photo'>
                              <img
                                alt='...'
                                src={require('assets/img/mike.jpg').default}
                              />
                            </div>
                          </td>
                          <td>Paul Dickens</td>
                          <td>Develop</td>
                          <td className='text-center'>
                            <div className='progress-container progress-sm'>
                              <Progress multi>
                                <span className='progress-value'>100%</span>
                                <Progress bar max='100' value='100' />
                              </Progress>
                            </div>
                          </td>
                          <td className='text-right'>€ 69,201</td>
                          <td className='text-right'>
                            <Button
                              className='btn-link btn-icon'
                              color='success'
                              id='tooltip774891382'
                              size='sm'
                              title='Refresh'
                              type='button'
                            >
                              <i className='tim-icons icon-refresh-01' />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target='tooltip774891382'
                            >
                              Tooltip on top
                            </UncontrolledTooltip>
                            <Button
                              className='btn-link btn-icon'
                              color='danger'
                              id='tooltip949929353'
                              size='sm'
                              title='Delete'
                              type='button'
                            >
                              <i className='tim-icons icon-simple-remove' />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target='tooltip949929353'
                            >
                              Tooltip on top
                            </UncontrolledTooltip>
                          </td>
                        </tr>
                        <tr>
                          <td className='text-center'>
                            <div className='photo'>
                              <img
                                alt='...'
                                src={require('assets/img/emilyz.jpg').default}
                              />
                            </div>
                          </td>
                          <td>Manuela Rico</td>
                          <td>Manager</td>
                          <td className='text-center'>
                            <div className='progress-container progress-sm'>
                              <Progress multi>
                                <span className='progress-value'>15%</span>
                                <Progress bar max='100' value='15' />
                              </Progress>
                            </div>
                          </td>
                          <td className='text-right'>€ 99,201</td>
                          <td className='text-right'>
                            <Button
                              className='btn-link btn-icon'
                              color='success'
                              id='tooltip30547133'
                              size='sm'
                              title='Refresh'
                              type='button'
                            >
                              <i className='tim-icons icon-refresh-01' />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target='tooltip30547133'
                            >
                              Tooltip on top
                            </UncontrolledTooltip>
                            <Button
                              className='btn-link btn-icon'
                              color='danger'
                              id='tooltip156899243'
                              size='sm'
                              title='Delete'
                              type='button'
                            >
                              <i className='tim-icons icon-simple-remove' />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target='tooltip156899243'
                            >
                              Tooltip on top
                            </UncontrolledTooltip>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
              <Col lg='12'>
                <Card>
                  <CardHeader>
                    <CardTitle tag='h4'>
                      Global Sales by Top Locations
                    </CardTitle>
                    <p className='card-category'>
                      All products that were shipped
                    </p>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col md='6'>
                        <Table>
                          <tbody>
                            <tr>
                              <td>
                                <div className='flag'>
                                  <img
                                    alt='...'
                                    src={require('assets/img/US.png').default}
                                  />
                                </div>
                              </td>
                              <td>USA</td>
                              <td className='text-right'>2.920</td>
                              <td className='text-right'>53.23%</td>
                            </tr>
                            <tr>
                              <td>
                                <div className='flag'>
                                  <img
                                    alt='...'
                                    src={require('assets/img/DE.png').default}
                                  />
                                </div>
                              </td>
                              <td>Germany</td>
                              <td className='text-right'>1.300</td>
                              <td className='text-right'>20.43%</td>
                            </tr>
                            <tr>
                              <td>
                                <div className='flag'>
                                  <img
                                    alt='...'
                                    src={require('assets/img/AU.png').default}
                                  />
                                </div>
                              </td>
                              <td>Australia</td>
                              <td className='text-right'>760</td>
                              <td className='text-right'>10.35%</td>
                            </tr>
                            <tr>
                              <td>
                                <div className='flag'>
                                  <img
                                    alt='...'
                                    src={require('assets/img/GB.png').default}
                                  />
                                </div>
                              </td>
                              <td>United Kingdom</td>
                              <td className='text-right'>690</td>
                              <td className='text-right'>7.87%</td>
                            </tr>
                            <tr>
                              <td>
                                <div className='flag'>
                                  <img
                                    alt='...'
                                    src={require('assets/img/RO.png').default}
                                  />
                                </div>
                              </td>
                              <td>Romania</td>
                              <td className='text-right'>600</td>
                              <td className='text-right'>5.94%</td>
                            </tr>
                            <tr>
                              <td>
                                <div className='flag'>
                                  <img
                                    alt='...'
                                    src={require('assets/img/BR.png').default}
                                  />
                                </div>
                              </td>
                              <td>Brasil</td>
                              <td className='text-right'>550</td>
                              <td className='text-right'>4.34%</td>
                            </tr>
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

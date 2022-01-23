/*!

=========================================================
* Black Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { addDays, format, isValid, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import React, { useEffect, useRef, useState } from 'react';
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
  Progress,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
  Form,
} from 'reactstrap';
import NotificationAlert from 'react-notification-alert';

// core components
import {
  // chartExample1,
  chartExample2,
  chartExample3,
  chartExample4,
  chartDefault,
} from 'variables/charts.js';
import { currencyFormat } from '../helpers/functions';
import TableTopInvestments from '../components/TableTopInvestments/TableTopInvestments';
import { fetchInvestments, fetchAllInvestments } from '../services/Investments';
import {
  getDataForTheFirstChart,
  getDataForTheInflationChart,
  handleSlicesOfInvestments,
} from '../helpers/functions';
import { fetchInflation } from '../services/Inflation';
import Spinner from '../components/Spinner/Spinner';
import DatePicker from 'react-date-picker';
import CalendarIcon from 'components/CalendarIcon/CalendarIcon';
import ClearIcon from 'components/ClearIcon/ClearIcon';

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
  const [dateInitial, setDateInitial] = useState('');
  const [dateFinal, setDateFinal] = useState('');
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

  const [bigChartData, setbigChartData] = React.useState('data1');
  const setBgChartData = (name) => {
    setbigChartData(name);
  };

  useEffect(() => {
    const getInvestmentDetails = async () => {
      const investment = await fetchAllInvestments('', login);
      const currentInvestments = await fetchInvestments('', login);
      const inflation = await fetchInflation();
      setInvestments(investment);
      inflation.forEach((inf) => {
        const dataPartes = inf.data.split('/');
        inf.data = `${dataPartes[2]}-${dataPartes[1]}-${dataPartes[0]}`;
        inf.valor = Number(inf.valor) / 100 + 1;
      });
      setIncomes(getDataForTheFirstChart(investment));
      setInvestmentsToBeDisplayed(getDataForTheFirstChart(investment));

      setInflations(inflation);

      setInflationsToBeDisplayed(getDataForTheInflationChart(inflation));

      const brokers = [
        ...new Set(currentInvestments.map((inv) => inv.broker.name)),
      ];
      const somas = [];
      for (let i = 0; i < brokers.length; i++) {
        let soma = 0;
        for (let j = 0; j < currentInvestments.length; j++) {
          if (currentInvestments[j].broker.name === brokers[i]) {
            soma +=
              currentInvestments[j].initial_amount +
              currentInvestments[j].accrued_income;
          }
        }
        somas.push(soma);
      }
      setDataChartInvetmentsPerartBrokers([[...somas], [...brokers]]);
    };
    getInvestmentDetails();
  }, []);
  // eslint-disable-next-line

  let chart1_2_options = {
    onClick: function (c, i) {
      let e = i[0];
      if (e !== undefined) {
        // console.log(e._index);
        var x_value = this.data.labels[e._index];
        var y_value = this.data.datasets[0].data[e._index];
        // console.log(x_value);
        // console.log(y_value);
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
                data.datasets[0].data[indice]
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
                ? currencyFormat(Number(label))
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
    if (!isValid(dateInitial)) {
      notify('Please select a initial date', 'warning');
      return;
    }
    if (!isValid(dateFinal)) {
      notify('Please select a final date', 'warning');
      return;
    }
    const initialDate = format(dateInitial, 'yyyy-MM'); //document.querySelector('#InitialDate').value;

    const finalDate = format(dateFinal, 'yyyy-MM'); //document.querySelector('#FinalDate').value;
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
  const notificationAlertRef = useRef(null);
  const notify = (message, type = 'success', place = 'tc') => {
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>{message}</div>
        </div>
      ),
      type: type,
      icon: 'tim-icons icon-bell-55',
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
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
            <div className='react-notification-alert-container'>
              <NotificationAlert ref={notificationAlertRef} />
            </div>
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
                                <DatePicker
                                  id='InitialDate'
                                  format='MMM/yyyy'
                                  yearPlaceholder='  ----'
                                  maxDetail='year'
                                  value={dateInitial}
                                  calendarIcon={<CalendarIcon />}
                                  clearIcon={<ClearIcon />}
                                  onChange={(date) => setDateInitial(date)}
                                  minDate={
                                    //prettier-ignore
                                    addDays(new Date(inflations[0]['data']),31)
                                  }
                                  maxDate={
                                    //prettier-ignore
                                    addDays(new Date(inflations[inflations.length - 1]['data']),1)
                                  }
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                              <Col sm='12'>
                                <Label for='FinalDate'>
                                  Informe uma data final
                                </Label>

                                <DatePicker
                                  id='FinalDate'
                                  format='MMM/yyyy'
                                  yearPlaceholder='  ----'
                                  maxDetail='year'
                                  value={dateFinal}
                                  calendarIcon={<CalendarIcon />}
                                  clearIcon={<ClearIcon />}
                                  onChange={(date) => setDateFinal(date)}
                                  minDate={addDays(
                                    new Date(inflations[0]['data']),
                                    31
                                  )}
                                  maxDate={
                                    //prettier-ignore
                                    addDays(new Date(inflations[inflations.length - 1]['data']),1)
                                  }
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
                        <div className='info-icon text-center icon-warning'>
                          <i className='tim-icons icon-chat-33' />
                        </div>
                      </Col>
                      <Col xs='7'>
                        <div className='numbers'>
                          <p className='card-category'>Number</p>
                          <CardTitle tag='h3'>150GB</CardTitle>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter>
                    <hr />
                    <div className='stats'>
                      <i className='tim-icons icon-refresh-01' /> Update Now
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
                          <p className='card-category'>Followers</p>
                          <CardTitle tag='h3'>+45k</CardTitle>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter>
                    <hr />
                    <div className='stats'>
                      <i className='tim-icons icon-sound-wave' /> Last Research
                    </div>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg='3' md='6'>
                <Card className='card-stats'>
                  <CardBody>
                    <Row>
                      <Col xs='5'>
                        <div className='info-icon text-center icon-success'>
                          <i className='tim-icons icon-single-02' />
                        </div>
                      </Col>
                      <Col xs='7'>
                        <div className='numbers'>
                          <p className='card-category'>Users</p>
                          <CardTitle tag='h3'>150,000</CardTitle>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter>
                    <hr />
                    <div className='stats'>
                      <i className='tim-icons icon-trophy' /> Customers feedback
                    </div>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg='3' md='6'>
                <Card className='card-stats'>
                  <CardBody>
                    <Row>
                      <Col xs='5'>
                        <div className='info-icon text-center icon-danger'>
                          <i className='tim-icons icon-molecule-40' />
                        </div>
                      </Col>
                      <Col xs='7'>
                        <div className='numbers'>
                          <p className='card-category'>Errors</p>
                          <CardTitle tag='h3'>12</CardTitle>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter>
                    <hr />
                    <div className='stats'>
                      <i className='tim-icons icon-watch-time' /> In the last
                      hours
                    </div>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg='4'>
                <Card className='card-chart'>
                  <CardHeader>
                    <h5 className='card-category'>Total Shipments</h5>
                    <CardTitle tag='h3'>
                      <i className='tim-icons icon-bell-55 text-primary' />
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
                      <i className='tim-icons icon-delivery-fast text-info' />
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
                          href='#'
                          onClick={(e) => e.preventDefault()}
                        >
                          Action
                        </DropdownItem>
                        <DropdownItem
                          href='#'
                          onClick={(e) => e.preventDefault()}
                        >
                          Another action
                        </DropdownItem>
                        <DropdownItem
                          href='#'
                          onClick={(e) => e.preventDefault()}
                        >
                          Something else
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </CardHeader>
                  <CardBody>
                    {/* <div className='table-full-width table-responsive'>
                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue='' type='checkbox' />
                              <span className='form-check-sign'>
                                <span className='check' />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className='title'>Update the Documentation</p>
                          <p className='text-muted'>
                            Dwuamish Head, Seattle, WA 8:47 AM
                          </p>
                        </td>
                        <td className='td-actions text-right'>
                          <Button
                            color='link'
                            id='tooltip786630859'
                            title=''
                            type='button'
                          >
                            <i className='tim-icons icon-pencil' />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip786630859'
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input
                                defaultChecked
                                defaultValue=''
                                type='checkbox'
                              />
                              <span className='form-check-sign'>
                                <span className='check' />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className='title'>GDPR Compliance</p>
                          <p className='text-muted'>
                            The GDPR is a regulation that requires businesses to
                            protect the personal data and privacy of Europe
                            citizens for transactions that occur within EU
                            member states.
                          </p>
                        </td>
                        <td className='td-actions text-right'>
                          <Button
                            color='link'
                            id='tooltip155151810'
                            title=''
                            type='button'
                          >
                            <i className='tim-icons icon-pencil' />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip155151810'
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue='' type='checkbox' />
                              <span className='form-check-sign'>
                                <span className='check' />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className='title'>Solve the issues</p>
                          <p className='text-muted'>
                            Fifty percent of all respondents said they would be
                            more likely to shop at a company
                          </p>
                        </td>
                        <td className='td-actions text-right'>
                          <Button
                            color='link'
                            id='tooltip199559448'
                            title=''
                            type='button'
                          >
                            <i className='tim-icons icon-pencil' />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip199559448'
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue='' type='checkbox' />
                              <span className='form-check-sign'>
                                <span className='check' />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className='title'>Release v2.0.0</p>
                          <p className='text-muted'>
                            Ra Ave SW, Seattle, WA 98116, SUA 11:19 AM
                          </p>
                        </td>
                        <td className='td-actions text-right'>
                          <Button
                            color='link'
                            id='tooltip989676508'
                            title=''
                            type='button'
                          >
                            <i className='tim-icons icon-pencil' />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip989676508'
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue='' type='checkbox' />
                              <span className='form-check-sign'>
                                <span className='check' />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className='title'>Export the processed files</p>
                          <p className='text-muted'>
                            The report also shows that consumers will not easily
                            forgive a company once a breach exposing their
                            personal data occurs.
                          </p>
                        </td>
                        <td className='td-actions text-right'>
                          <Button
                            color='link'
                            id='tooltip557118868'
                            title=''
                            type='button'
                          >
                            <i className='tim-icons icon-pencil' />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip557118868'
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue='' type='checkbox' />
                              <span className='form-check-sign'>
                                <span className='check' />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className='title'>Arival at export process</p>
                          <p className='text-muted'>
                            Capitol Hill, Seattle, WA 12:34 AM
                          </p>
                        </td>
                        <td className='td-actions text-right'>
                          <Button
                            color='link'
                            id='tooltip143185858'
                            title=''
                            type='button'
                          >
                            <i className='tim-icons icon-pencil' />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target='tooltip143185858'
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div> */}
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
                            href='#'
                            onClick={(e) => e.preventDefault()}
                          >
                            Action
                          </DropdownItem>
                          <DropdownItem
                            href='#'
                            onClick={(e) => e.preventDefault()}
                          >
                            Another action
                          </DropdownItem>
                          <DropdownItem
                            href='#'
                            onClick={(e) => e.preventDefault()}
                          >
                            Something else
                          </DropdownItem>
                          <DropdownItem
                            className='text-danger'
                            href='#'
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

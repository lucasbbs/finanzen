import axios from 'axios';
import { currencyFormat } from 'helpers/functions';
import { getDataForTheInvestmentProjectChart } from 'helpers/functions';
import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  CustomInput,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from 'reactstrap';
import NotificationAlert from 'react-notification-alert';
import ReactBSAlert from 'react-bootstrap-sweetalert';

const InvestmentProjects = () => {
  const [alert, setAlert] = useState(null);
  const [data, setData] = useState([]);
  const [boolRate, setBoolRate] = useState(false);
  const [boolTerm, setBoolTerm] = useState(false);
  const [modal, setModal] = useState(false);
  const [term, setTerm] = useState(0);
  const [rate, setRate] = useState(0);
  const [name, setName] = useState('');
  const [investmentProjectId, setInvestmentProjectId] = useState('');
  const [initialAmount, setInitialAmount] = useState(0);
  const [monthlyDeposit, setMonthlyDeposit] = useState(0);
  const [investmentProjects, setInvestmentProjects] = useState([]);
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );

  const address = process.env.REACT_APP_SERVER_ADDRESS;

  const hideAlert = () => {
    setAlert(null);
  };
  const success = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: 'block', marginTop: '-100px' }}
        title='Deleted!'
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle='success'
        btnSize=''
      >
        'Your investment project was deleted...'
      </ReactBSAlert>
    );
  };
  const cancel = () => {
    setAlert(
      <ReactBSAlert
        danger
        style={{
          display: 'block',
          marginTop: '-100px',
        }}
        title='Cancelled'
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnText='Ok'
        confirmBtnBsStyle='success'
        btnSize=''
      ></ReactBSAlert>
    );
  };

  const warningWithConfirmAndCancelMessage = (id) => {
    setAlert(
      <ReactBSAlert
        warning
        style={{
          display: 'block',
          marginTop: '-100px',
        }}
        title='Are you sure?'
        onConfirm={() => handleDelete(id)}
        onCancel={() => cancel()}
        confirmBtnBsStyle='success'
        cancelBtnBsStyle='danger'
        confirmBtnText='Yes, delete!'
        cancelBtnText='Cancel'
        showCancel
        btnSize=''
      >
        'You will not be able to restore the data for your investment project'
      </ReactBSAlert>
    );
  };
  useEffect(() => {
    const getData = async () => {
      const config = { headers: { Authorization: `Bearer ${login.token}` } };
      const { data } = await axios.get(
        `${address}/api/investmentProjects/`,
        config
      );
      setInvestmentProjects(data);
    };
    getData();
  }, []);

  useEffect(() => {
    let monthlyRate;
    let termPeriod;
    if (!boolRate) {
      monthlyRate = rate;
    } else {
      monthlyRate = ((1 + rate / 100) ** (1 / 12) - 1) * 100;
    }
    if (!boolTerm) {
      termPeriod = term;
    } else {
      termPeriod = term * 12;
    }
    setData(
      getDataForTheInvestmentProjectChart(
        initialAmount,
        monthlyDeposit,
        termPeriod,
        monthlyRate
      )
    );
  }, [initialAmount, monthlyDeposit, term, rate, boolRate, boolTerm]);
  let chart1_2_options = {
    maintainAspectRatio: false,
    legend: {
      display: false,
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
        label: function (context, data) {
          var label = data.datasets[context.datasetIndex].label + ': ';
          // console.log(data.datasets[context.datasetIndex]); //[context.dataseIndex]);
          if (context.value !== null) {
            label += new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(context.value);
          }
          return label;
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
            color: 'rgba(91, 33, 182,0.0)',
            zeroLineColor: 'transparent',
          },
          ticks: {
            count: 0,
            callback: (label) => currencyFormat(Number(label), 'BRL'),
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
            color: 'rgba(91, 33, 182,0.1)',
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
  let chartExample1 = {
    data1: (canvas) => {
      let ctx = canvas.getContext('2d');

      let blueColor = ctx.createLinearGradient(0, 230, 0, 50);

      blueColor.addColorStop(1, 'rgba(0,30,43,0.8)');
      blueColor.addColorStop(0.2, 'rgba(0,30,43,0.6)');
      blueColor.addColorStop(0.1, 'rgba(0,30,43,0.2)'); //blue colors
      blueColor.addColorStop(0, 'rgba(0,30,43,0)'); //blue colors

      let puprleColor = ctx.createLinearGradient(0, 230, 0, 50);

      puprleColor.addColorStop(1, 'rgba(91, 33, 182,0.6)');
      puprleColor.addColorStop(0.4, 'rgba(91, 33, 182,0.4)');
      puprleColor.addColorStop(0.1, 'rgba(91, 33, 182,0.2)'); //purple colors
      puprleColor.addColorStop(0, 'rgba(91, 33, 182,0.0)'); //purple colors

      let greenColor = ctx.createLinearGradient(0, 230, 0, 50);

      greenColor.addColorStop(1, 'rgba(39, 220, 152,0.4)');
      greenColor.addColorStop(0.4, 'rgba(39, 220, 152,0.0)');
      greenColor.addColorStop(0, 'rgba(39, 220, 152,0.0)'); //purple colors
      return {
        gradientStroke: blueColor,
        gradientStroke2: puprleColor,
        labels: Array.from(data.keys()),
        datasets: [
          {
            label: 'Income',
            fill: true,
            backgroundColor: blueColor,
            borderColor: '#001e2b',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#001e2b',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#001e2b',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: data.map((obj) => obj.totalMonthlyIncome),
          },
          {
            label: 'Inflow investments',
            fill: true,
            backgroundColor: puprleColor,
            borderColor: '#5B21B6',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#5B21B6',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#5B21B6',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: data.map((obj) => obj.deposites),
          },
          {
            label: 'Total investments',
            fill: true,
            backgroundColor: greenColor,
            borderColor: '#27dc98',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#27dc98',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#27dc98',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: data.map((obj) => obj.accruedValue),
          },
        ],
      };
    },
    options: chart1_2_options,
  };

  const handleSave = async (objInvestProject) => {
    const config = { headers: { Authorization: `Bearer ${login.token}` } };

    await axios
      .post(`${address}/api/investmentProjects/`, objInvestProject, config)
      .then(({ data }) => {
        setInvestmentProjects([...investmentProjects, data]);
        notify('You have successfully saved your investment project');
      })
      .catch((error) =>
        notify(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          'danger'
        )
      );
  };
  const handleLoad = async () => {
    const filtered = investmentProjects.find(
      (project) => project._id === investmentProjectId
    );
    setName(filtered.name);
    setRate(filtered.rate);
    setTerm(filtered.term);
    setInitialAmount(filtered.initialAmount);
    setMonthlyDeposit(filtered.monthlyDeposit);
    setBoolRate(filtered.boolRate);
    setBoolTerm(filtered.boolTerm);
    toggle();
  };

  const handleDelete = async (id) => {
    const config = { headers: { Authorization: `Bearer ${login.token}` } };
    try {
      await axios.delete(`${address}/api/investmentProjects/${id}`, config);
      setInvestmentProjects([
        ...investmentProjects.filter((inv) => inv._id !== id),
      ]);

      if (id === investmentProjectId) {
        setName('');
        setRate(0);
        setTerm(0);
        setInitialAmount(0);
        setMonthlyDeposit(0);
        setBoolRate(false);
        setBoolTerm(false);
      }
      toggle();
      success();
    } catch (error) {
      notify(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
        'danger'
      );
      hideAlert();
    }
  };
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

  const toggle = () => {
    setModal(!modal);
  };
  return (
    <div className='content'>
      <div className='react-notification-alert-container'>
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <Modal modalClassName='modal-black' isOpen={modal}>
        <ModalHeader></ModalHeader>
        <ModalBody>
          {investmentProjects.map((project) => (
            <div className='row justify-content-between' key={project._id}>
              <FormGroup check className='form-check-radio'>
                <Label check>
                  <Input
                    checked={project._id === investmentProjectId}
                    onChange={(e) => setInvestmentProjectId(e.target.value)}
                    value={project._id}
                    id='exampleRadios2'
                    name='radiosToSelectProject'
                    type='radio'
                  />
                  <span className='form-check-sign' />
                  {project.name}
                </Label>
              </FormGroup>
              <Button
                className='btn-link'
                data-id={project._id}
                onClick={
                  (e) =>
                    warningWithConfirmAndCancelMessage(
                      e.currentTarget.getAttribute('data-id')
                    )
                  // handleDelete(e.currentTarget.getAttribute('data-id'))
                }
                color='danger'
              >
                <i className='fas fa-trash-alt'></i>
              </Button>
            </div>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button onClick={toggle} color='danger'>
            Cancel
          </Button>
          <Button
            style={{
              marginTop: 0,
              marginLeft: '0px',
              padding: '10px 20px',
            }}
            onClick={() => handleLoad()}
            disabled={
              investmentProjects.length === 0 || investmentProjectId == ''
            }
          >
            Load
          </Button>
        </ModalFooter>
      </Modal>
      {alert}
      <Card className='card-chart'>
        <CardHeader>
          <Row>
            <CardTitle className='m-0' tag='h1'>
              <i className='tim-icons icon-chart-bar-32'></i> Investment
              Projects
            </CardTitle>
          </Row>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md='4'>
              <Label htmlFor='nameId'>
                Name
                <sup style={{ color: 'red', fontWeight: 900 }}>*</sup>
              </Label>
              <Input
                style={{ backgroundColor: '#2b3553' }}
                id='nameId'
                value={name}
                onChange={(e) => setName(e.target.value)}
                type='text'
              />
              <Row>
                <Col md='6'>
                  <Label htmlFor='rateId'>
                    Rate (%)
                    <sup style={{ color: 'red', fontWeight: 900 }}>*</sup>
                  </Label>
                  <Input
                    style={{ backgroundColor: '#2b3553' }}
                    id='rateId'
                    type='number'
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    min={0}
                  />
                </Col>
                <Col md='6' style={{ paddingTop: '30px' }}>
                  <CustomInput
                    type='switch'
                    id='switchRate'
                    label={boolRate ? 'Yearly' : 'Monthly'}
                    checked={boolRate}
                    onChange={(e) => setBoolRate(e.target.checked)}
                  />
                </Col>
              </Row>
              <Row>
                <Col md='6'>
                  <Label htmlFor='termId'>Term</Label>
                  <Input
                    style={{ backgroundColor: '#2b3553' }}
                    id='termId'
                    type='number'
                    min={0}
                    value={term}
                    onChange={(event) => {
                      setTerm(Number(event.target.value.replace('.', '')));
                    }}
                  />
                </Col>
                <Col md='6' style={{ paddingTop: '30px' }}>
                  <CustomInput
                    type='switch'
                    id='switchTerm'
                    label={boolTerm ? 'Years' : 'Months'}
                    checked={boolTerm}
                    onChange={(e) => setBoolTerm(e.target.checked)}
                  />
                </Col>
              </Row>

              <Label htmlFor='initialAmountId'>Initial amount</Label>
              <Input
                id='initialAmountId'
                style={{ backgroundColor: '#2b3553' }}
                min={0}
                type='number'
                value={initialAmount}
                onChange={(e) => setInitialAmount(Number(e.target.value))}
              />
              <Label htmlFor='monthlyDepositId'>Monthly Deposit</Label>
              <Input
                id='monthlyDepositId'
                style={{ backgroundColor: '#2b3553' }}
                type='number'
                min={0}
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
              />
              <Row className='mt-4 justify-content-between'>
                <Col md='2'>
                  <Button
                    color='success'
                    style={{
                      marginTop: 0,
                      marginLeft: '0px',
                      padding: '10px 20px',
                    }}
                    onClick={() =>
                      handleSave({
                        name,
                        rate,
                        term,
                        initialAmount,
                        monthlyDeposit,
                        boolRate,
                        boolTerm,
                      })
                    }
                  >
                    Save
                  </Button>
                </Col>
                <Col md='4'>
                  <div className='row'>
                    <Button
                      color='primary'
                      onClick={toggle}
                      className='mt-0 text-nowrap'
                    >
                      Select Project
                    </Button>
                  </div>
                </Col>
              </Row>
            </Col>

            <Col md='8'>
              <div style={{ height: '330px' }} className='chart-area'>
                <Line
                  options={chartExample1.options}
                  data={chartExample1['data1']}
                />
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card>
        <Table>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>Month</th>
              <th style={{ textAlign: 'center' }}>Deposit</th>
              <th style={{ textAlign: 'center' }}>Monthly Income</th>
              <th style={{ textAlign: 'center' }}>Accrued Income</th>
              <th style={{ textAlign: 'center' }}>Total accrued value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((project, index) => (
              <tr key={index}>
                <td style={{ textAlign: 'center' }}>{index}</td>
                <td style={{ textAlign: 'center' }}>
                  {currencyFormat(project.deposites, login.currency)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {currencyFormat(
                    Number(project.monthlyIncome.toFixed(2)),
                    login.currency
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {currencyFormat(
                    Number(project.totalMonthlyIncome.toFixed(2)),
                    login.currency
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {currencyFormat(
                    Number(project.accruedValue.toFixed(2)),
                    login.currency
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default InvestmentProjects;

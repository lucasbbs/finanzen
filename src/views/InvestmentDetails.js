import React, { useEffect, useRef, useState } from 'react';
import { fetchInvestments } from 'services/Investments';
import PaginationUI from '../components/Pagination/Pagination';
import { Button, Col, Input, Label, Row } from 'reactstrap';
import { useParams, useHistory } from 'react-router-dom';
import { currencyFormat, reverseFormatNumber } from '../helpers/functions';
// import InputMask from 'react-input-mask';
import NumberFormat from 'react-number-format';
import Incomes from '../components/Incomes/Incomes';
import axios from 'axios';
import NotificationAlert from 'react-notification-alert';
import Spinner from '../components/Spinner/Spinner';
import Config from '../config.json';
import { currencies } from './pages/currencies';

const InvestmentDetails = () => {
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

  const [currentPage, setCurrentPage] = useState(1);
  const [investmentsPerPage, setInvestmentsPerpage] = useState(
    localStorage.getItem('incomesPerPage')
      ? JSON.parse(localStorage.getItem('incomesPerPage'))
      : 8
  );
  const [currency, setCurrency] = useState('');
  const [name, setName] = useState('');
  const [broker, setBroker] = useState('');
  const [brokers, setBrokers] = useState([]);
  const [type, setType] = useState('');
  const [rate, setRate] = useState('');
  const [indexer, setIndexer] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [investmentDate, setInvestmentDate] = useState('');
  const [initialAmount, setInitialAmount] = useState(0);
  const [accruedIncome, setAccruedIncome] = useState(0);
  const [investment, setInvestment] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const { id } = useParams();
  useEffect(() => {
    const getInvestmentDetails = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${login.token}`,
        },
      };
      const brokersFromTheAPI = await axios.get(
        `${Config.SERVER_ADDRESS}/api/brokers`,
        config
      );
      setBrokers(brokersFromTheAPI.data.brokers);
      if (id !== ':id') {
        setIsLoading(true);

        const investment = await fetchInvestments(id, login);
        setInvestment(investment);
        setName(investment['invest'].name);
        setBroker(investment['invest'].broker._id);
        setCurrency(investment['invest'].broker.currency);
        setType(investment['invest'].type);
        setRate(investment['invest'].rate);
        setIndexer(investment['invest'].indexer);
        setDueDate(investment['invest'].due_date);
        setInvestmentDate(investment['invest'].investment_date);
        setInitialAmount(investment['invest'].initial_amount);
        setAccruedIncome(investment['invest'].accrued_income);

        const dates = investment['invest'].incomes
          .filter((invest) => Object.values(invest)[0] !== null)
          .map((key) => Object.keys(key).map((date) => date))
          .flat()
          .map((data) => {
            let datePartes = data.split('-');
            return `${datePartes[2]}/${datePartes[1]}/${datePartes[0]}`;
          });

        const IncomesTemp = investment['invest'].incomes
          .filter((invest) => Object.values(invest)[0] !== null)
          .map((key) => Object.values(key)[0]);

        let temparray = [];
        for (let i = 0; i < IncomesTemp.length; i++) {
          temparray.push([dates[i], IncomesTemp[i]]);
        }

        setIncomes(temparray);
        setIsLoading(false);
      }
    };
    getInvestmentDetails();
  }, [id, login]);

  const indexOfFirstInvestment = currentPage * investmentsPerPage;
  const indexOfLastInvestment = indexOfFirstInvestment + investmentsPerPage;

  const currentincomes = incomes.slice(
    indexOfFirstInvestment - investmentsPerPage,
    indexOfLastInvestment - investmentsPerPage
  );

  //Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const setNumberPerPage = (input) => {
    setInvestmentsPerpage(Number(input));
    setCurrentPage(1);
    localStorage.setItem('incomesPerPage', input);
  };

  const setNewIncomes = (input) => {
    setIncomes(input);
  };
  const history = useHistory();
  const handleSave = async (investmentObj) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${login.token}`,
      },
    };
    await axios
      .post(`${Config.SERVER_ADDRESS}/api/investments`, investmentObj, config)
      .then(async (response) => {
        notify(`${response.data.name} investimento cadastrado com Sucesso`);
        if (login.hasRegisteredInvest) {
          login.fundsToInvest[currency] -= response.data.initial_amount;
          const config = {
            headers: { Authorization: `Bearer ${login.token}` },
          };
          await axios
            .put(
              `${Config.SERVER_ADDRESS}/api/users/${login._id}`,
              {
                fundsToInvest: login.fundsToInvest,
                hasRegisteredInvest: login.hasRegisteredInvest,
              },
              config
            )
            .then((res) => {
              localStorage.setItem('userInfo', JSON.stringify(login));
            });
        }
        history.push(`/admin/investment/${response.data._id}`);
      })
      .catch((error) => {
        console.log(error);

        notify(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          'danger'
        );
      });
  };
  return (
    <>
      {!isLoading ? '' : <Spinner />}
      <div className='react-notification-alert-container'>
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div
        className='content'
        style={{ filter: `blur(${!isLoading ? 0 : 3}px)` }}
      >
        <Row>
          <Col md='12'>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
              }}
            >
              <h1 style={{ marginBottom: '0' }}>
                <i className='tim-icons icon-money-coins'></i> {name}
              </h1>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Col md='10'>
                <Row style={{ marginBottom: '10px' }}>
                  <Col md='6' style={{ paddingRight: '0' }}>
                    <Label>Name</Label>
                    <Input
                      required
                      style={{ backgroundColor: '#2b3553' }}
                      type='text'
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                  </Col>
                  <Col md='2' style={{ paddingRight: '0' }}>
                    <Label>Broker</Label>
                    <Input
                      required
                      style={{ backgroundColor: '#2b3553' }}
                      type='select'
                      value={broker}
                      onChange={(e) => {
                        setBroker(e.target.value);
                        setCurrency(
                          e.target[e.target.selectedIndex].getAttribute(
                            'currency'
                          )
                        );
                        console.log();
                      }}
                    >
                      <option value='' disabled={true}>
                        Select an option
                      </option>
                      {brokers.map((broker) => (
                        <option
                          key={broker._id}
                          id={broker._id}
                          country={broker.country}
                          currency={broker.currency}
                          value={broker._id}
                        >
                          {broker.name}
                        </option>
                      ))}
                    </Input>
                  </Col>
                  <Col md='2' style={{ paddingRight: '0' }}>
                    <Label>Type</Label>
                    <Input
                      style={{ backgroundColor: '#2b3553' }}
                      type='select'
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value='' disabled={true}>
                        Select an option
                      </option>
                      <option>CDB</option>
                      <option>LCI</option>
                      <option>LCA</option>
                      <option>Debênture</option>
                    </Input>
                  </Col>
                  <Col md='2' style={{ paddingRight: '0' }}>
                    <Label>Rate</Label>
                    <Input
                      style={{ backgroundColor: '#2b3553' }}
                      type='text'
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md='2' style={{ paddingRight: '0' }}>
                    <Label>Indexer</Label>
                    <Input
                      required
                      style={{ backgroundColor: '#2b3553' }}
                      type='select'
                      value={indexer}
                      onChange={(e) => setIndexer(e.target.value)}
                    >
                      <option value='' disabled={true}>
                        Select an option
                      </option>
                      <option>CDI</option>
                      <option>IPCA</option>
                      <option>Prefixado</option>
                    </Input>
                  </Col>
                  <Col md='3' style={{ paddingRight: '0' }}>
                    <Label>Investment date</Label>
                    <Input
                      style={{ backgroundColor: '#2b3553' }}
                      type='date'
                      value={investmentDate.slice(0, 10)}
                      onChange={(e) => {
                        setInvestmentDate(e.target.value);
                      }}
                    />
                  </Col>
                  <Col md='3' style={{ paddingRight: '0' }}>
                    <Label>Due date</Label>
                    <Input
                      style={{ backgroundColor: '#2b3553' }}
                      type='date'
                      value={dueDate.slice(0, 10)}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </Col>
                  <Col md='2' style={{ paddingRight: '0' }}>
                    <Label>Initial amount</Label>
                    <NumberFormat
                      style={{ backgroundColor: '#2b3553' }}
                      onChange={(e) => setInitialAmount(e.target.value)}
                      type='text'
                      value={initialAmount}
                      placeholder={`${currencies[currency]?.symbol_native}0,00`}
                      thousandSeparator={'.'}
                      decimalSeparator={','}
                      prefix={currencies[currency]?.symbol_native}
                      customInput={Input}
                      isAllowed={(values) => {
                        const { formattedValue, floatValue } = values;
                        return login.hasRegisteredInvest
                          ? formattedValue === '' ||
                              (floatValue >= 0 &&
                                floatValue <= login.fundsToInvest[currency])
                          : true;
                      }}
                    />
                  </Col>
                  <Col md='2' style={{ paddingRight: '0' }}>
                    <Label>Accrued income</Label>
                    <NumberFormat
                      readOnly
                      style={{
                        backgroundColor: '#2b3553',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                      type='text'
                      value={accruedIncome}
                      placeholder={`${currencies[currency]?.symbol_native}0,00`}
                      thousandSeparator={'.'}
                      decimalSeparator={','}
                      prefix={currencies[currency]?.symbol_native}
                      customInput={Input}
                    />
                  </Col>
                </Row>
              </Col>
            </div>

            {investment['isValid'] ? (
              <>
                <Incomes
                  id={id}
                  incomesToBeUpdated={investment['invest'].incomes}
                  incomes={currentincomes}
                  numberPerPage={investmentsPerPage}
                  setNumberPerPage={setNumberPerPage}
                  setNewIncomes={setNewIncomes}
                  setAccruedIncome={setAccruedIncome}
                  setIsLoading={setIsLoading}
                  currency={currency}
                />
                <PaginationUI
                  incomesPerPage={investmentsPerPage}
                  totalIncomes={incomes.length}
                  paginate={paginate}
                  currentPageNumber={currentPage}
                />
              </>
            ) : (
              <div className='mt-3'>
                <Row
                  className='flex-column justify-content-center align-items-center m-80'
                  // style={{ flexDirection: 'column' }}
                >
                  <Button
                    className='mt-30'
                    color='success'
                    onClick={() =>
                      handleSave({
                        name,
                        broker,
                        type,
                        rate,
                        indexer,
                        investment_date: investmentDate,
                        due_date: dueDate,
                        initial_amount: reverseFormatNumber(
                          initialAmount,
                          'pt-BR'
                        ),
                      })
                    }
                  >
                    Save
                  </Button>
                  {login.hasRegisteredInvest ? (
                    <>
                      <h4 className='mt-4'>
                        Your current funds to invest
                        <br />
                      </h4>
                      <h3 style={{ display: 'block', textAlign: 'center' }}>
                        {currencyFormat(
                          (login.fundsToInvest[currency]
                            ? login.fundsToInvest[currency]
                            : 0) - reverseFormatNumber(initialAmount),
                          currency || login.currency
                        )}
                      </h3>
                    </>
                  ) : null}
                </Row>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default InvestmentDetails;

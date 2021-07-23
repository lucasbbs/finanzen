import { useEffect, useRef } from 'react';
import Spinner from 'components/Spinner/Spinner';
import NotificationAlert from 'react-notification-alert';
import { useState } from 'react';
import Config from '../config.json';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Card, Col, Input, Label, Row, Table } from 'reactstrap';
import { currencies } from './pages/currencies';
import ModalIconPicker from 'components/ModalIconPIcker/ModalIconPicker';
import NumberFormat from 'react-number-format';
import { reverseFormatNumber } from 'helpers/functions';
import { currencyFormat } from 'helpers/functions';
import ModalTransactions from 'components/ModalTransactions/ModalTransactions';

const AccountDetails = () => {
  const [modalTransactions, setModalTransactions] = useState(false);
  const [selected, setSelected] = useState('Revenue');
  const history = useHistory();
  const [name, setName] = useState('');
  const [icons, setIcons] = useState([]);
  const [modalIcons, setModalIcons] = useState(false);
  const [icon, setIcon] = useState('');
  const [amount, setAmount] = useState(0);
  const [iconId, setIconId] = useState('');
  const [currency, setCurrency] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const [isLoading, setIsLoading] = useState(true);
  const notificationAlertRef = useRef(null);
  const { id } = useParams();

  const toggleModalTransactions = () =>
    setModalTransactions(!modalTransactions);

  const toggleModalIcons = () => setModalIcons(!modalIcons);
  const handleSubmit = async (objAccount) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${login.token}`,
      },
    };
    await axios
      .post(`${Config.SERVER_ADDRESS}/api/accounts`, objAccount, config)
      .then((res) => {
        notify('You have successfully created an account');
        history.push(`/account/${res.data._id}`);
      })
      .catch((error) => {
        notify(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          'danger'
        );
      });
  };
  useEffect(() => {
    const getTransactions = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${login.token}`,
        },
      };
      const transactionsFromTheAPI = await axios.get(
        `${Config.SERVER_ADDRESS}/api/transactions`,
        config
      );
      setTransactions(transactionsFromTheAPI.data.transactions);
    };
    getTransactions();
  }, [login.token]);
  useEffect(() => {
    const getAccountDetails = async () => {
      const iconsFromTheAPI = await axios.get(
        `${Config.SERVER_ADDRESS}/api/icons`
      );
      setIcons(iconsFromTheAPI.data);

      if (id !== ':id') {
        const config = {
          headers: {
            Authorization: `Bearer ${login.token}`,
          },
        };

        const accountFromTheAPI = await axios.get(
          `${Config.SERVER_ADDRESS}/api/accounts/${id}`,
          config
        );
        setIconId(accountFromTheAPI.data.account.icon);

        setIcon(
          icons.find((ico) => ico._id === accountFromTheAPI.data.account.icon)
            ?.Number
        );
        setName(accountFromTheAPI.data.account.name);
        setCurrency(accountFromTheAPI.data.account.currency);
        setAmount(accountFromTheAPI.data.account.initialAmmount);

        if (accountFromTheAPI.data['hasLoaded'] && icon !== '') {
          console.log(icon);
          setIsLoading(false);
        }
      } else {
        if (icon === '') {
          const numberIcon = Math.floor(Math.random() * (1660 - 100 + 1)) + 100;
          setIcon(numberIcon);
          const randomIconId = iconsFromTheAPI.data.find(
            (ico) => ico.Number === numberIcon
          )?._id;
          setIconId(randomIconId);
          setIsLoading(false);
        }
      }
    };
    getAccountDetails();
    // eslint-disable-next-line
  }, [icon]);
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
      <div className='react-notification-alert-container'>
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div className='content'>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <ModalTransactions
              toggleModalTransactions={toggleModalTransactions}
              selected={selected}
              setSelected={setSelected}
              modalTransactions={modalTransactions}
              token={login.token}
              currency={currency}
              id={id}
              transactions={transactions}
              setTransactions={setTransactions}
            />
            <ModalIconPicker
              modalIcons={modalIcons}
              setModalIcons={setModalIcons}
              setIcon={setIcon}
              setIconId={setIconId}
            />
            <Row className='justify-content-center'>
              <Col md='12'>
                <div
                  className='mx-5'
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px',
                  }}
                >
                  <h1 style={{ marginBottom: '0' }}>
                    <i className='fas fa-dollar-sign'></i> {name}
                  </h1>
                  <Button onClick={toggleModalTransactions}>
                    New Transaction
                  </Button>
                </div>
                <Col md='10' className='mx-auto'>
                  <Row
                    style={{ marginBottom: '10px' }}
                    className='align-items-center'
                  >
                    <Col md='3' style={{ paddingRight: '0' }}>
                      <Label>Name</Label>
                      <Input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ backgroundColor: '#2b3553' }}
                      />
                    </Col>
                    <Col md='3' style={{ paddingRight: '0' }}>
                      <Label>Currency</Label>
                      <Input
                        style={{ backgroundColor: '#2b3553' }}
                        type='select'
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                      >
                        <option value='' disabled={true}>
                          Select an option
                        </option>
                        {Object.entries(currencies).map((currency) => (
                          <option key={currency[0]} value={currency[0]}>
                            {currency[1].name}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col md='3' style={{ paddingRight: '0' }}>
                      <Label>Initial amount</Label>
                      <NumberFormat
                        style={{ backgroundColor: '#2b3553' }}
                        onChange={(e) => {
                          // setHasChanged(true);
                          setAmount(reverseFormatNumber(e.target.value));
                        }}
                        type='text'
                        value={amount}
                        placeholder={`${
                          (currencies[currency]?.symbol_native
                            ? currencies[currency]?.symbol_native
                            : '') + ' '
                        }0,00`}
                        thousandSeparator={'.'}
                        decimalSeparator={','}
                        prefix={
                          (currencies[currency]?.symbol_native
                            ? currencies[currency]?.symbol_native
                            : '') + ' '
                        }
                        customInput={Input}
                        isAllowed={(values) => {
                          const { formattedValue, floatValue } = values;
                          return formattedValue === '' || floatValue >= 0;
                        }}
                      />
                    </Col>
                    <Col md='3' className='row flex-column'>
                      <Label>Pick an Icon</Label>
                      <Button
                        style={{
                          color: 'hsla(0,0%,100%,.8)',
                          marginLeft: '20px',
                          backgroundColor: '#000000',
                          borderRadius: '50%',
                          height: '70px',
                          width: '70px',
                        }}
                        className='btn btn-link btn-just-icon'
                        onClick={toggleModalIcons}
                      >
                        <span style={{ fontSize: '45px' }}>
                          <i className={`icomoon-${icon}`} />
                        </span>
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Col>
              {id !== ':id' ? (
                <Col md='9'>
                  <Card>
                    <Table>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'center' }}>Type</th>
                          <th style={{ textAlign: 'center' }}>Category</th>
                          <th>Name</th>
                          <th>Observation</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((trans) => (
                          <tr key={trans._id}>
                            <td style={{ textAlign: 'center' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  fontSize: '45px',
                                  lineHeight: '45px',
                                  color:
                                    trans.type === 'Revenue' ? ' green' : 'red',
                                }}
                              >
                                {trans.type === 'Revenue' ? (
                                  <i className='icomoon-plus' />
                                ) : (
                                  <i className='icomoon-minus' />
                                )}
                              </span>
                              <br />
                              {trans.type}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  fontSize: '45px',
                                  backgroundColor: 'black',
                                  lineHeight: '45px',
                                  height: '65px',
                                  width: '65px',
                                  borderRadius: '50%',
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '60px',
                                  }}
                                >
                                  <i
                                    className={`icomoon-${trans.category.icon.Number}`}
                                  />
                                </div>
                              </span>
                            </td>
                            <td>{trans.category.name}</td>
                            <td>{trans.observation}</td>
                            <td>{currencyFormat(trans.ammount, currency)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card>
                </Col>
              ) : (
                <Button
                  color='success'
                  onClick={() =>
                    handleSubmit({
                      name,
                      currency,
                      initialAmmount: amount,
                      icon: iconId,
                    })
                  }
                >
                  Save
                </Button>
              )}
            </Row>
          </>
        )}
      </div>
    </>
  );
};

export default AccountDetails;

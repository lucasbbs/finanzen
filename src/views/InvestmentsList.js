import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Spinner from '../components/Spinner/Spinner';
import { fetchInvestments } from '../services/Investments';
import {
  currencyFormat,
  decimalFormat,
  reverseFormatNumber,
} from '../helpers/functions';
import axios from 'axios';
import NotificationAlert from 'react-notification-alert';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import NumberFormat from 'react-number-format';
import MyTooltip from 'components/Tooltip/MyTooltip';
import { currencies } from './pages/currencies';
import { GlobalContext } from 'context/GlobalState';

/*eslint-disable*/
const InvestmentsList = () => {
  const { accounts, updateAccounts } = useContext(GlobalContext);
  const [typeOperation, setTypeOperation] = useState('archive');
  const [hasSelectedAccount, setHasSelectedAccount] = useState(false);
  const [account, setAccount] = useState('');
  const [code, setCode] = useState('');
  // const [accountsToBeDisplayed, setAccountsToBeDisplayed] = useState([]);
  const [currency, setCurrency] = useState('');
  console.log(
    accounts.find((account) => account.currency === currency)?.initialAmmount,
    accounts.find((account) => account.currency === currency)?.balance,
    'this is the value of initial Amount 2'
  );
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [broker, setBroker] = useState('');
  const [type, setType] = useState('');
  const [rate, setRate] = useState('');
  const [indexer, setIndexer] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [investmentDate, setInvestmentDate] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [initialAmount2, setInitialAmount2] = useState(0);
  const [accruedIncome, setAccruedIncome] = useState(0);
  const [hasChanged, setHasChanged] = useState(false);
  const [brokers, setBrokers] = useState([]);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [investment, setInvestment] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalToSelectAccount, setModalToSelectAccount] = useState(false);
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );

  const address = process.env.REACT_APP_SERVER_ADDRESS;

  const handleUpdate = async (investmentObj, id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${login.token}`,
      },
    };
    if (hasChanged) {
      investmentObj['initial_amount'] = reverseFormatNumber(initialAmount);
      setHasChanged(false);
    }
    await axios
      .put(`${address}/api/investments/${id}`, investmentObj, config)
      .then(async (response) => {
        toggle();
        notify(`Investment updated successfully`);
        investmentObj['broker'] = brokers.find(
          (brk) => brk._id === investmentObj['broker']
        );

        if (!investmentObj['initial_amount']) {
          investmentObj['initial_amount'] = initialAmount;
        }
        investment.splice(
          investment.findIndex((invest) => invest._id === id),
          1,
          investmentObj
        );

        setInvestment([...investment]);

        //------------STUFF RELATED TO THE CURRENT AMOUNT OF MONEY---------------//

        await axios
          .put(
            `${address}/api/users/${login._id}`,
            { fundsToInvest: login.fundsToInvest },
            config
          )
          .then((res) => {
            login.fundsToInvest[currency] = login.fundsToInvest[currency] || 0;
            login.fundsToInvest[currency] += initialAmount2 - initialAmount;
            localStorage.setItem('userInfo', JSON.stringify(login));
            updateAccounts(login.fundsToInvest);
          });
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

  const success = (type = 'archive') => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: 'block', marginTop: '-100px' }}
        title={type === 'archive' ? 'Archived!' : 'Deleted!'}
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle='success'
        btnSize=''
      >
        {type === 'archive'
          ? 'Your investment was archived...'
          : 'Your investment was deleted...'}
      </ReactBSAlert>
    );
  };
  const cancel = () => {
    setAlert(
      <ReactBSAlert
        danger
        style={{ display: 'block', marginTop: '-100px' }}
        title='Cancelled'
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnText='Ok'
        confirmBtnBsStyle='success'
        btnSize=''
      ></ReactBSAlert>
    );
  };
  const warningWithConfirmAndCancelMessage = (
    id,
    type = 'archive',
    currency,
    accountId
  ) => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block', marginTop: '-100px' }}
        title='Are you sure?'
        onConfirm={() => {
          if (type === 'archive') {
            setTypeOperation('archive');
            hideAlert();
            toggleToSelectAccount();
          } else {
            setTypeOperation('delete');
            hideAlert();
            toggleToSelectAccount();
          }
          setHasSelectedAccount(false);
        }}
        onCancel={() => {
          setAccount('');
          cancel();
        }}
        confirmBtnBsStyle='success'
        cancelBtnBsStyle='danger'
        confirmBtnText={type === 'archive' ? 'Yes, archive!' : 'Yes, delete!'}
        cancelBtnText='Cancel'
        showCancel
        btnSize=''
      >
        {type === 'archive'
          ? 'Do you want to archive this investment?'
          : 'You will not be able to restore the data for your investment again'}
      </ReactBSAlert>
    );
  };

  useEffect(() => {
    const getInvestments = async () => {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${login.token}`,
        },
      };
      const brokersFromTheAPI = await axios.get(
        `${address}/api/brokers`,
        config
      );

      setBrokers(brokersFromTheAPI.data.brokers);
      let investments = await fetchInvestments('', login);
      // const filter = JSON.parse(localStorage.getItem('filter'));

      // if (filter !== null) {
      //   investments =
      //     filter.trim() === ''
      //       ? [...investments]
      //       : investments.filter((invest) =>
      //           invest.name.toLowerCase().includes(filter)
      //         );
      //   localStorage.removeItem('filter');
      // }
      setInvestment(investments.investments);
      console.log(investments);
      console.log(investment);
      if (investments.hasLoaded) {
        setIsLoading(false);
      }
      return investments;
    };
    getInvestments();
  }, []);

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

  const handleDelete = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${login.token}`,
      },
    };
    // console.log(`Bearer ${login.token}`);
    const answer = await axios
      .delete(`${address}/api/investments/${id}`, {
        ...config,
        data: { accountSelected: account },
      })
      .then(async (response) => {
        success('delete');
        notify(`Investment deleted successfully`);
        setInvestment(investment.filter((invest) => invest._id !== id));

        //------------STUFF RELATED TO THE CURRENT AMOUNT OF MONEY---------------//

        await axios
          .put(
            `${address}/api/users/${login._id}`,
            { fundsToInvest: login.fundsToInvest },
            config
          )
          .then((res) => {
            console.log(response.data.invest.broker.currency);
            login.fundsToInvest[response.data.invest.broker.currency] =
              login.fundsToInvest[response.data.invest.broker.currency] || 0;
            login.fundsToInvest[response.data.invest.broker.currency] +=
              response.data.invest.accrued_income +
              response.data.invest.initial_amount;
            localStorage.setItem('userInfo', JSON.stringify(login));
            updateAccounts(login.fundsToInvest);
          });
      })
      .catch((error) => {
        notify(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          'danger'
        );
      });
    setId('');
  };
  const hideAlert = () => {
    setAlert(null);
  };

  const toggle = () => {
    if (modal) {
      setAccount('');
    }
    setModal(!modal);
  };
  const toggleToSelectAccount = () =>
    setModalToSelectAccount(!modalToSelectAccount);
  const closeBtn = (
    <button color='danger' className='close' onClick={toggle}>
      <span style={{ color: 'white' }}>×</span>
    </button>
  );
  const handleArchive = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${login.token}`,
      },
    };
    await axios
      .put(
        `${address}/api/investments/${id}/archive`,
        { accountSelected: account },
        config
      )
      .then(async (response) => {
        success();
        notify(`You have successfully archived your investment ${name}`);
        setInvestment(investment.filter((invest) => invest._id !== id));

        // await axios
        //   .put(
        //     `${address}/api/users/${login._id}`,
        //     { fundsToInvest: login.fundsToInvest },
        //     config
        //   )
        //   .then((res) => {
        // console.log(response.data);
        // login.fundsToInvest[response.data.broker.currency] =
        //   login.fundsToInvest[response.data.broker.currency] || 0;
        // login.fundsToInvest[response.data.broker.currency] +=
        //   response.data.accrued_income + response.data.initial_amount;
        // localStorage.setItem('userInfo', JSON.stringify(login));
        updateAccounts();
        // });
      })
      .catch((err) => {
        notify(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message,
          'danger'
        );
      });
    setId('');
  };

  const handleProceed = () => {
    if (hasSelectedAccount) {
      toggleToSelectAccount();
      if (typeOperation === 'archive') {
        handleArchive(id);
      } else {
        handleDelete(id);
      }
    }
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
            <Modal isOpen={modalToSelectAccount} toggle={toggleToSelectAccount}>
              <ModalHeader toggle={toggleToSelectAccount}>
                <span style={{ color: 'red' }}>
                  Please let us know in which account do you wish to receive
                  your money
                </span>
              </ModalHeader>
              <ModalBody>
                <Input
                  id='accountSelector'
                  style={{ color: 'rgb(0 0 0 / 80%)' }}
                  type='select'
                  defaultValue='default'
                  onChange={(e) => {
                    setAccount(e.target.value);
                    setHasSelectedAccount(true);
                  }}
                >
                  <option value='default' disabled={true}>
                    Select an option
                  </option>
                  <option value=''>
                    I do not want to receive the money in any account
                  </option>
                  {accounts
                    .filter((account) => account.currency === currency)
                    .map((account) => (
                      <option key={account._id} value={account._id}>
                        {account.name}
                      </option>
                    ))}
                </Input>
              </ModalBody>
              <ModalFooter>
                <Button onClick={handleProceed}>Proceed</Button>
              </ModalFooter>
            </Modal>
            <Modal
              modalClassName='modal-black'
              style={{
                background:
                  'linear-gradient(180deg,#222a42 0,#1d253b)!important',
              }}
              isOpen={modal}
              toggle={toggle}
              className='modal-lg'
            >
              <ModalHeader
                style={{ color: 'hsla(0,0%,100%,.8)' }}
                toggle={toggle}
                close={closeBtn}
              >
                <span style={{ color: 'hsla(0,0%,100%,.9)' }}>
                  Edit investment
                </span>
              </ModalHeader>
              <ModalBody
                style={{
                  background:
                    'linear-gradient(180deg,#222a42 0,#1d253b)!important',
                }}
              >
                <Label htmlFor='nameID'>
                  Name <sup style={{ color: 'red' }}>*</sup>
                </Label>
                <Input
                  id='nameID'
                  required
                  style={{ backgroundColor: '#2b3553' }}
                  type='text'
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <Row style={{ marginBottom: '10px' }}>
                  <Col md='3' style={{ paddingRight: '0' }}>
                    <Label htmlFor='brokerID'>
                      Broker <sup style={{ color: 'red' }}>*</sup>
                    </Label>
                    <Input
                      id='brokerID'
                      required
                      style={{ backgroundColor: '#2b3553' }}
                      type='select'
                      value={broker}
                      onChange={(e) => {
                        console.log(broker, e.target.value);
                        setBroker(e.target.value);
                        setCurrency(
                          brokers.find(
                            (broker) => broker._id === e.target.value
                          ).currency
                        );
                      }}
                    >
                      <option value='default' disabled={true}>
                        Select an option
                      </option>
                      {brokers.map((brk) => (
                        <option key={brk._id} value={brk._id}>
                          {brk.name}
                        </option>
                      ))}
                    </Input>
                  </Col>
                  <Col md='2' style={{ paddingRight: '0' }}>
                    <Label htmlFor='typeID'>
                      Type <sup style={{ color: 'red' }}>*</sup>
                    </Label>
                    <Input
                      id='typeID'
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
                    <Label htmlFor='rateID'>
                      Rate <sup style={{ color: 'red' }}>*</sup>
                    </Label>
                    <Input
                      id='rateID'
                      style={{ backgroundColor: '#2b3553' }}
                      type='text'
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                    />
                  </Col>
                  <Col md='2' style={{ paddingRight: '0' }}>
                    <Label htmlFor='indexerID'>
                      Indexer <sup style={{ color: 'red' }}>*</sup>
                    </Label>
                    <Input
                      id='indexerID'
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
                    <Label htmlFor='investmentDateID'>
                      Investment date <sup style={{ color: 'red' }}>*</sup>
                    </Label>
                    <Input
                      id='investmentDateID'
                      style={{ backgroundColor: '#2b3553' }}
                      type='date'
                      value={investmentDate}
                      onChange={(e) => {
                        setInvestmentDate(e.target.value);
                      }}
                    />
                  </Col>
                  <Col md='3' style={{ paddingRight: '0' }}>
                    <Label htmlFor='dueDateID'>
                      Due date <sup style={{ color: 'red' }}>*</sup>
                    </Label>
                    <Input
                      id='dueDateID'
                      style={{ backgroundColor: '#2b3553' }}
                      type='date'
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </Col>
                  <Col md='2' style={{ paddingRight: '0' }}>
                    <Label htmlFor='initialAmountID'>
                      Initial amount <sup style={{ color: 'red' }}>*</sup>
                    </Label>
                    <NumberFormat
                      id='initialAmountID'
                      style={{ backgroundColor: '#2b3553' }}
                      onChange={(e) => {
                        setHasChanged(true);
                        setInitialAmount(reverseFormatNumber(e.target.value));
                      }}
                      type='text'
                      value={initialAmount}
                      placeholder={`${currencies[currency]?.symbol_native}0`}
                      thousandSeparator={'.'}
                      decimalSeparator={','}
                      prefix={currencies[currency]?.symbol_native}
                      customInput={Input}
                      isAllowed={(values) => {
                        const { formattedValue, floatValue } = values;
                        return login.hasRegisteredInvest
                          ? formattedValue === '' ||
                              (floatValue >= 0 &&
                                floatValue <=
                                  initialAmount2 +
                                    (accounts.find(
                                      (account) => account.currency === currency
                                    )?.initialAmmount +
                                      accounts.find(
                                        (account) =>
                                          account.currency === currency
                                      )?.balance +
                                      0.0 || 0))
                          : true;
                      }}
                    />
                  </Col>
                  <Col md='3'>
                    <Label htmlFor='accountID'>
                      Account <sup style={{ color: 'red' }}>*</sup>
                    </Label>
                    <Input
                      id='accountID'
                      type='select'
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
                      style={{ backgroundColor: '#2b3553' }}
                    >
                      <option value='' selected disabled={true}>
                        Select an option
                      </option>
                      {accounts
                        .filter((account) => account.currency === currency)
                        .map((account) => (
                          <option key={account._id} value={account._id}>
                            {account.name}
                          </option>
                        ))}
                    </Input>
                  </Col>
                  <Col
                    style={{
                      display:
                        type === 'Debênture' && currency === 'BRL'
                          ? 'block'
                          : 'none',
                    }}
                    md='2'
                  >
                    <Label htmlFor='codeId'>
                      Code <sup style={{ color: 'red' }}>*</sup>
                    </Label>
                    <Input
                      required={type === 'Debênture' && currency === 'BRL'}
                      id='codeId'
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      style={{ backgroundColor: '#2b3553' }}
                    ></Input>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter
                style={{
                  background:
                    'linear-gradient(180deg,#222a42 0,#1d253b)!important',
                }}
              >
                <Button
                  color='success'
                  onClick={() => {
                    handleUpdate(
                      {
                        _id: id,
                        name,
                        broker,
                        type,
                        rate,
                        account,
                        indexer,
                        code,
                        investment_date: new Date(
                          new Date(investmentDate).getTime() +
                            new Date().getTimezoneOffset() * 60000
                        ),
                        due_date: new Date(
                          new Date(dueDate).getTime() +
                            new Date().getTimezoneOffset() * 60000
                        ),
                        accrued_income: accruedIncome,
                      },
                      id
                    );
                  }}
                >
                  Save
                </Button>
                <Button color='danger' onClick={toggle}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>

            {alert}
            <Row>
              <Col md='12'>
                <Card style={{ position: 'relative' }}>
                  <CardHeader className='row justify-content-between ml-2 mt-1 mr-2 align-items-center'>
                    <CardTitle className='m-0' tag='h1'>
                      <i className='tim-icons icon-wallet-43'></i> Investments
                    </CardTitle>
                    <Link to='/admin/investment/:id'>
                      <Button>New Investment</Button>
                    </Link>
                  </CardHeader>
                  <CardBody>
                    <div
                      className='table-responsive'
                      style={{ overflowY: 'hidden', overflowX: 'auto' }}
                    >
                      <Table
                        className='tablesorter'
                        // responsive
                        style={{ overflowX: 'auto', position: 'relative' }}
                      >
                        <thead className='text-primary'>
                          <tr>
                            <th>Name</th>
                            <th>Broker</th>
                            <th>Type</th>
                            <th>Rate</th>
                            <th
                              style={{
                                display: 'table-cell',
                                textAlign: 'center',
                              }}
                            >
                              Duration
                            </th>
                            <th>Indexer</th>
                            <th>investment date</th>
                            <th>due date</th>
                            <th className='text-center'>initial amount</th>
                            <th className='text-center'>accrued income</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {investment.map((inves) => (
                            <tr id={inves._id} key={inves._id}>
                              <td>
                                <Link to={`/admin/investment/${inves._id}`}>
                                  {inves.name}
                                </Link>
                              </td>
                              <td>{inves.broker.name}</td>
                              <td>{inves.type}</td>
                              <td>{inves.rate}</td>
                              <td
                                style={{
                                  display: 'table-cell',
                                  textAlign: 'center',
                                }}
                              >
                                {inves.duration
                                  ? decimalFormat(inves.duration, 2)
                                  : ''}
                                {inves.duration ? ' days' : <span>—</span>}
                              </td>
                              <td>{inves.indexer}</td>
                              <td>
                                {moment(inves.investment_date).format(
                                  'DD/MM/YYYY'
                                )}
                              </td>
                              <td>
                                {moment(inves.due_date).format('DD/MM/YYYY')}
                              </td>
                              <td className='text-center'>
                                {currencyFormat(
                                  inves.initial_amount,
                                  inves.broker.currency
                                )}
                              </td>
                              <td className='text-center'>
                                {currencyFormat(
                                  inves.accrued_income,
                                  inves.broker.currency
                                )}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <MyTooltip
                                  placement='top'
                                  target={`archive-${inves._id}`}
                                >
                                  Arquivar
                                </MyTooltip>
                                <Button
                                  style={{ cursor: 'default' }}
                                  id={`archive-${inves._id}`}
                                  color='info'
                                  size='sm'
                                  className={classNames(
                                    'btn-icon btn-link like'
                                  )}
                                >
                                  <i
                                    style={{ cursor: 'pointer' }}
                                    id={inves._id}
                                    className='fas fa-archive'
                                    onClick={(e) => {
                                      const filteredCurrency = investment.find(
                                        (invest) =>
                                          invest._id ===
                                          e.target.parentElement.parentElement
                                            .parentElement.id
                                      ).broker.currency;

                                      let accountId = investment.find(
                                        (invest) =>
                                          invest._id ===
                                          e.target.parentElement.parentElement
                                            .parentElement.id
                                      ).account;
                                      setId(
                                        e.target.parentElement.parentElement
                                          .parentElement.id
                                      );
                                      setAccount(
                                        accounts.some(
                                          (account) => account._id === accountId
                                        )
                                          ? accountId
                                          : ''
                                      );
                                      setCurrency(filteredCurrency);
                                      warningWithConfirmAndCancelMessage(
                                        e.target.id,
                                        'archive',
                                        filteredCurrency,
                                        accountId
                                      );
                                    }}
                                  ></i>
                                </Button>
                                <MyTooltip
                                  placement='top'
                                  target={`Tooltip-${inves._id}`}
                                >
                                  Editar
                                </MyTooltip>
                                <Button
                                  id={`Tooltip-${inves._id}`}
                                  color='warning'
                                  size='sm'
                                  className={classNames(
                                    'btn-icon btn-link like'
                                  )}
                                  style={{ cursor: 'default' }}
                                >
                                  <i
                                    onClick={(e) => {
                                      const filtered = investment.find(
                                        (invest) =>
                                          invest._id ===
                                          e.target.parentElement.parentElement
                                            .parentElement.id
                                      );
                                      setCode(filtered.code);
                                      setCurrency(filtered.broker.currency);
                                      setBroker(filtered.broker._id);
                                      setId(filtered._id);
                                      setName(filtered.name);
                                      setType(filtered.type);
                                      setRate(filtered.rate);
                                      setIndexer(filtered.indexer);
                                      setDueDate(
                                        new Date(filtered.due_date)
                                          .toISOString()
                                          .slice(0, 10)
                                      );
                                      setInvestmentDate(
                                        new Date(filtered.investment_date)
                                          .toISOString()
                                          .slice(0, 10)
                                      );
                                      setInitialAmount(filtered.initial_amount);
                                      setInitialAmount2(
                                        filtered.initial_amount
                                      );
                                      setAccount(filtered.account);
                                      setAccruedIncome(filtered.accrued_income);
                                      toggle();
                                    }}
                                    className='tim-icons icon-pencil'
                                    style={{ cursor: 'pointer' }}
                                  />
                                </Button>
                                <MyTooltip
                                  placement='top'
                                  target={`Delete-${inves._id}`}
                                >
                                  Excluir
                                </MyTooltip>
                                <Button
                                  id={`Delete-${inves._id}`}
                                  size='sm'
                                  className={classNames('btn-icon btn-link')}
                                  color='danger'
                                  style={{
                                    backgroundColor: 'transparent',
                                    outline: 'none',
                                    borderColor: 'transparent',
                                    cursor: 'default',
                                  }}
                                >
                                  <i
                                    id={inves._id}
                                    style={{
                                      // display: 'inline-block !important',
                                      cursor: 'pointer',
                                    }}
                                    className='tim-icons icon-trash-simple classVisible'
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const filteredCurrency = investment.find(
                                        (invest) =>
                                          invest._id ===
                                          e.target.parentElement.parentElement
                                            .parentElement.id
                                      ).broker.currency;
                                      setCurrency(filteredCurrency);
                                      setId(
                                        e.target.parentElement.parentElement
                                          .parentElement.id
                                      );
                                      warningWithConfirmAndCancelMessage(
                                        e.target.id,
                                        'delete',
                                        filteredCurrency
                                      );
                                    }}
                                  ></i>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
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

export default InvestmentsList;

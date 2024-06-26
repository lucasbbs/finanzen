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
import { fetchArchiveInvestments } from '../services/Investments';
import { currencyFormat, reverseFormatNumber } from '../helpers/functions';
import axios from 'axios';
import NotificationAlert from 'react-notification-alert';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import NumberFormat from 'react-number-format';
import MyTooltip from 'components/Tooltip/MyTooltip';
import { GlobalContext } from 'context/GlobalState';
import { currencies } from './pages/currencies';

/*eslint-disable*/
const ArchiveInvestments = () => {
  const { accounts, updateAccounts } = useContext(GlobalContext);

  const [currency, setCurrency] = useState('');
  const [typeOperation, setTypeOperation] = useState('archive');
  const [account, setAccount] = useState('');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [broker, setBroker] = useState('');
  const [type, setType] = useState('');
  const [rate, setRate] = useState('');
  const [indexer, setIndexer] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [investmentDate, setInvestmentDate] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [transactionDueAccount, setTransactionDueAccount] = useState('');
  const [accruedIncome, setAccruedIncome] = useState(0);
  const [hasChanged, setHasChanged] = useState(false);
  const [brokers, setBrokers] = useState([]);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUnarchive, setIsLoadingUnarchive] = useState(false);
  const [investment, setInvestment] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalToSelectAccount, setModalToSelectAccount] = useState(false);
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );

  useEffect(() => {
    if (account) {
      handleProceed();
    }
  }, [account]);

  const address = process.env.REACT_APP_SERVER_ADDRESS;
  const config = {
    headers: {
      Authorization: `Bearer ${login.token}`,
    },
  };
  const toggleToSelectAccount = () => {
    setModalToSelectAccount(!modalToSelectAccount);

    setAccount('');
  };

  const handleUpdate = async (investmentObj, id) => {
    if (hasChanged) {
      investmentObj['initial_amount'] = reverseFormatNumber(initialAmount);
      setHasChanged(false);
    }
    await axios
      .put(`${address}/api/investments/${id}`, investmentObj, config)
      .then((response) => {
        toggle();
        notify(`Investment updated successfully`);
        investmentObj['broker'] = brokers.find(
          (brk) => brk._id === investmentObj['broker']
        );
        if (!investmentObj['initial_amount']) {
          investmentObj['initial_amount'] = initialAmount;
        }
        // console.log(investment.findIndex((invest) => invest._id === id));
        investment.splice(
          investment.findIndex((invest) => invest._id === id),
          1,
          investmentObj
        );

        setInvestment([...investment]);
      })
      .catch((error) => {
        console.error(error);
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
        title={type === 'archive' ? 'Unarchived!' : 'Deleted!'}
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle='success'
        btnSize=''
      >
        {type === 'archive'
          ? 'Your investment was unarchived...'
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
  const warningWithConfirmAndCancelMessage = (id, type = 'archive') => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block', marginTop: '-100px' }}
        title='Are you sure?'
        onConfirm={async () => {
          if (type === 'archive') {
            const transaction = investment.find((invest) => invest._id === id)
              .transactionDueDate;
            if (transaction) {
              const { data } = await axios.get(
                `${address}/api/transactions/${transaction}`,
                config
              );
              setAccount(data.dueToAccount);
            } else {
              toggleToSelectAccount();
            }
            setTypeOperation('archive');
            hideAlert();
          } else {
            handleDelete(id);
          }
        }}
        onCancel={() => cancel()}
        confirmBtnBsStyle='success'
        cancelBtnBsStyle='danger'
        confirmBtnText={type === 'archive' ? 'Yes, unarchive!' : 'Yes, delete!'}
        cancelBtnText='Cancel'
        showCancel
        btnSize=''
      >
        {type === 'archive'
          ? 'Do you want to restore the data for this investment?'
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
      let investments = await fetchArchiveInvestments('', login);
      const filter = JSON.parse(localStorage.getItem('filter'));

      if (filter !== null) {
        investments =
          filter.trim() === ''
            ? [...investments]
            : investments.filter((invest) =>
                invest.name.toLowerCase().includes(filter)
              );
        localStorage.removeItem('filter');
      }
      setInvestment(investments.investments);
      if (investments.hasLoaded) {
        setIsLoading(false);
      }
      return investments;
    };
    getInvestments();
  }, []);

  // const handleScrolling = (state) => {
  //   // left: 37, up: 38, right: 39, down: 40,
  //   // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
  //   var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

  //   function preventDefault(e) {
  //     e.preventDefault();
  //   }

  //   function preventDefaultForScrollKeys(e) {
  //     if (keys[e.keyCode]) {
  //       preventDefault(e);
  //       return false;
  //     }
  //   }

  //   // modern Chrome requires { passive: false } when adding event
  //   var supportsPassive = false;
  //   try {
  //     window.addEventListener(
  //       'test',
  //       null,
  //       Object.defineProperty({}, 'passive', {
  //         get: function () {
  //           supportsPassive = true;
  //         },
  //       })
  //     );
  //   } catch (e) {}

  //   var wheelOpt = supportsPassive ? { passive: false } : false;
  //   var wheelEvent =
  //     'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

  //   // call this to Disable
  //   function disableScroll() {
  //     window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  //     window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  //     window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  //     window.addEventListener('keydown', preventDefaultForScrollKeys, false);
  //   }

  //   // call this to Enable
  //   function enableScroll() {
  //     window.removeEventListener('DOMMouseScroll', preventDefault, false);
  //     window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  //     window.removeEventListener('touchmove', preventDefault, wheelOpt);
  //     window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
  //   }

  //   if (state) {
  //     console.log(state);
  //     disableScroll();
  //   } else {
  //     console.log(state);
  //     enableScroll();
  //   }
  // };
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
    await axios
      .delete(`${address}/api/investments/${id}`, {
        ...config,
        data: { accountSelected: account },
      })
      .then((response) => {
        success('delete');
        notify(`Investment deleted successfully`);
        setInvestment(investment.filter((invest) => invest._id !== id));
      })
      .catch((error) => {
        notify(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          'danger'
        );
      });
    setAccount('');
  };
  const hideAlert = () => {
    setAlert(null);
  };

  const toggle = () => setModal(!modal);
  const closeBtn = (
    <button color='danger' className='close' onClick={toggle}>
      <span style={{ color: 'white' }}>×</span>
    </button>
  );
  const handleUnarchive = async (id) => {
    setIsLoadingUnarchive(true);
    const config = {
      headers: {
        Authorization: `Bearer ${login.token}`,
      },
    };
    await axios
      .put(
        `${address}/api/investments/${id}/unarchive`,
        { accountSelected: account },
        config
      )
      .then(async (response) => {
        success();
        notify(`You have successfully unarchived your investment`);
        setInvestment(investment.filter((invest) => invest._id !== id));
        updateAccounts();
      })
      .catch((error) => {
        hideAlert();
        notify(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          'danger'
        );
      });
    setAccount('');
    setIsLoadingUnarchive(false);
  };

  const handleProceed = () => {
    if (account) {
      if (typeOperation === 'archive') {
        handleUnarchive(id);
      } else {
        handleDelete(id);
      }
      // toggleToSelectAccount();
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
                  Please let us know in which account do you wish to have the
                  money credited
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
                  Edit Investiment
                </span>
              </ModalHeader>
              <ModalBody
                style={{
                  background:
                    'linear-gradient(180deg,#222a42 0,#1d253b)!important',
                }}
              >
                <Label htmlFor='nameId'>
                  Name
                  <sup style={{ color: 'red', fontWeight: 900 }}>*</sup>
                </Label>
                <Input
                  id='nameId'
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
                    <Label htmlFor='brokerId'>
                      Corretora
                      <sup style={{ color: 'red', fontWeight: 900 }}>*</sup>
                    </Label>
                    <Input
                      id='brokerId'
                      required
                      style={{ backgroundColor: '#2b3553' }}
                      type='select'
                      value={broker}
                      onChange={(e) => {
                        // console.log(broker, e.target.value);
                        setBroker(e.target.value);
                      }}
                    >
                      <option value='' disabled={true}>
                        Selecione uma opção
                      </option>
                      {brokers.map((brk) => (
                        <option key={brk._id} value={brk._id}>
                          {brk.name}
                        </option>
                      ))}
                    </Input>
                  </Col>
                  <Col md='2' style={{ paddingRight: '0' }}>
                    <Label htmlFor='typeId'>
                      Type
                      <sup style={{ color: 'red', fontWeight: 900 }}>*</sup>
                    </Label>
                    <Input
                      id='typeId'
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
                    <Label htmlFor='rateId'>
                      Rate
                      <sup style={{ color: 'red', fontWeight: 900 }}>*</sup>
                    </Label>
                    <Input
                      id='rateId'
                      style={{ backgroundColor: '#2b3553' }}
                      type='text'
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                    />
                  </Col>
                  <Col md='2' style={{ paddingRight: '0' }}>
                    <Label htmlFor='indexerId'>
                      Indexer
                      <sup style={{ color: 'red', fontWeight: 900 }}>*</sup>
                    </Label>
                    <Input
                      id='indexerId'
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
                    <Label htmlFor='investmentDateId'>
                      Investment date
                      <sup style={{ color: 'red', fontWeight: 900 }}>*</sup>
                    </Label>
                    <Input
                      id='investmentDateId'
                      style={{ backgroundColor: '#2b3553' }}
                      type='date'
                      value={investmentDate.slice(0, 10)}
                      onChange={(e) => {
                        setInvestmentDate(e.target.value);
                      }}
                    />
                  </Col>
                  <Col md='3' style={{ paddingRight: '0' }}>
                    <Label htmlFor='dueDateId'>
                      Due Date
                      <sup style={{ color: 'red', fontWeight: 900 }}>*</sup>
                    </Label>
                    <Input
                      id='dueDateId'
                      style={{ backgroundColor: '#2b3553' }}
                      type='date'
                      value={dueDate.slice(0, 10)}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </Col>
                  <Col md='2' style={{ paddingRight: '0' }}>
                    <Label htmlFor='initialAmountId'>Initial Amount</Label>
                    <NumberFormat
                      id='initialAmountId'
                      style={{ backgroundColor: '#2b3553' }}
                      onChange={(e) => {
                        setHasChanged(true);
                        setInitialAmount(e.target.value);
                      }}
                      type='text'
                      value={initialAmount}
                      placeholder={`${currencies[currency]?.symbol_native}0`}
                      thousandSeparator={'.'}
                      decimalSeparator={','}
                      prefix={`${currencies[currency]?.symbol_native}`}
                      customInput={Input}
                    />
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
                    // console.log(id);
                    handleUpdate(
                      {
                        _id: id,
                        name,
                        broker,
                        type,
                        rate,
                        indexer,
                        investment_date: investmentDate,
                        due_date: dueDate,
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
                      <i className='fas fa-file-invoice-dollar'></i> Archive
                      Investments
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    {isLoadingUnarchive ? <Spinner /> : null}
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
                            <td>
                              {inves.broker ? (
                                inves.broker.name
                              ) : (
                                <span
                                  style={{ color: 'gray' }}
                                  id={`unavailable-${inves._id}`}
                                >
                                  <MyTooltip
                                    placement='top'
                                    target={`unavailable-${inves._id}`}
                                  >
                                    This means that you have deleted the broker
                                    info about
                                  </MyTooltip>
                                  unavailable
                                </span>
                              )}
                            </td>
                            <td>{inves.type}</td>
                            <td>{inves.rate}</td>
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
                                target={`unarchive-${inves._id}`}
                              >
                                Unarchive
                              </MyTooltip>
                              <Button
                                style={{ cursor: 'default' }}
                                id={`unarchive-${inves._id}`}
                                color='info'
                                size='sm'
                                className={classNames('btn-icon btn-link like')}
                              >
                                <i
                                  style={{ cursor: 'pointer' }}
                                  id={inves._id}
                                  className='tim-icons icon-upload'
                                  onClick={(e) => {
                                    const filteredCurrency = investment.find(
                                      (invest) =>
                                        invest._id ===
                                        e.target.parentElement.parentElement
                                          .parentElement.id
                                    ).broker.currency;
                                    setCurrency(filteredCurrency);
                                    setTransactionDueAccount(
                                      investment.find(
                                        (invest) => invest._id === e.target.id
                                      ).transactionDueDate
                                    );
                                    setId(e.target.id);
                                    if (inves.broker) {
                                      warningWithConfirmAndCancelMessage(
                                        e.target.id
                                      );
                                    } else {
                                      notify(
                                        'In order to unarchive an investment you should set a broker name for the investment',
                                        'danger'
                                      );
                                    }
                                  }}
                                ></i>
                              </Button>
                              <MyTooltip
                                placement='top'
                                target={`Tooltip-${inves._id}`}
                              >
                                Edit
                              </MyTooltip>
                              <Button
                                id={`Tooltip-${inves._id}`}
                                color='warning'
                                size='sm'
                                className={classNames('btn-icon btn-link like')}
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
                                    setCurrency(filtered.broker.currency);
                                    setBroker(
                                      filtered.broker ? filtered.broker._id : ''
                                    );
                                    setId(filtered._id);
                                    setName(filtered.name);
                                    setType(filtered.type);
                                    setRate(filtered.rate);
                                    setIndexer(filtered.indexer);
                                    setDueDate(filtered.due_date);
                                    setInvestmentDate(filtered.investment_date);
                                    setInitialAmount(filtered.initial_amount);
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
                                Delete
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
                                    // console.log(e.target.id);
                                    warningWithConfirmAndCancelMessage(
                                      e.target.id,
                                      'delete'
                                    );
                                  }}
                                ></i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
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

export default ArchiveInvestments;

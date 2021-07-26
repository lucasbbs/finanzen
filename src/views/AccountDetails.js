import { useContext, useEffect, useRef } from 'react';
import Spinner from 'components/Spinner/Spinner';
import NotificationAlert from 'react-notification-alert';
import { useState } from 'react';
import Config from '../config.json';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from 'reactstrap';
import { currencies } from './pages/currencies';
import ModalIconPicker from 'components/ModalIconPIcker/ModalIconPicker';
import NumberFormat from 'react-number-format';
import { reverseFormatNumber } from 'helpers/functions';
import { currencyFormat } from 'helpers/functions';
import ModalTransactions from 'components/ModalTransactions/ModalTransactions';
import MyTooltip from 'components/Tooltip/MyTooltip';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import { GlobalContext } from 'context/GlobalState';

const AccountDetails = () => {
  const { accounts, updateAccounts, getAccounts } = useContext(GlobalContext);
  const history = useHistory();
  const [alert, setAlert] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [modalTransactions, setModalTransactions] = useState(false);
  const [selected, setSelected] = useState('Revenue');
  const [name, setName] = useState('');
  const [icons, setIcons] = useState([]);
  const [modalIcons, setModalIcons] = useState(false);
  const [icon, setIcon] = useState('');
  const [amount, setAmount] = useState(0);
  const [formerAmount, setFormerAmount] = useState(0);
  const [amountTransactions, setAmountTransactions] = useState(0);
  const [iconId, setIconId] = useState('');
  const [currency, setCurrency] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [initialTransactions, setInitialTransactions] = useState([]);
  const [category, setCategory] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [account, setAccount] = useState('');
  const [accountId, setAccountId] = useState('');
  const [observation, setObservation] = useState('');
  const [amountTransaction, setAmountTransaction] = useState(0);
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const [isLoading, setIsLoading] = useState(true);
  const notificationAlertRef = useRef(null);
  const { id } = useParams();

  const toggleModalTransactions = () => {
    if (modalTransactions === true) {
      setTransactionId('');
      setSelected('Revenue');
      setCategory('');
      setCategoryId('');
      setAccount('');
      setAccountId('');
      setObservation('');
      setAccountId('');
      setAmountTransaction(0);
    }

    setModalTransactions(!modalTransactions);
  };

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
        `${Config.SERVER_ADDRESS}/api/transactions/account/${id}`,
        config
      );
      let totalBalance = 0;
      for (const transact of [
        ...transactionsFromTheAPI.data.transactionsDueToAccount,
        ...transactionsFromTheAPI.data.transactionsDueFromAccount,
      ]) {
        if (transact.type === 'Revenue') {
          totalBalance += transact.ammount;
        } else if (transact.type === 'Expense') {
          totalBalance -= transact.ammount;
        } else {
          typeof transact.dueToAccount === 'string'
            ? (totalBalance -= transact.ammount)
            : (totalBalance += transact.ammount);
        }
      }
      setAmountTransactions(Number(totalBalance.toFixed(2)));

      setInitialTransactions([
        ...transactionsFromTheAPI.data.transactionsDueToAccount,
        ...transactionsFromTheAPI.data.transactionsDueFromAccount,
      ]);
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
        if (id === ':id') {
          setAmount(accountFromTheAPI.data.account.initialAmmount);
        } else {
          const newObjTransaction = {};
          newObjTransaction['_id'] = 'initialEvent';
          newObjTransaction['type'] = 'Initial Amount';
          newObjTransaction['category'] = {
            _id: 'Initial Category',
            name: 'Initial Deposit',
            icon: { Number: 1273 },
          };
          newObjTransaction['observation'] = 'Initial deposit made';
          newObjTransaction['ammount'] =
            accountFromTheAPI.data.account.initialAmmount;
          setTransactions([newObjTransaction, ...initialTransactions]);
          setAmount(
            amountTransactions + accountFromTheAPI.data.account.initialAmmount
          );
        }
        if (accountFromTheAPI.data['hasLoaded'] && icon !== '') {
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
  const type = {
    Revenue: 'plus',
    Expense: 'minus',
    Transfer: 'transfer',
    'Initial Amount': 'start',
  };
  const typeColor = {
    Revenue: '#1a821a',
    Expense: '#ce2033',
    Transfer: '#0084D9',
    'Initial Amount': '#F0E68C',
  };

  const handleDelete = async (transactId) => {
    const config = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${login.token}`,
    };

    await axios
      .delete(`${Config.SERVER_ADDRESS}/api/transactions/${transactId}`, {
        headers: config,
        data: {
          dueToAccount: id,
          dueFromAccount: transactions.find(
            (transact) => transact._id === transactId
          ).dueFromAccount?._id,
          type: transactions.find((transact) => transact._id === transactId)
            .type,
          ammount: transactions.find((transact) => transact._id === transactId)
            .ammount,
        },
      })
      .then((res) => {
        success();
        notify('You have successfully deleted the transaction');
        setTransactions(
          transactions.filter((trans) => trans._id !== res.data._id)
        );

        if (res.data.type === 'Revenue') {
          setAmount(Number((amount - res.data.ammount).toFixed(2)));
        } else if (res.data.type === 'Expense') {
          setAmount(Number((amount + res.data.ammount).toFixed(2)));
        } else {
          setAmount(Number((amount + res.data.ammount).toFixed(2)));
        }
        getAccounts();
      })
      .catch((error) => {
        console.error(error);
        notify(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          'danger'
        );
        toggleModalTransactions();
      });
  };
  const hideAlert = () => {
    setAlert(null);
  };
  const success = (type = 'archive') => {
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
        Your transaction was deleted...
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
        onConfirm={() => {
          handleDelete(id);
        }}
        onCancel={() => cancel()}
        confirmBtnBsStyle='success'
        cancelBtnBsStyle='danger'
        confirmBtnText='Yes, delete!'
        cancelBtnText='Cancel'
        showCancel
        btnSize=''
      >
        You will not be able to restore the data for your transaction again
      </ReactBSAlert>
    );
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
              formerAmount={formerAmount}
              setFormerAmount={setFormerAmount}
              toggleModalTransactions={toggleModalTransactions}
              selected={selected}
              setSelected={setSelected}
              modalTransactions={modalTransactions}
              token={login.token}
              currency={currency}
              id={id}
              transactions={transactions}
              setTransactions={setTransactions}
              category={category}
              setCategory={setCategory}
              categoryId={categoryId}
              setCategoryId={setCategoryId}
              account={account}
              setAccount={setAccount}
              accountId={accountId}
              setAccountId={setAccountId}
              observation={observation}
              setObservation={setObservation}
              amount={amountTransaction}
              setAmount={setAmountTransaction}
              setAccountAmount={setAmount}
              accountAmount={amount}
              transactionId={transactionId}
            />
            <ModalIconPicker
              modalIcons={modalIcons}
              setModalIcons={setModalIcons}
              setIcon={setIcon}
              setIconId={setIconId}
            />
            <Modal>
              <ModalHeader></ModalHeader>
              <ModalBody></ModalBody>
              <ModalFooter></ModalFooter>
            </Modal>
            {alert}
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
                      <Label>
                        {id === ':id' ? 'Initial amount' : 'Balance'}
                      </Label>
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
                    <div
                      className='table-responsive'
                      style={{ overflowX: 'auto', overflowY: 'hidden' }}
                    >
                      <Table>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'center' }}>Type</th>
                            <th style={{ textAlign: 'center' }}>Category</th>
                            <th>Name</th>
                            <th>Observation</th>
                            <th>Amount</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((trans) => (
                            <tr id={trans._id} key={trans._id}>
                              <td style={{ textAlign: 'center' }}>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    fontSize: '45px',
                                    lineHeight: '45px',
                                    color: typeColor[trans.type],
                                  }}
                                >
                                  {
                                    <i
                                      className={`icomoon-${type[trans.type]}`}
                                    />
                                  }
                                </span>
                                <br />
                                {trans.type === 'Transfer'
                                  ? typeof trans.dueToAccount === 'string'
                                    ? 'Outgoing transfer'
                                    : 'Incoming transfer'
                                  : trans.type}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <span
                                  style={{
                                    color: 'var(--primary)',
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
                                    {trans.type !== 'Transfer' ? (
                                      <i
                                        className={`icomoon-${trans?.category?.icon?.Number}`}
                                      />
                                    ) : typeof trans.dueToAccount ===
                                      'string' ? (
                                      <i
                                        className={`icomoon-${trans.dueFromAccount.icon.Number}`}
                                      />
                                    ) : (
                                      <i
                                        className={`icomoon-${trans.dueToAccount.icon.Number}`}
                                      />
                                    )}
                                  </div>
                                </span>
                              </td>
                              <td>
                                {trans.type !== 'Transfer'
                                  ? trans.category.name
                                  : typeof trans.dueToAccount === 'string'
                                  ? trans.dueFromAccount.name
                                  : trans.dueToAccount.name}
                              </td>
                              <td>{trans.observation}</td>
                              <td>{currencyFormat(trans.ammount, currency)}</td>
                              <td>
                                {trans.type !== 'Initial Amount' ? (
                                  <>
                                    <MyTooltip
                                      placement='top'
                                      target={`Tooltip-${trans._id}`}
                                    >
                                      Editar
                                    </MyTooltip>
                                    <Button
                                      id={`Tooltip-${trans._id}`}
                                      color='warning'
                                      size='sm'
                                      className={'btn-icon btn-link like'}
                                      style={{ cursor: 'default' }}
                                    >
                                      <i
                                        onClick={(e) => {
                                          const filtered = transactions.find(
                                            (account) =>
                                              account._id ===
                                              e.target.parentElement
                                                .parentElement.parentElement.id
                                          );
                                          console.log(filtered);
                                          setSelected(filtered.type);
                                          setAmountTransaction(
                                            filtered.ammount
                                          );
                                          setTransactionId(filtered._id);
                                          setCategory(filtered.category.name);
                                          setCategoryId(filtered.category._id);
                                          setObservation(filtered.observation);
                                          setAccountId(
                                            filtered?.dueFromAccount?._id
                                          );
                                          setAccount(
                                            filtered.dueFromAccount?.name
                                          );
                                          setFormerAmount(filtered.ammount);
                                          // setId(filtered._id);
                                          // setCurrency(filtered.currency);
                                          // setIcon(filtered.icon.Number);
                                          // setName(filtered.name);
                                          // setAmount(filtered.initialAmmount);
                                          toggleModalTransactions();
                                        }}
                                        className='tim-icons icon-pencil'
                                        style={{ cursor: 'pointer' }}
                                      />
                                    </Button>
                                    <MyTooltip
                                      placement='top'
                                      target={`Delete-${trans._id}`}
                                    >
                                      Excluir
                                    </MyTooltip>
                                    <Button
                                      id={`Delete-${trans._id}`}
                                      size='sm'
                                      className={'btn-icon btn-link'}
                                      color='danger'
                                      style={{
                                        backgroundColor: 'transparent',
                                        outline: 'none',
                                        borderColor: 'transparent',
                                        cursor: 'default',
                                      }}
                                    >
                                      <i
                                        id={trans._id}
                                        style={{
                                          // display: 'inline-block !important',
                                          cursor: 'pointer',
                                        }}
                                        className='tim-icons icon-trash-simple classVisible'
                                        onClick={(e) => {
                                          e.preventDefault();
                                          warningWithConfirmAndCancelMessage(
                                            e.target.id
                                          );
                                          // warningWithConfirmAndCancelMessage(
                                          //   e.target.id,
                                          //   'delete'
                                          // );
                                        }}
                                      ></i>
                                    </Button>
                                  </>
                                ) : null}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
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

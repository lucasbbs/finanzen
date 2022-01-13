import axios from 'axios';
import { reverseFormatNumber } from 'helpers/functions';
import { useContext, useEffect, useRef, useState } from 'react';
import NumberFormat from 'react-number-format';
import {
  Button,
  ButtonGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { currencies } from 'views/pages/currencies';
import NotificationAlert from 'react-notification-alert';
import { GlobalContext } from 'context/GlobalState';

const ModalTransactions = ({
  selected,
  setSelected,
  modalTransactions,
  toggleModalTransactions,
  token,
  currency,
  id,
  setTransactions,
  transactions,
  category,
  setCategory,
  categoryId,
  setCategoryId,
  account,
  setAccount,
  accountId,
  setAccountId,
  observation,
  setObservation,
  amount,
  setAmount,
  setAccountAmount,
  accountAmount,
  transactionId,
  formerAmount,
  setFormerAmount,
  date,
  setDate,
  oldAmount,
  isEditing,
  setIsEditing,
  exchangeRate2,
  setExchangeRate2,
}) => {
  const { getAccounts } = useContext(GlobalContext);
  const [accountExchange, setAccountExchange] = useState({});
  const [exchangeRate, setExchangeRate] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesToBeDisplayes, setCategoriesToBeDisplayes] = useState([]);

  useEffect(() => {
    setCategoriesToBeDisplayes(
      categories.filter((category) => category.type === selected)
    );
  }, [categories, selected]);

  const address = process.env.REACT_APP_SERVER_ADDRESS;
  useEffect(() => {
    const getCategoriesAndAccounts = async () => {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const categoriesFromTheAPI = await axios.get(
        `${address}/api/categories`,
        config
      );
      setCategories(
        categoriesFromTheAPI.data.filter(
          (category) => category.name !== 'Investimento'
        )
      );
      const accountsFromTheAPI = await axios.get(
        `${address}/api/accounts`,
        config
      );
      setAccounts(accountsFromTheAPI.data.accounts);
    };

    getCategoriesAndAccounts();
  }, [token]);

  useEffect(() => {
    setExchangeRate(exchangeRate2);
    setAccountExchange(accounts.find((account) => account._id === accountId));
  }, [exchangeRate2]);

  useEffect(() => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const getExchanges = async () => {
      const response = await axios.post(
        `${address}/api/exchanges`,
        { currencies: [currency], localCurrency: accountExchange?.currency },
        config
      );
      console.log(response);
      if (response.status === 200) {
        setExchangeRate(
          response.data[`${currency}_${accountExchange?.currency}`]
        );
      } else {
        setExchangeRate(1.5);
      }
    };
    getExchanges();
  }, [accountExchange]);

  const closeBtn = (
    <button color='danger' className='close' onClick={toggleModalTransactions}>
      <span style={{ color: 'white' }}>×</span>
    </button>
  );

  const handleAddTransaction = async (objTransaction) => {
    console.log(objTransaction);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    if (transactionId === '') {
      await axios
        .post(`${address}/api/transactions`, objTransaction, config)
        .then((res) => {
          notify('You have successfully registered a new transaction');

          if (res.data.type === 'Transfer') {
            const objDueFromAccount = accounts.find(
              (account) => account._id === res.data.dueFromAccount
            );
            res.data['dueFromAccount'] = objDueFromAccount;
          } else {
            const objCategory = categories.find(
              (cat) => cat._id === categoryId
            );

            res.data['category'] = objCategory;
          }
          setTransactions(
            [...transactions, res.data].sort(
              (a, b) => new Date(a.date) - new Date(b.date)
            )
          );
          toggleModalTransactions();

          if (res.data.type === 'Revenue') {
            setAccountAmount(accountAmount + res.data.ammount);
          } else if (res.data.type === 'Expense') {
            setAccountAmount(accountAmount - res.data.ammount);
          } else {
            setAccountAmount(accountAmount - res.data.ammount);
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
    } else {
      await axios
        .put(
          `${address}/api/transactions/${transactionId}`,
          objTransaction,
          config
        )
        .then((res) => {
          notify('You have successfully updated the transaction');

          if (res.data.type === 'Transfer') {
            const objDueFromAccount = accounts.find(
              (account) => account._id === res.data.dueFromAccount
            );
            res.data['dueFromAccount'] = objDueFromAccount;
          } else {
            const objCategory = categories.find(
              (cat) => cat._id === categoryId
            );

            res.data['category'] = objCategory;
          }
          transactions.splice(
            transactions.findIndex((trans) => trans._id === res.data._id),
            1,
            res.data
          );
          setTransactions(
            transactions.sort((a, b) => new Date(a.date) - new Date(b.date))
          );
          toggleModalTransactions();
          console.log(amount, oldAmount, accountAmount, res.data.ammount);
          if (res.data.type === 'Revenue') {
            setAccountAmount(
              Number((accountAmount + res.data.ammount - oldAmount).toFixed(2))
            );
          } else if (res.data.type === 'Expense') {
            setAccountAmount(
              Number((accountAmount - res.data.ammount + oldAmount).toFixed(2))
            );
          } else {
            setAccountAmount(
              Number((accountAmount - res.data.ammount + oldAmount).toFixed(2))
            );
          }
          setIsEditing(false);
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
  return (
    <>
      <div className='react-notification-alert-container'>
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <Modal modalClassName='modal-black' isOpen={modalTransactions}>
        <ModalHeader close={closeBtn}>
          {isEditing ? 'Update the Transaction' : 'Register a new Transaction'}
        </ModalHeader>
        <ModalBody>
          <ButtonGroup style={{ width: '100%' }}>
            <Button
              color='primary'
              onClick={() => {
                setSelected('Revenue');
                setExchangeRate('');
                setAccount('');
                setAccountId('');
              }}
              active={selected === 'Revenue'}
              disabled={isEditing}
            >
              Revenue
            </Button>
            <Button
              color='primary'
              onClick={() => {
                setSelected('Expense');
                setExchangeRate('');
                setAccount('');
                setAccountId('');
              }}
              active={selected === 'Expense'}
              disabled={isEditing}
            >
              Expense
            </Button>
            <Button
              color='primary'
              onClick={() => {
                setSelected('Transfer');
                setCategory(
                  categories.find((cat) => cat.type === 'Transfer')?.name
                );
                setCategoryId(
                  categories.find((cat) => cat.type === 'Transfer')?._id
                );
              }}
              active={selected === 'Transfer'}
              disabled={isEditing}
            >
              Transfer
            </Button>
          </ButtonGroup>

          {selected === 'Transfer' ? (
            <>
              <Label className='mt-3' htmlFor='destinationAccountId'>
                Destination Account <sup style={{ color: 'red' }}>*</sup>
              </Label>
              <Input
                disabled={isEditing}
                type='select'
                style={{ backgroundColor: '#2b3553' }}
                id='destinationAccountId'
                value={account}
                onChange={(e) => {
                  setAccount(e.target.value);
                  setAccountId(e.target[e.target.selectedIndex].id);
                  setAccountExchange(
                    accounts.find(
                      (account) =>
                        account._id === e.target[e.target.selectedIndex].id
                    )
                  );
                }}
              >
                <option value=''>Select an option</option>
                {accounts
                  .filter((account) => account._id !== id)
                  .map((account) => (
                    <option id={account._id} key={account._id}>
                      {account.name}
                    </option>
                  ))}
              </Input>
            </>
          ) : (
            <>
              <Label className='mt-3' htmlFor='categorySelectorId'>
                Category <sup style={{ color: 'red' }}>*</sup>
              </Label>
              <Input
                required
                id='categorySelectorId'
                style={{ backgroundColor: '#2b3553' }}
                type='select'
                value={category}
                onChange={(e) => {
                  setAccount('');
                  setAccountId('');
                  setCategory(e.target.value);
                  setCategoryId(e.target[e.target.selectedIndex].id);
                }}
              >
                <option value=''>Select an option</option>
                {categoriesToBeDisplayes.map((cat) => (
                  <option id={cat._id} key={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </Input>
            </>
          )}
          <Label className='mt-3' htmlFor='observationId'>
            Observation
          </Label>
          <Input
            type='textarea'
            style={{ backgroundColor: '#2b3553' }}
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            name='text'
            id='observationId'
          />
          <Label className='mt-3' htmlFor='valueTransactionId'>
            Value <sup style={{ color: 'red' }}>*</sup>
          </Label>
          <NumberFormat
            required
            id='valueTransactionId'
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
            }0`}
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

          <Label className='mt-3' htmlFor='dateTransactionId'>
            Date of transaction
          </Label>
          <Input
            type='date'
            id='dateTransactionId'
            style={{ backgroundColor: '#2b3553' }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          ></Input>
          <div style={{ display: selected === 'Transfer' ? 'block' : 'none' }}>
            <Label htmlFor='exchangeRateId'>Exchange Rate</Label>

            <NumberFormat
              required
              id='valueTransactionId'
              style={{ backgroundColor: '#2b3553' }}
              onChange={(e) => {
                setExchangeRate(reverseFormatNumber(e.target.value));
              }}
              type='text'
              value={exchangeRate}
              placeholder={`${
                (currencies[accountExchange?.currency]?.symbol_native
                  ? currencies[accountExchange.currency]?.symbol_native
                  : '') + ' '
              }0`}
              thousandSeparator={'.'}
              decimalSeparator={','}
              prefix={
                (currencies[accountExchange?.currency]?.symbol_native
                  ? currencies[accountExchange.currency]?.symbol_native
                  : '') + ' '
              }
              customInput={Input}
              isAllowed={(values) => {
                const { formattedValue, floatValue } = values;
                return formattedValue === '' || floatValue >= 0;
              }}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color='success'
            onClick={() =>
              handleAddTransaction({
                type: selected,
                dueToAccount: id,
                dueFromAccount: accountId ? accountId : undefined,
                category: categoryId,
                ammount: amount,
                formerAmount: formerAmount,
                observation,
                exchangeRate,
                date,
              })
            }
            style={{ margin: '0 20px 20px' }}
          >
            Save
          </Button>
          <Button
            color='secondary'
            onClick={toggleModalTransactions}
            style={{ margin: '0 20px 20px' }}
          >
            Back
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ModalTransactions;

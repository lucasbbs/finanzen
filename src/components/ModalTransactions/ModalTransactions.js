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
import Config from '../../config.json';
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
}) => {
  const {
    // accounts: accountsFromContext,
    // updateAccounts,
    getAccounts,
  } = useContext(GlobalContext);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesToBeDisplayes, setCategoriesToBeDisplayes] = useState([]);
  useEffect(() => {
    setCategoriesToBeDisplayes(
      categories.filter((category) => category.type === selected)
    );
  }, [categories, selected]);

  useEffect(() => {
    const getCategoriesAndAccounts = async () => {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const categoriesFromTheAPI = await axios.get(
        `${Config.SERVER_ADDRESS}/api/categories`,
        config
      );
      setCategories(categoriesFromTheAPI.data);
      const accountsFromTheAPI = await axios.get(
        `${Config.SERVER_ADDRESS}/api/accounts`,
        config
      );
      setAccounts(accountsFromTheAPI.data.accounts);
    };

    getCategoriesAndAccounts();
  }, [token]);
  const closeBtn = (
    <button color='danger' className='close' onClick={toggleModalTransactions}>
      <span style={{ color: 'white' }}>×</span>
    </button>
  );
  const handleAddTransaction = async (objTransaction) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    if (transactionId === '') {
      await axios
        .post(
          `${Config.SERVER_ADDRESS}/api/transactions`,
          objTransaction,
          config
        )
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
          setTransactions([...transactions, res.data]);
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
          `${Config.SERVER_ADDRESS}/api/transactions/${transactionId}`,
          objTransaction,
          config
        )
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
          transactions.splice(
            transactions.findIndex((trans) => trans._id === res.data._id),
            1,
            res.data
          );
          setTransactions(transactions);
          toggleModalTransactions();
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
        <ModalHeader close={closeBtn}>Register a new Transaction</ModalHeader>
        <ModalBody>
          <ButtonGroup>
            <Button
              color='primary'
              onClick={() => setSelected('Revenue')}
              active={selected === 'Revenue'}
            >
              Revenue
            </Button>
            <Button
              color='primary'
              onClick={() => setSelected('Expense')}
              active={selected === 'Expense'}
            >
              Expense
            </Button>
            <Button
              color='primary'
              onClick={() => {
                setSelected('Transfer');
                setCategory(
                  categories.find((cat) => cat.type === 'Transfer').name
                );
                setCategoryId(
                  categories.find((cat) => cat.type === 'Transfer')._id
                );
              }}
              active={selected === 'Transfer'}
            >
              Transfer
            </Button>
          </ButtonGroup>

          {selected === 'Transfer' ? (
            <>
              <Label className='mt-3' htmlFor='destinationAccountId'>
                Destination Account
              </Label>
              <Input
                type='select'
                style={{ backgroundColor: '#2b3553' }}
                id='destinationAccountId'
                value={account}
                onChange={(e) => {
                  setAccount(e.target.value);
                  setAccountId(e.target[e.target.selectedIndex].id);
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
                Category
              </Label>
              <Input
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
          <Label className='mt-3' htmlFor='exampleText'>
            Observation
          </Label>
          <Input
            type='textarea'
            style={{ backgroundColor: '#2b3553' }}
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            name='text'
            id='exampleText'
          />
          <Label className='mt-3' htmlFor='valueTransactionId'>
            Value
          </Label>
          <NumberFormat
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

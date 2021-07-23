import axios from 'axios';
import { id } from 'date-fns/locale';
import { reverseFormatNumber } from 'helpers/functions';
import { useEffect, useRef, useState } from 'react';
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
}) => {
  const [categoryId, setCategoryId] = useState('');
  const [observation, setObservation] = useState('');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoriesToBeDisplayes, setCategoriesToBeDisplayes] = useState([]);
  useEffect(() => {
    setCategoriesToBeDisplayes(
      categories.filter((category) => category.type === selected)
    );
  }, [categories, selected]);

  useEffect(() => {
    const getCategories = async () => {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const categoriesFromTheAPI = await axios.get(
        `${Config.SERVER_ADDRESS}/api/categories`,
        config
      );
      setCategories(categoriesFromTheAPI.data);
    };

    getCategories();
  }, [token]);
  const closeBtn = (
    <button color='danger' className='close' onClick={toggleModalTransactions}>
      <span style={{ color: 'white' }}>×</span>
    </button>
  );
  const handleAddTransaction = async (objTransaction) => {
    console.log(objTransaction);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios
      .post(`${Config.SERVER_ADDRESS}/api/transactions`, objTransaction, config)
      .then((res) => {
        notify('You have successfully registered a new transaction');
        const objCategory = categories.find((cat) => cat._id === categoryId);

        res.data['category'] = objCategory;
        setTransactions([...transactions, res.data]);
        toggleModalTransactions();
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
          </ButtonGroup>

          <Input
            className='mt-3'
            style={{ backgroundColor: '#2b3553' }}
            type='select'
            value={category}
            onChange={(e) => {
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
          <Label className='mt-3' htmlFor='exampleText'>
            Value
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
        </ModalBody>
        <ModalFooter>
          <Button
            color='success'
            onClick={() =>
              handleAddTransaction({
                type: selected,
                dueToAccount: id,
                category: categoryId,
                ammount: amount,
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

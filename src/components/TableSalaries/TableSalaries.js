import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
} from 'reactstrap';
import RowSalary from './RowSalary';
import NumberFormat from 'react-number-format';
import { reverseFormatNumber } from 'helpers/functions';
import { currencies } from 'views/pages/currencies';

const TableSalaries = ({ handleCurrentMoney, handleTransactions }) => {
  const [id, setId] = useState('');
  const [salaries, setSalaries] = useState([]);
  const [modal, setModal] = useState(false);
  const [salary, setSalary] = useState(null);
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );

  const address = process.env.REACT_APP_SERVER_ADDRESS;
  useEffect(() => {
    const asyncSalaries = async () => {
      const config = { headers: { Authorization: `Bearer ${login.token}` } };
      const res = await axios.get(`${address}/api/salary`, config);
      setSalaries(res.data);
    };
    asyncSalaries();
  }, [login]);

  const setUpdatedSalaries = (removeSalary, id) => {
    const filtered = salaries.filter(
      (salary) => salary._id !== removeSalary._id
    );
    setTimeout(async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${login.token}`,
        },
      };
      await axios
        .put(
          `${address}/api/salary/${id}`,
          { salary: removeSalary.salary },
          config
        )
        .then(async ({ data }) => {
          // console.log(data);
          setSalaries(filtered);
          handleCurrentMoney(removeSalary.salary);
          handleTransactions(data);
        });
    }, 800);
  };
  const toggleModal = () => {
    setModal(!modal);
  };

  const setSalaryFromRow = (value) => {
    setId(value._id);
    setSalary(value.salary);
  };

  const handleEditSalary = () => {
    const salaryToBeUpdated = salaries.find((salary) => salary._id === id);
    salaryToBeUpdated['salary'] = salary;
    const filteredSalaries = salaries.filter((salary) => salary._id !== id);
    setSalaries([salaryToBeUpdated, ...filteredSalaries]);
    toggleModal();
  };
  return (
    <>
      <Modal
        isOpen={modal}
        toggle={toggleModal}
        size='sm'
        modalClassName='modal-black'
      >
        <ModalHeader className='justify-content-center' toggle={toggleModal}>
          Edit your monthly salary
        </ModalHeader>
        <ModalBody>
          <NumberFormat
            className='borderColor'
            id='IncomeValue'
            value={salary}
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              background: '#2b3553',
            }}
            type='text'
            placeholder={`${currencies[login.currency]?.symbol_native}0`}
            thousandSeparator={'.'}
            decimalSeparator={','}
            prefix={`${currencies[login.currency]?.symbol_native}`}
            customInput={Input}
            onChange={(e) => {
              // if (isEdit) {
              //   setDateEl(document.querySelector('#IncomeDate').value);
              // }
              setSalary(reverseFormatNumber(e.target.value));
            }}
          />
          <div className='row align-items-center justify-content-center'>
            <Button
              color='success'
              className='mt-3'
              onClick={(e) => handleEditSalary()}
            >
              Submit
            </Button>
          </div>
        </ModalBody>
      </Modal>
      <Table>
        <tbody>
          {salaries.map((salary) => (
            <RowSalary
              key={salary._id}
              salary={salary}
              currency={login.currency}
              setUpdatedSalaries={setUpdatedSalaries}
              toggleModal={toggleModal}
              setSalaryFromRow={setSalaryFromRow}
              setId={setId}
            />
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default TableSalaries;

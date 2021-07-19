import axios from 'axios';
import { addDays, format, parse } from 'date-fns';

import React, { useEffect, useRef, useState } from 'react';
import NumberFormat from 'react-number-format';
import { Link } from 'react-router-dom';
import NotificationAlert from 'react-notification-alert';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
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
import { currencyFormat, reverseFormatNumber } from '../../helpers/functions';
import { ptBR } from 'date-fns/locale';
import { currencies } from '../../views/pages/currencies';
import Config from '../../config.json';

const Incomes = ({
  incomes,
  numberPerPage,
  setNumberPerPage,
  setNewIncomes,
  incomesToBeUpdated,
  setAccruedIncome,
  id,
  setIsLoading,
  currency,
}) => {
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
  const [tax, setTax] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [checkbox, setCheckbox] = useState(true);
  const [formerValue, setFormerValue] = useState(0);
  const [valueIncome, setValueIncome] = useState(0);
  const [dateIncome, setDateIncome] = useState('');
  const [modal, setModal] = useState(false);
  const [modalAddIncome, setModalAddIncome] = useState(false);
  const [modalAddFunds, setModalAddFunds] = useState(false);
  // eslint-disable-next-line

  const [isValid, setIsValid] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [updatedIncome, setUpdatedIncome] = useState(incomesToBeUpdated);
  const [isAdding, setIsAdding] = useState(false);
  const [dateEl, setDateEl] = useState(format(new Date(), 'yyyy-MM'));
  const [valueEl, setValueEl] = useState('0');
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const [incomesPerPage, setIncomesPerPage] = useState(numberPerPage);

  function countChars(char, string) {
    return string
      .split('')
      .reduce((acc, ch) => (ch === char ? acc + 1 : acc), 0);
  }
  useEffect(() => {
    if (isAdding) {
      setIsAdding(false);
      let incomeObject = {};
      incomeObject[
        dateEl.length === 7
          ? format(parse(dateEl, 'yyyy-MM', new Date()), 'yyyy-MM-dd')
          : `${format(parse(dateEl, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd')}`
      ] = reverseFormatNumber(valueEl);

      var index = updatedIncome
        .map((key) => Object.keys(key)[0])
        .indexOf(Object.keys(incomeObject)[0]);

      handleAddIncome({ incomes: updatedIncome }, dateEl, valueEl, index);
    }
    // eslint-disable-next-line
  }, [updatedIncome]);

  const toggle = () => {
    setModal(!modal);
    setIsValid(true);
  };
  const toggleAddIncome = (e, value = undefined) => {
    if (value === 'voltar') {
      setIsEdit(false);
      setDateIncome('');
      setValueIncome(0.0);
      setTax(0);
      setTaxRate(0);
    }
    setModalAddIncome(!modalAddIncome);
  };
  const toggleAddFunds = (e, value = undefined) => {
    if (value === 'voltar') {
      setIsEdit(false);
      setDateIncome('');
      setValueIncome(0.0);
    }
    setModalAddFunds(!modalAddFunds);
  };
  const fun = (e, defaultValue = undefined) => {
    let inputEl = undefined;

    if (defaultValue === undefined) {
      inputEl = document.querySelector('#ModalInputId').value;
    } else {
      inputEl = defaultValue;
    }
    if (inputEl < 0 || inputEl > 15) {
      setIsValid(false);
    } else {
      setIsValid(true);
      setNumberPerPage(inputEl);
      if (defaultValue === undefined) {
        toggle();
      }
    }
  };

  const handleIncome = () => {
    setIsLoading(true);
    if (isEdit) {
      console.log('hello world');
      setDateEl(document.querySelector('#IncomeDate').value);
      setDateIncome('');
      setValueIncome(0.0);
    }

    let incomeObject = {};
    incomeObject[
      `${format(parse(dateEl, 'yyyy-MM', new Date()), 'yyyy-MM-dd')}income`
    ] = {
      value: reverseFormatNumber(valueEl),
      tax,
      type: 'income',
    };
    const index = updatedIncome
      .map((key) => Object.keys(key)[0])
      .indexOf(Object.keys(incomeObject)[0]);
    if (index !== -1) {
      updatedIncome.splice(index, 1);

      // const incomesObjects = [
      //   ...updatedIncome.filter(
      //     (income) => Object.values(income)[0].type === 'income'
      //   ),
      //   incomeObject,
      // ].sort((a, b) => Object.keys(a)[0].localeCompare(Object.keys(b)[0]));

      setUpdatedIncome(
        [...updatedIncome, incomeObject].sort((a, b) =>
          Object.keys(a)[0].localeCompare(Object.keys(b)[0])
        )
      );
    } else {
      setUpdatedIncome(
        [...updatedIncome, incomeObject].sort((a, b) =>
          Object.keys(a)[0].localeCompare(Object.keys(b)[0])
        )
      );
    }

    toggleAddIncome(null, true);
  };
  const handleCurrentMoney = async (fundsReturn = 0) => {
    const config = { headers: { Authorization: `Bearer ${login.token}` } };

    if (isEdit) {
      login.fundsToInvest[currency] += fundsReturn - formerValue;
    } else {
      login.fundsToInvest[currency] += fundsReturn;
    }
    await axios
      .put(
        `${Config.SERVER_ADDRESS}/api/users/${login._id}`,
        {
          fundsToInvest: login.fundsToInvest,
        },
        config
      )
      .then((res) => {
        localStorage.setItem('userInfo', JSON.stringify(login));
      });
  };
  const handleDeleteMoney = async (formerValue) => {
    const config = { headers: { Authorization: `Bearer ${login.token}` } };
    login.fundsToInvest[currency] -= formerValue;
    await axios
      .put(
        `${Config.SERVER_ADDRESS}/api/users/${login._id}`,
        {
          fundsToInvest: login.fundsToInvest,
        },
        config
      )
      .then((res) => {
        localStorage.setItem('userInfo', JSON.stringify(login));
      });
  };
  const handleFunds = () => {
    setIsLoading(true);
    if (isEdit) {
      setDateEl(document.querySelector('#FundDate').value);
      setDateIncome('');
      setValueIncome(0.0);
    }

    let fundObject = {};
    fundObject[
      `${format(parse(dateEl, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd')}fund`
    ] = {
      value: -1 * reverseFormatNumber(valueEl),
      type: 'fund',
    };

    const index = updatedIncome
      .map((key) => Object.keys(key)[0])
      .indexOf(Object.keys(fundObject)[0]);

    handleCurrentMoney(reverseFormatNumber(valueEl));
    if (index !== -1) {
      updatedIncome.splice(index, 1);
      try {
      } catch (error) {}
      setUpdatedIncome(
        [...updatedIncome, fundObject].sort((a, b) =>
          Object.keys(a)[0].localeCompare(Object.keys(b)[0])
        )
      );
    } else {
      setUpdatedIncome(
        [...updatedIncome, fundObject].sort((a, b) =>
          Object.keys(a)[0].localeCompare(Object.keys(b)[0])
        )
      );
    }

    toggleAddFunds(null, true);
  };
  const handleAddIncome = async (incomesObj, index) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${login.token}`,
      },
    };
    await axios
      .put(
        `${Config.SERVER_ADDRESS}/api/investments/${id}/incomes`,
        incomesObj,
        config
      )
      .then((response) => {
        setIsLoading(false);
        if (isEdit) {
          setIsEdit(false);
          setDateIncome('');
          setValueIncome(0.0);
          notify(
            `You have successfully updated the income for ${format(
              parse(
                dateEl,
                countChars('-', dateEl) > 1 ? 'yyyy-MM-dd' : 'yyyy-MM',
                new Date()
              ),
              'MMM/yyyy',
              { locale: ptBR }
            )}`
          );
        } else {
          setDateIncome('');
          setValueIncome(0.0);
          notify(
            `You have successfully added the income for ${format(
              parse(
                dateEl,
                countChars('-', dateEl) > 1 ? 'yyyy-MM-dd' : 'yyyy-MM',
                new Date()
              ),
              'MMM/yyyy',
              { locale: ptBR }
            )}`
          );
        }

        if (index === -1) {
          incomes.push([
            format(
              parse(
                dateEl,
                countChars('-', dateEl) > 1 ? 'yyyy-MM-dd' : 'yyyy-MM',
                new Date()
              ),
              'dd/MM/yyyy'
            ),
            reverseFormatNumber(valueEl),
          ]);
        } else {
          incomes[index] = [
            format(
              parse(
                dateEl.replace('income', '').replace('fund', ''),
                countChars('-', dateEl) > 1 ? 'yyyy-MM-dd' : 'yyyy-MM',
                new Date()
              ),
              'dd/MM/yyyy'
            ),
            reverseFormatNumber(valueEl),
          ];
        }

        const dates = updatedIncome
          .filter((invest) => Object.values(invest)[0] !== null)
          .map((key) => Object.keys(key).map((date) => date))
          .flat()
          .map((data) => {
            let datePartes = data.split('-');
            return `${datePartes[2]}/${datePartes[1]}/${datePartes[0]}`;
          });

        const IncomesTemp = updatedIncome
          .filter((invest) => Object.values(invest)[0] !== null)
          .map((key) => Object.values(key)[0]);

        let temparray = [];
        for (let i = 0; i < IncomesTemp.length; i++) {
          temparray.push([dates[i], IncomesTemp[i]]);
        }

        setNewIncomes(temparray);

        setAccruedIncome(
          Number(
            updatedIncome
              .map((key) => Object.values(key)[0])
              .reduce((acc, curr) => acc + curr.value, 0)
              .toFixed(2)
          )
        );
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
        notify(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          'danger'
        );
      });
    if (index === -1) {
    }
  };

  const handleRemoveIncome = async (input, removido, formerValues) => {
    console.log(Object.values(removido[0])[0].value < 0);
    if (Object.values(removido[0])[0].value < 0) {
      console.log('Hello world');
      handleDeleteMoney(formerValues);
    }
    setIsLoading(true);
    let incomesObj = { incomes: input };
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${login.token}`,
      },
    };

    await axios
      .put(
        `${Config.SERVER_ADDRESS}/api/investments/${id}/incomes`,
        incomesObj,
        config
      )
      .then((response) => {
        setIsLoading(false);
        notify(
          `You have successfully deleted the income for the period ${format(
            addDays(
              new Date(
                Object.keys(removido[0])[0]
                  .replace('income', '')
                  .replace('fund', '')
              ),
              1
            ),
            'MMM/yyyy',
            {
              locale: ptBR,
            }
          )}`
        );
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
        notify(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          'danger'
        );
      });
    const dates = updatedIncome
      .filter((invest) => Object.values(invest)[0] !== null)
      .map((key) => Object.keys(key).map((date) => date))
      .flat()
      .map((data) => {
        let datePartes = data.split('-');
        return `${datePartes[2]}/${datePartes[1]}/${datePartes[0]}`;
      });

    const IncomesTemp = updatedIncome
      .filter((invest) => Object.values(invest)[0] !== null)
      .map((key) => Object.values(key)[0]);

    let temparray = [];
    for (let i = 0; i < IncomesTemp.length; i++) {
      temparray.push([dates[i], IncomesTemp[i]]);
    }

    setNewIncomes(temparray);

    setAccruedIncome(
      Number(
        updatedIncome
          .map((key) => Object.values(key)[0])
          .reduce((acc, curr) => acc + curr.value, 0)
          .toFixed(2)
      )
    );
  };

  const closeBtn = (
    <button
      color='danger'
      className='close'
      onClick={() => toggleAddIncome(null, 'voltar')}
    >
      <span style={{ color: 'white' }}>×</span>
    </button>
  );

  const closeBtnForFunds = (
    <button
      color='danger'
      className='close'
      onClick={() => toggleAddFunds(null, 'voltar')}
    >
      <span style={{ color: 'white' }}>×</span>
    </button>
  );
  const closeBtnForIncomesPerPage = (
    <button color='danger' className='close' onClick={toggle}>
      <span style={{ color: 'white' }}>×</span>
    </button>
  );
  return (
    // eslint-disable
    <>
      <div className='react-notification-alert-container'>
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <Modal
        isOpen={modalAddIncome}
        toggle={() => toggleAddIncome(null, 'voltar')}
        keyboard={true}
        modalClassName='modal-black'
      >
        <ModalHeader
          close={closeBtn}
          toggle={() => toggleAddIncome(null, 'voltar')}
        >
          <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {isEdit ? 'Edit income' : 'Add income'}
          </span>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Row className='align-items-center'>
              <Col md='6'>
                <Label htmlFor='IncomeDate' style={{ marginBottom: '0' }}>
                  Income date
                </Label>
              </Col>
              <Col md='6'>
                <Input
                  className='borderColor'
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    background: '#2b3553',
                  }}
                  readOnly={isEdit}
                  id='IncomeDate'
                  type='month'
                  value={dateIncome}
                  onChange={(e) => {
                    setDateIncome(e.target.value);
                    setDateEl(e.target.value);
                  }}
                />
              </Col>
            </Row>
            <Row className='align-items-center' style={{ marginTop: '6px' }}>
              <Col md='6'>
                <Label htmlFor='IncomeValue' style={{ marginBottom: '0' }}>
                  Value
                </Label>
              </Col>
              <Col md='6'>
                <NumberFormat
                  className='borderColor'
                  id='IncomeValue'
                  value={valueIncome}
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    background: '#2b3553',
                  }}
                  type='text'
                  placeholder={`${currencies[currency]?.symbol_native}0,00`}
                  thousandSeparator={'.'}
                  decimalSeparator={','}
                  prefix={`${currencies[currency]?.symbol_native}`}
                  customInput={Input}
                  onChange={(e) => {
                    if (isEdit) {
                      setDateEl(document.querySelector('#IncomeDate').value);
                    }
                    setValueEl(e.target.value);
                    setValueIncome(reverseFormatNumber(e.target.value));
                    setTax(
                      (reverseFormatNumber(e.target.value) * taxRate) / 100
                    );
                  }}
                />
              </Col>
            </Row>
            <Row className='align-items-center' style={{ marginTop: '6px' }}>
              <Col md='2'>
                <Label style={{ marginBottom: '0' }}>Tax</Label>
              </Col>
              <Col md='3'>
                <FormGroup check style={{ marginTop: '0' }}>
                  <Label check>
                    <h6
                      style={{
                        fontSize: '10px',
                        lineHeight: '18px',
                        marginBottom: '0',
                      }}
                    >
                      Tax exempt
                    </h6>
                    <Input
                      id='taxExempt'
                      checked={checkbox}
                      onChange={(e) => {
                        setCheckbox(e.target.checked);
                        if (e.target.checked) {
                          setTaxRate(0);
                          setTax(0);
                        }
                      }}
                      type='checkbox'
                    />
                    <span className='form-check-sign'>
                      <span className='check' />
                    </span>
                  </Label>
                </FormGroup>
              </Col>
              <Col md='3'>
                <NumberFormat
                  value={taxRate}
                  disabled={checkbox}
                  thousandSeparator={'.'}
                  decimalSeparator={','}
                  customInput={Input}
                  onChange={(e) => {
                    setTaxRate(reverseFormatNumber(e.target.value));
                    setTax(
                      (reverseFormatNumber(e.target.value) / 100) * valueIncome
                    );
                  }}
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    background: '#2b3553',
                  }}
                  suffix={' %'}
                />
              </Col>
              <Col md='4'>
                <NumberFormat
                  placeholder={`${currencies[currency]?.symbol_native}0,00`}
                  prefix={`${currencies[currency]?.symbol_native}`}
                  value={tax}
                  onChange={(e) => {
                    setTax(reverseFormatNumber(e.target.value));
                    setTaxRate(
                      Number(
                        (
                          (reverseFormatNumber(e.target.value) / valueIncome) *
                          100
                        ).toFixed(2)
                      )
                    );
                  }}
                  disabled={checkbox}
                  thousandSeparator={'.'}
                  decimalSeparator={','}
                  customInput={Input}
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    background: '#2b3553',
                  }}
                />
              </Col>
            </Row>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color='primary'
            onClick={() => {
              setIsAdding(true);
              handleIncome();
            }}
            style={{ margin: '0 20px 20px' }}
          >
            Define
          </Button>
          <Button
            color='secondary'
            onClick={() => toggleAddIncome(null, 'voltar')}
            style={{ margin: '0 20px 20px' }}
          >
            Back
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={modalAddFunds}
        toggle={() => toggleAddFunds(null, 'voltar')}
        keyboard={true}
        modalClassName='modal-black'
      >
        <ModalHeader
          close={closeBtnForFunds}
          toggle={() => toggleAddFunds(null, 'voltar')}
        >
          <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {isEdit ? 'Edit fund' : 'Add fund'}
          </span>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Row className='align-items-center'>
              <Col md='6'>
                <Label style={{ marginBottom: '0' }}>Fund date</Label>
              </Col>
              <Col md='6'>
                <Input
                  className='borderColor'
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    background: '#2b3553',
                  }}
                  readOnly={isEdit}
                  id='FundDate'
                  type='date'
                  value={dateIncome}
                  onChange={(e) => {
                    setDateIncome(e.target.value);
                    setDateEl(e.target.value);
                  }}
                />
              </Col>
            </Row>
            <Row className='align-items-center' style={{ marginTop: '6px' }}>
              <Col md='6'>
                <Label style={{ marginBottom: '0' }}>Value</Label>
              </Col>
              <Col md='6'>
                <NumberFormat
                  className='borderColor'
                  id='FundValue'
                  value={valueIncome}
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    background: '#2b3553',
                  }}
                  type='text'
                  placeholder={`${currencies[currency]?.symbol_native}0,00`}
                  prefix={`${currencies[currency]?.symbol_native}`}
                  thousandSeparator={'.'}
                  decimalSeparator={','}
                  customInput={Input}
                  onChange={(e) => {
                    if (isEdit) {
                      setDateEl(document.querySelector('#FundDate').value);
                    }
                    setValueIncome(reverseFormatNumber(e.target.value));
                    setValueEl(e.target.value);
                  }}
                />
              </Col>
            </Row>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color='primary'
            onClick={() => {
              setIsAdding(true);
              handleFunds();
            }}
            style={{ margin: '0 20px 20px' }}
          >
            Define
          </Button>
          <Button
            color='secondary'
            onClick={() => toggleAddFunds(null, 'voltar')}
            style={{ margin: '0 20px 20px' }}
          >
            Back
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modal} toggle={toggle} modalClassName='modal-black'>
        <ModalHeader close={closeBtnForIncomesPerPage} toggle={toggle}>
          Set quantity of incomes per page
        </ModalHeader>
        <ModalBody style={{ paddingBottom: '0' }}>
          <FormGroup style={{ marginBottom: '0' }}>
            <Input
              style={{
                backgroundImage:
                  '-webkit-linear-gradient(left, HotPink "50"%,black "50"%)}"',
              }}
              type='range'
              min='1'
              max='15'
              id='ModalInputId'
              step='1'
              value={incomesPerPage}
              className='slider'
              onChange={(e) => setIncomesPerPage(e.target.value)}
              autoComplete='off'
            />

            <h6
              style={{ textAlign: 'center', marginTop: '30px', color: 'white' }}
            >
              {incomesPerPage}
            </h6>
            {/* {isValid ? (
              <Input
                type='number'
                id='ModalInputId'
                style={{ color: 'black' }}
                min={0}
                max={15}
              />
            ) : (
              <>
                <Input
                  style={{ marginBottom: '20px', color: 'black' }}
                  invalid
                  type='number'
                  id='ModalInputId'
                  min={0}
                  max={15}
                />
                <FormFeedback tooltip>
                  Você deve informar um número emtre 0 e 15
                </FormFeedback>
              </>
            )} */}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color='primary'
            onClick={fun}
            style={{ margin: '0 20px 20px' }}
          >
            Define
          </Button>
          <Button
            color='secondary'
            onClick={toggle}
            style={{ margin: '0 20px 20px' }}
          >
            Back
          </Button>
        </ModalFooter>
      </Modal>
      <Card style={{ marginTop: '25px' }}>
        <CardHeader
          stlye={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h4 className='title d-inline'>Incomes</h4>
          <Link to='#' onClick={toggle}>
            <i
              title='Please, set how many incomes should be presented per page'
              className='tim-icons icon-settings-gear-63'
              style={{ float: 'right', marginLeft: '20px', fontSize: '1.5em' }}
            />
          </Link>
          <Link to='#' onClick={toggleAddIncome}>
            {/* <span style={{ float: 'right', fontSize: '1.5em' }}>+</span> */}
            <i
              title='Register a new interest income'
              // className='tim-icons icon-simple-add'
              className='fas fa-plus'
              style={{ float: 'right', marginLeft: '20px', fontSize: '1.5em' }}
            />
          </Link>
          <Link to='#' onClick={toggleAddFunds}>
            {/* <span style={{ float: 'right', fontSize: '1.5em' }}>+</span> */}
            <i
              title='Register a funds Receipt'
              className='fas fa-hand-holding-usd'
              style={{ float: 'right', fontSize: '1.5em' }}
            />
          </Link>
        </CardHeader>
        <CardBody>
          <Table className='tablesorter'>
            <tbody className='text-primary'>
              <tr>
                {incomes.map((data, index) => (
                  <td key={index}>
                    {data[0].replace('income', '').replace('fund', '')}
                  </td>
                ))}
              </tr>

              <tr>
                {incomes.map((key, index) => (
                  <td key={index}>
                    <span
                      tax-value={key[1]?.tax}
                      id={
                        key[1]?.value < 0
                          ? `${key[0]
                              .replace('income', '')
                              .replace('fund', '')}$`
                          : key[0].replace('income', '').replace('fund', '')
                      }
                      className='incomes'
                      onClick={(e) => {
                        setFormerValue(reverseFormatNumber(e.target.innerHTML));

                        if (e.target.offsetWidth + 6 < e.nativeEvent.offsetX) {
                          if (
                            e.pageY - 10 <
                            e.target.getBoundingClientRect().top
                          ) {
                            setIsEdit(true);
                            //prettier-ignore
                            setTax(Number(e.target.getAttribute('tax-value')))
                            setTaxRate(
                              Number(
                                (
                                  (e.target.getAttribute('tax-value') /
                                    reverseFormatNumber(e.target.innerHTML)) *
                                  100
                                ).toFixed(2)
                              )
                            );
                            const date = format(
                              parse(
                                e.target.id,
                                e.target.id.includes('$')
                                  ? 'dd/MM/yyyy$'
                                  : 'dd/MM/yyyy',
                                new Date()
                              ),
                              e.target.innerHTML.includes('-')
                                ? 'yyyy-MM-dd'
                                : 'yyyy-MM'
                            );
                            setDateEl(date);
                            setDateIncome(date);
                            const value = reverseFormatNumber(
                              e.target.innerHTML
                            );
                            setValueEl(value);
                            setValueIncome(value);
                            const newObj = {};
                            //prettier-ignore
                            newObj[`${format(parse( e.target.id, e.target.id.includes('$') ? 'dd/MM/yyyy$' : 'dd/MM/yyyy', new Date()),'yyyy-MM-dd')}${e.target.innerHTML.includes('-')? 'fund':'income'}`
                            ] = {value, type:e.target.innerHTML.includes('-')? 'fund':'income'};
                            // const newarray = updatedIncome;
                            // newarray.splice(
                            //   updatedIncome
                            //     .map((el) => Object.keys(el)[0])
                            //     .indexOf(
                            //       format(
                            //         parse(
                            //           e.target.id,
                            //           e.target.id.includes('$')
                            //             ? 'dd/MM/yyyy$'
                            //             : 'dd/MM/yyyy',
                            //           new Date()
                            //         ),
                            //         'yyyy-MM-dd'
                            //       )
                            //     ),
                            //   1,
                            //   newObj
                            // );
                            if (e.target.innerHTML.includes('-')) {
                              toggleAddFunds();
                            } else {
                              toggleAddIncome();
                            }
                          } else {
                            if (
                              window.confirm(
                                'Você tem certeza de que deseja apagar essa receita?'
                              )
                            ) {
                              // console.log(
                              //   `${
                              //     e.target.innerHTML.includes('-')
                              //       ? 'fund'
                              //       : 'income'
                              //   }${format(
                              //     parse(
                              //       e.target.id,
                              //       e.target.id.includes('$')
                              //         ? 'dd/MM/yyyy$'
                              //         : 'dd/MM/yyyy',
                              //       new Date()
                              //     ),
                              //     'yyyy-MM-dd'
                              //   )}`
                              // );
                              const index = updatedIncome
                                .map((key) => Object.keys(key)[0])
                                .indexOf(
                                  `${format(
                                    parse(
                                      e.target.id,
                                      e.target.id.includes('$')
                                        ? 'dd/MM/yyyy$'
                                        : 'dd/MM/yyyy',
                                      new Date()
                                    ),
                                    'yyyy-MM-dd'
                                  )}${
                                    e.target.innerHTML.includes('-')
                                      ? 'fund'
                                      : 'income'
                                  }`
                                );

                              try {
                                if (index !== -1) {
                                  const removido = updatedIncome.splice(
                                    index,
                                    1
                                  );
                                  handleRemoveIncome(
                                    updatedIncome,
                                    removido,
                                    reverseFormatNumber(e.target.innerHTML)
                                  );
                                } else {
                                  throw new Error('Erro');
                                }
                              } catch (error) {
                                console.error(error);
                                notify(
                                  error.response && error.response.data.message
                                    ? error.response.data.message
                                    : error.message,
                                  'danger'
                                );
                              }
                            }
                          }
                        }
                      }}
                    >
                      {currencyFormat(key[1].value, currency)}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
};

export default Incomes;

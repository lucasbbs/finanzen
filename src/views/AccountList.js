import axios from 'axios';
import ModalIconPicker from 'components/ModalIconPIcker/ModalIconPicker';
import MyTooltip from 'components/Tooltip/MyTooltip';
import { reverseFormatNumber } from 'helpers/functions';
import { currencyFormat } from 'helpers/functions';
import React, { useContext, useEffect, useRef, useState } from 'react';
import NumberFormat from 'react-number-format';
import { Link } from 'react-router-dom';
import NotificationAlert from 'react-notification-alert';
import ReactBSAlert from 'react-bootstrap-sweetalert';

import {
  Button,
  Card,
  CardHeader,
  CardTitle,
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
import Spinner from 'components/Spinner/Spinner';
import { GlobalContext } from 'context/GlobalState';

const AccountList = () => {
  const { updateAccounts } = useContext(GlobalContext);
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState('');
  const [iconId, setIconId] = useState('');
  const [modal, setModal] = useState(false);
  const [modalIcons, setModalIcons] = useState(false);
  const [alert, setAlert] = useState(null);
  const [icon, setIcon] = useState(0);
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [accounts, setAccounts] = useState([]);

  const hideAlert = () => {
    setAlert(null);
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
          ? 'Your account was archived...'
          : 'Your account was deleted...'}
      </ReactBSAlert>
    );
  };
  const cancel = () => {
    setAlert(
      <ReactBSAlert
        danger
        style={{
          display: 'block',
          marginTop: '-100px',
        }}
        title='Cancelled'
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnText='Ok'
        confirmBtnBsStyle='success'
        btnSize=''
      ></ReactBSAlert>
    );
  };
  const address = process.env.REACT_APP_SERVER_ADDRESS;
  const handleArchive = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${login.token}`,
      },
    };
    // console.log(`Bearer ${login.token}`);
    await axios
      .put(`${address}/api/accounts/${id}/archive`, null, config)
      .then(async (response) => {
        success();
        notify(`You have successfully archived your account ${name}`);
        setAccounts(accounts.filter((account) => account._id !== id));
        updateAccounts();

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
        // updateAccounts(login.fundsToInvest);
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
  };
  const handleDelete = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${login.token}`,
      },
    };
    // console.log(`Bearer ${login.token}`);
    const answer = await axios
      .delete(`${address}/api/accounts/${id}`, config)
      .then(async (response) => {
        success('delete');
        notify(`Account deleted successfully`);
        setAccounts(accounts.filter((account) => account._id !== id));
        updateAccounts();
        //------------STUFF RELATED TO THE CURRENT AMOUNT OF MONEY---------------//

        // await axios
        //   .put(
        //     `${address}/api/users/${login._id}`,
        //     { fundsToInvest: login.fundsToInvest },
        //     config
        //   )
        // .then((res) => {
        // console.log(response.data.invest.broker.currency);
        // login.fundsToInvest[response.data.invest.broker.currency] =
        //   login.fundsToInvest[response.data.invest.broker.currency] || 0;
        // login.fundsToInvest[response.data.invest.broker.currency] +=
        //   response.data.invest.accrued_income +
        //   response.data.invest.initial_amount;
        // localStorage.setItem('userInfo', JSON.stringify(login));
        // });
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
  const notificationAlertRef = useRef(null);
  const notify = (message, type = 'success', place = 'tc') => {
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div> {message} </div>
        </div>
      ),
      type: type,
      icon: 'tim-icons icon-bell-55',
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };
  const toggle = () => setModal(!modal);
  const toggleModalIcons = () => setModalIcons(!modalIcons);
  const closeBtn = (
    <button color='danger' className='close' onClick={toggle}>
      <span
        style={{
          color: 'white',
        }}
      >
        ×
      </span>
    </button>
  );
  useEffect(() => {
    const getAccounts = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${login.token}`,
        },
      };

      const accountsFromApi = await axios.get(
        `${address}/api/accounts`,
        config
      );
      setAccounts(accountsFromApi.data.accounts);
      setIsLoading(false);
    };
    if (accounts.length === 0) {
      getAccounts();
    }
  }, [login.token]);
  const handleUpdate = async (objAccount, id) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${login.token}`,
      },
    };
    await axios
      .put(`${address}/api/accounts/${id}`, objAccount, config)
      .then((res) => {
        if (
          currency !== accounts.find((account) => account._id === id).currency
        ) {
          login.currency = currency;
          localStorage.setItem('userInfo', JSON.stringify(login));
        }
        objAccount['_id'] = id;
        objAccount['initialAmount'] = amount;
        objAccount['currency'] = currency;
        objAccount['balance'] = accounts.find(
          (account) => account._id === id
        ).balance;

        const objIcon = {};
        objIcon['_id'] = iconId;
        objIcon['Number'] = icon;
        objAccount['icon'] = objIcon;
        accounts.splice(
          accounts.findIndex((account) => account._id === id),
          1,
          objAccount
        );
        toggle();

        setAccounts([...accounts]);
        notify('You have successfully updated your account');
        updateAccounts();
      })
      .catch((error) => {
        // setIsLoading(false);
        notify(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          'danger'
        );
        toggle();
      });
    hideAlert();
  };

  const warningWithConfirmAndCancelMessage = (id, type = 'archive') => {
    setAlert(
      <ReactBSAlert
        warning
        style={{
          display: 'block',
          marginTop: '-100px',
        }}
        title='Are you sure?'
        onConfirm={() => {
          if (type === 'archive') {
            handleArchive(id);
          } else if (type === 'edit') {
            handleUpdate(
              {
                name,
                currency,
                icon: iconId,
                initialAmmount: amount,
              },
              id
            );
          } else {
            handleDelete(id);
          }
        }}
        onCancel={() => cancel()}
        confirmBtnBsStyle='success'
        cancelBtnBsStyle='danger'
        confirmBtnText={
          type === 'archive'
            ? 'Yes, archive!'
            : type === 'edit'
            ? 'Yes, proceed!'
            : 'Yes, delete!'
        }
        cancelBtnText='Cancel'
        showCancel
        btnSize=''
      >
        {type === 'archive'
          ? 'Do you want to archive this account?'
          : type === 'edit'
          ? 'Editing your default currency account will cause your default currency to be changed'
          : 'You will not be able to restore the data for your account again'}
        {/* <FormGroup check>
                  <Label check>
                    <Input
                      name='optionCheckboxes'
                      type='checkbox'
                      // checked={hasRegisteredInvest}
                      // onChange={(e) => setHasRegisteredInvest(e.target.checked)}
                    />
                    <span className='form-check-sign' />
                    Have loaded all previous investments
                  </Label>
                </FormGroup> */}
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
            <ModalIconPicker
              modalIcons={modalIcons}
              setModalIcons={setModalIcons}
              setIcon={setIcon}
              setIconId={setIconId}
            />
            <Modal
              modalClassName='modal-black'
              style={{
                background:
                  'linear-gradient(180deg,#222a42 0,#1d253b)!important',
              }}
              isOpen={modal}
              toggle={toggle}
              // className='modal-sm'
            >
              <ModalHeader
                style={{
                  color: 'hsla(0,0%,100%,.8)',
                }}
                toggle={toggle}
                close={closeBtn}
              >
                <span
                  style={{
                    color: 'hsla(0,0%,100%,.9)',
                  }}
                >
                  Edit Account
                </span>
              </ModalHeader>
              <ModalBody
                style={{
                  background:
                    'linear-gradient(180deg,#222a42 0,#1d253b)!important',
                }}
              >
                <Row
                  style={{
                    marginBottom: '10px',
                  }}
                >
                  <Col md='4'>
                    <Label htmlFor='iconPickerId'>
                      Icon
                      <sup style={{ color: 'red', fontWeight: 900 }}>*</sup>
                    </Label>
                    <Button
                      id='iconPickerId'
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
                      <span
                        style={{
                          fontSize: '45px',
                        }}
                      >
                        <i className={`icomoon-${icon}`} />
                      </span>
                    </Button>
                  </Col>
                  <Col md='8'>
                    <Label htmlFor='nameID'>
                      Name
                      <sup style={{ color: 'red', fontWeight: 900 }}>*</sup>
                    </Label>
                    <Input
                      id='nameID'
                      required
                      style={{
                        backgroundColor: '#2b3553',
                      }}
                      type='text'
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                  </Col>
                  <Col
                    md='6'
                    style={{
                      paddingRight: '0',
                    }}
                  >
                    <Label htmlFor='currencyID'>
                      Currency
                      <sup style={{ color: 'red', fontWeight: 900 }}>*</sup>
                    </Label>
                    <Input
                      disabled
                      id='currencyID'
                      style={{
                        backgroundColor: '#2b3553',
                      }}
                      type='select'
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value='' disabled={true}>
                        Select an option
                      </option>
                      {Object.values(currencies).map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.name}
                        </option>
                      ))}
                    </Input>
                  </Col>
                  <Col
                    md='6'
                    style={{
                      paddingRight: '0',
                    }}
                  >
                    <Label htmlFor='initialAmountID'>
                      Initial amount
                      <sup style={{ color: 'red', fontWeight: 900 }}>*</sup>
                    </Label>
                    <NumberFormat
                      style={{
                        backgroundColor: '#2b3553',
                      }}
                      onChange={(e) => {
                        // setHasChanged(true);
                        setAmount(reverseFormatNumber(e.target.value));
                      }}
                      id='initialAmountID'
                      type='text'
                      value={amount}
                      placeholder={`${currencies[currency]?.symbol_native}0`}
                      thousandSeparator={'.'}
                      decimalSeparator={','}
                      customInput={Input}
                      prefix={currencies[currency]?.symbol_native}
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
                    if (
                      accounts.find((account) => account._id === id)
                        .currency === currency
                    ) {
                      handleUpdate(
                        {
                          name,
                          currency,
                          icon: iconId,
                          initialAmmount: amount,
                        },
                        id
                      );
                    } else {
                      warningWithConfirmAndCancelMessage(id, 'edit');
                    }
                  }}
                >
                  Save
                </Button>
                <Button color='secondary' onClick={toggle}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
            {alert}
            <Card>
              <CardHeader className='row justify-content-between ml-2 mt-1 mr-2 align-items-center'>
                <CardTitle className='m-0' tag='h1'>
                  <i className='icomoon-480'> </i> Accounts
                </CardTitle>
                <Link to='/admin/account/:id'>
                  <Button> New Account </Button>
                </Link>
              </CardHeader>
              <Table
                className='tablesorter'
                // responsive
                style={{
                  overflowX: 'auto',
                  position: 'relative',
                }}
              >
                <thead className='text-primary'>
                  <tr>
                    <th
                      style={{
                        textAlign: 'center',
                      }}
                    >
                      Icon
                    </th>
                    <th
                      style={{
                        textAlign: 'center',
                      }}
                    >
                      Name
                    </th>
                    <th
                      style={{
                        textAlign: 'center',
                      }}
                    >
                      Currency
                    </th>
                    <th
                      style={{
                        textAlign: 'center',
                      }}
                    >
                      Current Amount
                    </th>
                    <th
                      style={{
                        textAlign: 'center',
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr id={account._id} key={account._id}>
                      <td
                        style={{
                          textAlign: 'center',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '35px',
                          }}
                        >
                          <i className={`icomoon-${account.icon.Number}`}> </i>
                        </span>
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                        }}
                      >
                        <Link to={`/admin/account/${account._id}`}>
                          {account.name}
                        </Link>
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                        }}
                      >
                        {account.currency}
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                        }}
                      >
                        {currencyFormat(
                          account.initialAmmount + account.balance,
                          account.currency
                        )}
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                        }}
                      >
                        <MyTooltip
                          placement='top'
                          target={`archive-${account._id}`}
                        >
                          Arquivar
                        </MyTooltip>
                        <Button
                          style={{
                            cursor: 'default',
                          }}
                          id={`archive-${account._id}`}
                          color='info'
                          size='sm'
                          className={'btn-icon btn-link like'}
                        >
                          <i
                            style={{
                              cursor: 'pointer',
                            }}
                            id={account._id}
                            className='fas fa-archive'
                            onClick={(e) => {
                              warningWithConfirmAndCancelMessage(e.target.id);
                            }}
                          ></i>
                        </Button>
                        <MyTooltip
                          placement='top'
                          target={`Tooltip-${account._id}`}
                        >
                          Editar
                        </MyTooltip>
                        <Button
                          id={`Tooltip-${account._id}`}
                          color='warning'
                          size='sm'
                          className={'btn-icon btn-link like'}
                          style={{
                            cursor: 'default',
                          }}
                        >
                          <i
                            onClick={(e) => {
                              const filtered = accounts.find(
                                (account) =>
                                  account._id ===
                                  e.target.parentElement.parentElement
                                    .parentElement.id
                              );
                              setId(filtered._id);
                              setCurrency(filtered.currency);
                              setIcon(filtered.icon.Number);
                              setName(filtered.name);
                              setAmount(
                                reverseFormatNumber(filtered.initialAmmount)
                              );

                              toggle();
                            }}
                            className='tim-icons icon-pencil'
                            style={{
                              cursor: 'pointer',
                            }}
                          />
                        </Button>
                        <MyTooltip
                          placement='top'
                          target={`Delete-${account._id}`}
                        >
                          Excluir
                        </MyTooltip>
                        <Button
                          id={`Delete-${account._id}`}
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
                            id={account._id}
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
            </Card>
          </>
        )}
      </div>
    </>
  );
};

export default AccountList;

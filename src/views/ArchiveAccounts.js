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
import Spinner from '../components/Spinner/Spinner';
import { currencyFormat, reverseFormatNumber } from '../helpers/functions';
import axios from 'axios';
import NotificationAlert from 'react-notification-alert';
import Config from '../config.json';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import NumberFormat from 'react-number-format';
import MyTooltip from 'components/Tooltip/MyTooltip';
import { GlobalContext } from 'context/GlobalState';
import { currencies } from './pages/currencies';
import ModalIconPicker from 'components/ModalIconPIcker/ModalIconPicker';

/*eslint-disable*/
const ArchiveAccounts = () => {
  const { updateAccounts } = useContext(GlobalContext);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const [isLoading, setIsLoading] = useState(true);

  const [iconId, setIconId] = useState('');
  const [modal, setModal] = useState(false);
  const [modalIcons, setModalIcons] = useState(false);
  const [alert, setAlert] = useState(null);
  const [icon, setIcon] = useState(0);
  const [currency, setCurrency] = useState('');
  const [amount, setAmount] = useState(0);
  // const [initialAmount, setInitialAmount] = useState(0);
  // const [hasChanged, setHasChanged] = useState(false);

  const [accounts, setAccounts] = useState([]);

  const handleUpdate = async (objAccount, id) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${login.token}`,
      },
    };
    await axios
      .put(`${Config.SERVER_ADDRESS}/api/accounts/${id}`, objAccount, config)
      .then(({ data }) => {
        console.log(data);
        objAccount['_id'] = id;
        objAccount['balance'] = data.balance;
        const objIcon = {};
        objIcon['_id'] = iconId;
        objIcon['Number'] = icon;
        objAccount['icon'] = objIcon;
        console.log(objAccount);
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
        onConfirm={() => {
          if (type === 'archive') {
            handleUnarchive(id);
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
          ? 'Do you want to restore the data for this account?'
          : 'You will not be able to restore the data for your investment again'}
      </ReactBSAlert>
    );
  };
  useEffect(() => {
    const getAccounts = async () => {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${login.token}`,
        },
      };

      let { data } = await axios.get(
        `${Config.SERVER_ADDRESS}/api/accounts/archive/`,
        config
      );

      setAccounts(data.accounts);
      if (data.hasLoaded) {
        setIsLoading(false);
      }
    };
    getAccounts();
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
    console.log(`Bearer ${login.token}`);
    await axios
      .delete(`${Config.SERVER_ADDRESS}/api/accounts/${id}`, config)
      .then((response) => {
        success('delete');
        notify(`Account deleted successfully`);
        setAccounts(accounts.filter((invest) => invest._id !== id));
        updateAccounts();
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
  const hideAlert = () => {
    setAlert(null);
  };

  const toggle = () => setModal(!modal);
  const toggleModalIcons = () => setModalIcons(!modalIcons);
  const closeBtn = (
    <button color='danger' className='close' onClick={toggle}>
      <span style={{ color: 'white' }}>×</span>
    </button>
  );
  const handleUnarchive = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${login.token}`,
      },
    };
    await axios
      .put(
        `${Config.SERVER_ADDRESS}/api/accounts/${id}/unarchive`,
        null,
        config
      )
      .then(async (response) => {
        success();
        notify(`You have successfully unarchived your account`);
        setAccounts(accounts.filter((invest) => invest._id !== id));
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
                style={{ color: 'hsla(0,0%,100%,.8)' }}
                toggle={toggle}
                close={closeBtn}
              >
                <span style={{ color: 'hsla(0,0%,100%,.9)' }}>
                  Edit Account
                </span>
              </ModalHeader>
              <ModalBody
                style={{
                  background:
                    'linear-gradient(180deg,#222a42 0,#1d253b)!important',
                }}
              >
                <Row style={{ marginBottom: '10px' }}>
                  <Col md='4'>
                    <Label htmlFor='iconId'>
                      Icon <sup style={{ color: 'red' }}>*</sup>
                    </Label>
                    <Button
                      id='iconId'
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
                  <Col md='8'>
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
                  </Col>
                  <Col md='6' style={{ paddingRight: '0' }}>
                    <Label htmlFor='currencyID'>
                      Currency <sup style={{ color: 'red' }}>*</sup>
                    </Label>
                    <Input
                      id='currencyID'
                      style={{ backgroundColor: '#2b3553' }}
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

                  <Col md='6' style={{ paddingRight: '0' }}>
                    <Label htmlFor='initialAmountID'>Initial amount</Label>
                    <NumberFormat
                      style={{ backgroundColor: '#2b3553' }}
                      onChange={(e) => {
                        // setHasChanged(true);
                        setAmount(reverseFormatNumber(e.target.value));
                      }}
                      id='initialAmountID'
                      type='text'
                      value={amount}
                      placeholder={`${currencies[currency]?.symbol_native}0,00`}
                      thousandSeparator={'.'}
                      decimalSeparator={','}
                      prefix={currencies[currency]?.symbol_native}
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
                    handleUpdate(
                      {
                        name,
                        currency,
                        icon: iconId,
                        initialAmmount: amount,
                      },
                      id
                    );
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
            {alert}
            <Row>
              <Col md='12'>
                <Card style={{ position: 'relative' }}>
                  <CardHeader className='row justify-content-between ml-2 mt-1 mr-2 align-items-center'>
                    <CardTitle className='m-0' tag='h1'>
                      <i className='icomoon-484'></i> Archive Accounts
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Table
                      className='tablesorter'
                      // responsive
                      style={{ overflowX: 'auto', position: 'relative' }}
                    >
                      <thead className='text-primary'>
                        <tr>
                          <th style={{ textAlign: 'center' }}>Icon</th>
                          <th style={{ textAlign: 'center' }}>Name</th>
                          <th style={{ textAlign: 'center' }}>Currency</th>
                          <th style={{ textAlign: 'center' }}>
                            Current Amount
                          </th>
                          <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accounts.map((account) => (
                          <tr id={account._id} key={account._id}>
                            <td style={{ textAlign: 'center' }}>
                              <span style={{ fontSize: '35px' }}>
                                <i
                                  className={`icomoon-${account.icon.Number}`}
                                ></i>
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <Link to={`/admin/account/${account._id}`}>
                                {account.name}
                              </Link>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {account.currency}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {currencyFormat(
                                account.initialAmmount + account.balance,
                                account.currency
                              )}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <MyTooltip
                                placement='top'
                                target={`unarchive-${account._id}`}
                              >
                                Unarchive
                              </MyTooltip>
                              <Button
                                style={{ cursor: 'default' }}
                                id={`unarchive-${account._id}`}
                                color='info'
                                size='sm'
                                className={classNames('btn-icon btn-link like')}
                              >
                                <i
                                  style={{ cursor: 'pointer' }}
                                  id={account._id}
                                  className='tim-icons icon-upload'
                                  onClick={(e) => {
                                    // if (account.broker) {
                                    warningWithConfirmAndCancelMessage(
                                      e.target.id
                                    );
                                    // } else {
                                    //   notify(
                                    //     'In order to unarchive an investment you should set a broker name for the investment',
                                    //     'danger'
                                    //   );
                                    // }
                                  }}
                                ></i>
                              </Button>
                              <MyTooltip
                                placement='top'
                                target={`Tooltip-${account._id}`}
                              >
                                Edit
                              </MyTooltip>
                              <Button
                                id={`Tooltip-${account._id}`}
                                color='warning'
                                size='sm'
                                className={classNames('btn-icon btn-link like')}
                                style={{ cursor: 'default' }}
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
                                    setAmount(filtered.initialAmmount);
                                    toggle();
                                  }}
                                  className='tim-icons icon-pencil'
                                  style={{ cursor: 'pointer' }}
                                />
                              </Button>
                              <MyTooltip
                                placement='top'
                                target={`Delete-${account._id}`}
                              >
                                Delete
                              </MyTooltip>
                              <Button
                                id={`Delete-${account._id}`}
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

export default ArchiveAccounts;

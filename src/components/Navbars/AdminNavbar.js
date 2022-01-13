/*!

=========================================================
* Black Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { useState, useEffect, useContext, useRef } from 'react';
import moment from 'moment';
// nodejs library that concatenates classes
import classNames from 'classnames';
import Avatar from 'react-avatar';
// reactstrap components
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  InputGroup,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Modal,
  UncontrolledTooltip,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Col,
  Row,
} from 'reactstrap';
import { logout } from 'services/auth';
import { Link, useHistory } from 'react-router-dom';
import { currencyFormat } from '../../helpers/functions';
import { fetchAllInvestments } from '../../services/Investments';
import MyTooltip from 'components/Tooltip/MyTooltip';
import { GlobalContext } from 'context/GlobalState';
import axios from 'axios';
import NotificationAlert from 'react-notification-alert';

const AdminNavbar = (props) => {
  const { accounts, getAccounts } = useContext(GlobalContext);
  useEffect(() => {
    getAccounts();
  }, []);
  console.log(accounts);
  const [name] = useState(JSON.parse(localStorage.getItem('userInfo')).name);
  const [currencies, setCurrencies] = useState([]);
  const [filter, setFilter] = useState('');
  const [investments, setInvestments] = useState([]);
  const [investmentsFiltered, setInvestmentsFiltered] = useState([]);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState(false);
  const [modalNotifications, setModalNotifications] = useState(false);
  const [modalInvestments, setmodalInvestments] = useState(false);
  const [color, setColor] = useState('navbar-transparent');
  const [hasRunned, setHasRunned] = useState(false);
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const [notifications, setNotifications] = useState([]);
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const address = process.env.REACT_APP_SERVER_ADDRESS;
  useEffect(() => {
    const getNotifications = async () => {
      const config = { headers: { Authorization: `Bearer ${login.token}` } };
      const { data } = await axios.get(`${address}/api/notifications/`, config);

      setNotifications(data);
    };
    getNotifications();
  }, []);
  const handleAsyncFunction = async () => {
    const investments = await fetchAllInvestments('', login);
    setInvestments(investments);
  };
  if (!hasRunned) {
    handleAsyncFunction();
    setHasRunned(true);
  }

  const updateColor = () => {
    if (window.innerWidth < 993 && collapseOpen) {
      setColor('bg-white');
    } else {
      setColor('navbar-transparent');
    }
  };
  useEffect(() => {
    const filteredInvestments =
      filter.trim() === ''
        ? [...investments]
        : investments
            .map((invest) => {
              if (invest.broker === null) {
                console.log(invest.broker);
                invest.broker = { name: 'unavailable' };
              }
              return invest;
            })
            .filter(
              (invest) =>
                invest.name.toLowerCase().includes(filter.toLowerCase()) ||
                invest.broker.name
                  .toLowerCase()
                  .includes(filter.toLowerCase()) ||
                invest.type.toLowerCase().includes(filter.toLowerCase()) ||
                invest.rate.toLowerCase().includes(filter.toLowerCase()) ||
                invest.indexer.toLowerCase().includes(filter.toLowerCase()) ||
                invest.investment_date
                  .toLowerCase()
                  .includes(filter.toLowerCase()) ||
                invest.due_date.toLowerCase().includes(filter.toLowerCase())
            );
    setInvestmentsFiltered(filteredInvestments);
    const currency = [
      ...new Set(
        filteredInvestments.map((investment) => investment.broker.currency)
      ),
    ];
    setCurrencies(currency);
    window.addEventListener('resize', updateColor);
    return function cleanup() {
      window.removeEventListener('resize', updateColor);
    }; // eslint-disable-next-line
  }, [filter]);

  // function that adds color white/transparent to the navbar on resize (this is for the collapse)

  // this function opens and closes the collapse on small devices
  const toggleCollapse = () => {
    if (collapseOpen) {
      setColor('navbar-transparent');
    } else {
      setColor('bg-white');
    }
    setCollapseOpen(!collapseOpen);
  };
  const toggleModalSearch = () => {
    setModalSearch(!modalSearch);
  };
  const toggleModalNotifications = async (isRead, id) => {
    setModalNotifications(!modalNotifications);
    if (!modalNotifications && !isRead) {
      const config = { headers: { Authorization: `Bearer ${login.token}` } };
      await axios.put(
        `${address}/api/notifications/${id}`,
        { read: true },
        config
      );
      let notReadNotifications = [...notifications];
      const index = notReadNotifications.findIndex((not) => not._id === id);
      const obj = notReadNotifications[index];
      obj.read = true;
      notReadNotifications.splice(index, 1, obj);

      setNotifications(notReadNotifications);
    }
    if (modalNotifications) {
      setId('');
      setTitle('');
      setMessage('');
    }
  };
  const toggleModalInvestments = () => {
    setmodalInvestments(!modalInvestments);
  };

  const history = useHistory();

  const closeBtn = (fn) => {
    return (
      <button className='close' onClick={() => fn()}>
        <span style={{ color: 'white' }}>×</span>
      </button>
    );
  };

  const handleDeleteNotification = async (id, attr = true) => {
    const config = { headers: { Authorization: `Bearer ${login.token}` } };
    try {
      await axios.delete(`${address}/api/notifications/${id}`, config);
      setNotifications(notifications.filter((not) => not._id !== id));
      notify('You have successfully deleted your notification');

      if (attr) {
        toggleModalNotifications();
      }
    } catch (error) {
      console.log(error);
      notify(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
        'danger'
      );
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

  const truncate = (input) =>
    input.length > 40 ? `${input.substring(0, 40)}...` : input;
  return (
    <>
      <div className='react-notification-alert-container'>
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <Modal
        isOpen={modalInvestments}
        modalClassName='modal-long modal-black '
        toggle={toggleModalInvestments}
        size='lg'
        style={{ maxWidth: '1600px', width: '80%' }}
      >
        <ModalHeader
          toggle={toggleModalInvestments}
          close={closeBtn(toggleModalInvestments)}
        >
          Investments
        </ModalHeader>
        <ModalBody className='px-0'>
          <Table>
            <thead>
              <tr>
                <th
                  style={{
                    maxWidth: '200px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    display: 'inline-block',
                    textOverflow: 'ellipsis',
                    minWidth: '30px',
                  }}
                >
                  Name
                </th>
                <th>Broker</th>
                <th>Type</th>
                <th>Rate</th>
                <th>Investment date</th>
                <th>Due date</th>
                <th>Initial amount</th>
                <th
                  style={{
                    maxWidth: '200px',
                    overflow: 'hidden',
                    display: 'inline-block',
                    textOverflow: 'ellipsis',
                    minWidth: '80px',
                    textAlign: 'center',
                  }}
                >
                  Accrued income
                </th>
              </tr>
            </thead>
            <tbody>
              {investmentsFiltered.map((invest) => (
                <tr key={invest._id}>
                  <td>
                    <Link
                      to={`/admin/investment/${invest._id}`}
                      onClick={toggleModalInvestments}
                    >
                      <span
                        id={`Tooltip-${invest._id}`}
                        style={{
                          height: '20px',
                          maxWidth: '200px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          display: 'inline-block',
                          textOverflow: 'ellipsis',
                          minWidth: '30px',
                        }}
                      >
                        {invest.name}
                        <MyTooltip
                          placement='left'
                          target={`Tooltip-${invest._id}`}
                        >
                          {invest.name}
                          <br />
                        </MyTooltip>
                      </span>
                    </Link>
                  </td>
                  <td>{invest.broker.name}</td>
                  <td>{invest.type}</td>
                  <td>{invest.rate}</td>
                  <td>{moment(invest.investment_date).format('DD/MM/YYYY')}</td>
                  <td>{moment(invest.due_date).format('DD/MM/YYYY')}</td>
                  <td>
                    {currencyFormat(
                      invest.initial_amount,
                      invest.broker.currency
                    )}
                  </td>
                  <td>
                    <div
                      style={{
                        height: '20px',
                        maxWidth: '180px',
                        overflow: 'hidden',
                        display: 'inline-block',
                        textOverflow: 'ellipsis',
                        minWidth: '80px',
                        textAlign: 'right',
                      }}
                    >
                      <span>
                        {currencyFormat(
                          invest.accrued_income,
                          invest.broker.currency
                        )}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              {currencies.map((currency) => (
                <tr key={currency}>
                  <td>Total</td>
                  <td>{currency}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    {currencyFormat(
                      investmentsFiltered
                        .filter((inv) => inv.broker.currency === currency)
                        .reduce((acum, curr) => acum + curr.initial_amount, 0),
                      currency
                    )}
                  </td>
                  <td>
                    <div
                      style={{
                        height: '20px',
                        maxWidth: '180px',
                        overflow: 'hidden',
                        display: 'inline-block',
                        textOverflow: 'ellipsis',
                        minWidth: '80px',
                        textAlign: 'right',
                      }}
                    >
                      <span>
                        {currencyFormat(
                          investmentsFiltered
                            .filter((inv) => inv.broker.currency === currency)
                            .reduce(
                              (acum, curr) => acum + curr.accrued_income,
                              0
                            ),
                          currency
                        )}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tfoot>
          </Table>
        </ModalBody>
        {/* <ModalFooter>
          <Button color='primary' onClick={toggleModalInvestments}>
            Do Something
          </Button>
          <Button color='secondary' onClick={toggleModalInvestments}>
            Cancel
          </Button>
        </ModalFooter> */}
      </Modal>

      <Navbar
        className={classNames('navbar-absolute', {
          [color]: props.location.pathname.indexOf('full-screen-map') === -1,
        })}
        expand='lg'
      >
        <Container fluid>
          <div className='navbar-wrapper'>
            <div className='navbar-minimize d-inline'>
              <Button
                className='minimize-sidebar btn-just-icon'
                color='link'
                id='tooltip209599'
                onClick={props.handleMiniClick}
              >
                <i className='tim-icons icon-align-center visible-on-sidebar-regular' />
                <i className='tim-icons icon-bullet-list-67 visible-on-sidebar-mini' />
              </Button>
              <UncontrolledTooltip
                delay={0}
                target='tooltip209599'
                placement='right'
              >
                Sidebar toggle
              </UncontrolledTooltip>
            </div>
            <div
              className={classNames('navbar-toggle d-inline', {
                toggled: props.sidebarOpened,
              })}
            >
              <button
                className='navbar-toggler'
                type='button'
                onClick={props.toggleSidebar}
              >
                <span className='navbar-toggler-bar bar1' />
                <span className='navbar-toggler-bar bar2' />
                <span className='navbar-toggler-bar bar3' />
              </button>
            </div>

            <div
              className='navbar-brand'
              style={{ fontSize: '200%', whiteSpace: 'nowrap' }}
            >
              <Link rel='noopener noreferrer' to='/admin/dashboard'>
                {props.brandText}
              </Link>
            </div>
          </div>
          <div className='account-class'>
            {accounts && Object.keys(accounts).length !== 0
              ? accounts.map((fund) => (
                  <div
                    style={{ marginBottom: '5px' }}
                    id={fund._id}
                    key={fund._id}
                  >
                    <Link
                      to={`/admin/account/${fund._id}`}
                      rel='noopener noreferrer'
                    >
                      <span style={{ marginBottom: 0 }}>{fund.name}</span>
                      <br />
                    </Link>
                    <span>
                      {currencyFormat(
                        fund.initialAmmount +
                          fund.dueToAccount.reduce(
                            (acc, curr) =>
                              curr.type === 'Expense' ||
                              curr.type === 'Transfer'
                                ? acc - curr.ammount
                                : acc + curr.ammount,
                            0
                          ) +
                          fund.dueFromAccount.reduce(
                            (acc, curr) =>
                              curr.exchangeRate
                                ? acc + curr.ammount * curr.exchangeRate
                                : acc + curr.ammount,
                            0
                          ),
                        fund.currency
                      )}
                    </span>
                  </div>
                ))
              : null}
          </div>
          <button
            className='navbar-toggler'
            type='button'
            data-toggle='collapse'
            data-target='#navigation'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={toggleCollapse}
          >
            <span className='navbar-toggler-bar navbar-kebab' />
            <span className='navbar-toggler-bar navbar-kebab' />
            <span className='navbar-toggler-bar navbar-kebab' />
          </button>
          <Collapse navbar isOpen={collapseOpen}>
            <Nav className='ml-auto' navbar>
              <InputGroup className='search-bar' tag='li'>
                <Button
                  color='link'
                  data-target='#searchModal'
                  data-toggle='modal'
                  id='search-button'
                  onClick={toggleModalSearch}
                >
                  <i className='tim-icons icon-zoom-split' />
                  <span className='d-lg-none d-md-block'>Search</span>
                </Button>
              </InputGroup>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color='default'
                  data-toggle='dropdown'
                  nav
                  disabled={notifications.length === 0}
                >
                  <div
                    style={{
                      height: '19px',
                      width: '19px',
                      lineHeight: '18px',
                      top: '0px',
                      right: '8px',
                      backgroundColor: 'red',
                    }}
                    className='notification d-none d-lg-block d-md-block'
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        verticalAlign: 'middle',
                      }}
                    >
                      {notifications.filter((not) => !not.read).length <= 99
                        ? notifications.filter((not) => !not.read).length
                        : '+99'}
                    </span>
                  </div>
                  <i className='tim-icons icon-bell-55'></i>
                  <p className='d-lg-none'>Notifications</p>
                </DropdownToggle>
                <DropdownMenu className='dropdown-navbar' right tag='ul'>
                  <Col>
                    {notifications.map((notification) => (
                      <NavLink
                        tag='li'
                        style={{
                          backgroundColor: notification.read
                            ? '#ddd'
                            : 'transparent',
                          color: notification.read
                            ? '#333 !important'
                            : 'inherit',
                        }}
                        className='row'
                        key={notification._id}
                      >
                        <Col style={{ flexWrap: 'nowrap' }} className='row'>
                          <Col sm='11'>
                            <DropdownItem
                              style={{ color: 'inherit' }}
                              onClick={(e) => {
                                const selectedNotification = notifications.find(
                                  (not) =>
                                    not._id === e.target.getAttribute('data')
                                );
                                setId(selectedNotification._id);
                                setTitle(selectedNotification.title);
                                setMessage(selectedNotification.message);
                                toggleModalNotifications(
                                  selectedNotification.read,
                                  selectedNotification._id
                                );
                              }}
                              className='nav-item'
                              data={notification._id}
                            >
                              {notification.title}
                            </DropdownItem>
                          </Col>
                          <Col sm='1'>
                            <NavLink>
                              <Button
                                data={notification._id}
                                onClick={(e) => {
                                  handleDeleteNotification(
                                    e.target.getAttribute('data'),
                                    false
                                  );
                                }}
                                className='btn-close-button btn-link nav-item'
                              >
                                &times;
                              </Button>
                            </NavLink>
                          </Col>
                        </Col>
                      </NavLink>
                    ))}
                  </Col>
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color='default'
                  data-toggle='dropdown'
                  nav
                  onClick={(e) => e.preventDefault()}
                >
                  <div className='photo'>
                    <Avatar
                      name={`${name.split(' ').slice(0, 1).join(' ')} ${
                        name.split(' ').slice(-1).join(' ') ===
                        name.split(' ').slice(0, 1).join(' ')
                          ? ''
                          : name.split(' ').slice(-1).join(' ')
                      }`}
                      src={login.thumbnail}
                      textSizeRatio={0}
                      size='31px'
                    />
                  </div>
                  <b className='caret d-none d-lg-block d-xl-block' />
                  <p className='d-lg-none'>Log out</p>
                </DropdownToggle>
                <DropdownMenu className='dropdown-navbar' right tag='ul'>
                  <Link to='/admin/user-profile'>
                    <NavLink tag='li'>
                      <DropdownItem className='nav-item'>Profile</DropdownItem>
                    </NavLink>
                  </Link>
                  <DropdownItem divider tag='li' />
                  <NavLink
                    tag='li'
                    onClick={(e) => {
                      logout();
                      history.push('/auth/login');
                    }}
                  >
                    <DropdownItem className='nav-item'>Log out</DropdownItem>
                  </NavLink>
                </DropdownMenu>
              </UncontrolledDropdown>
              <li className='separator d-lg-none' />
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
      <Modal
        isOpen={modalNotifications}
        modalClassName='modal-black'
        autoFocus={false}
        toggle={toggleModalNotifications}
      >
        <ModalHeader close={closeBtn(toggleModalNotifications)}>
          Notification
        </ModalHeader>
        <ModalBody>
          <span>{title}</span>
          <p>{message}</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => handleDeleteNotification(id)} color='danger'>
            Dismiss
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        modalClassName='modal-search modal-black'
        isOpen={modalSearch}
        toggle={toggleModalSearch}
        autoFocus={false}
      >
        <div className='modal-header'>
          <Input
            autoFocus={true}
            id='inlineFormInputGroup'
            placeholder='SEARCH'
            type='text'
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                toggleModalSearch();
                toggleModalInvestments();
              }
              return e.key === 'Enter' ? setFilter(e.target.value) : null;
            }}
          />
          <button
            aria-label='Close'
            className='close'
            data-dismiss='modal'
            type='button'
            onClick={toggleModalSearch}
          >
            <i className='tim-icons icon-simple-remove' />
          </button>
        </div>
      </Modal>
    </>
  );
};

export default AdminNavbar;

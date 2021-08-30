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
import React, { useState, useEffect, useContext } from 'react';
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
  ModalBody,
  ModalHeader,
  Table,
} from 'reactstrap';
import { logout } from 'services/auth';
import { Link, useHistory } from 'react-router-dom';
import { currencyFormat } from '../../helpers/functions';
import { fetchAllInvestments } from '../../services/Investments';
import MyTooltip from 'components/Tooltip/MyTooltip';
import { GlobalContext } from 'context/GlobalState';
const AdminNavbar = (props) => {
  const { accounts, getAccounts } = useContext(GlobalContext);
  useEffect(() => {
    // console.log('Hello from the navbar');
    getAccounts();
  }, []);
  const [name] = useState(JSON.parse(localStorage.getItem('userInfo')).name);
  // const getName = (input) => {
  //   return input.split(' ').slice(0, -1).join(' ');
  // };
  // const [fundsToInvest, setFundsToInvest] = useState(
  //   localStorage.getItem('userInfo')
  //     ? JSON.parse(localStorage.getItem('userInfo')).fundsToInvest
  //     : null
  // );
  const [currencies, setCurrencies] = useState([]);
  const [filter, setFilter] = useState('');
  const [investments, setInvestments] = useState([]);
  const [investmentsFiltered, setInvestmentsFiltered] = useState([]);
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [modalSearch, setModalSearch] = React.useState(false);
  const [modalInvestments, setmodalInvestments] = useState(false);
  const [color, setColor] = React.useState('navbar-transparent');
  const [hasRunned, setHasRunned] = useState(false);
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );

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
  // this function is to open the Search modal
  const toggleModalSearch = () => {
    setModalSearch(!modalSearch);
  };
  const toggleModalInvestments = () => {
    setmodalInvestments(!modalInvestments);
  };

  const history = useHistory();

  return (
    <>
      <Modal
        isOpen={modalInvestments}
        modalClassName='modal-long modal-black '
        toggle={toggleModalInvestments}
        size='lg'
      >
        <ModalHeader toggle={toggleModalInvestments}>Investments</ModalHeader>
        <ModalBody className='px-0'>
          <Table>
            <thead>
              <tr>
                <th
                  style={{
                    maxWidth: '100px',
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
                    maxWidth: '180px',
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
                          maxWidth: '110px',
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
                      <span> {currencyFormat(invest.accrued_income)}</span>
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
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <span style={{ marginBottom: 0 }}>{fund.name}</span>
                      <br />
                    </Link>
                    <span>
                      {currencyFormat(
                        fund.initialAmmount + fund.balance,
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
                >
                  <div className='notification d-none d-lg-block d-xl-block' />
                  <i className='tim-icons icon-sound-wave' />
                  <p className='d-lg-none'>Notifications</p>
                </DropdownToggle>
                <DropdownMenu className='dropdown-navbar' right tag='ul'>
                  <NavLink tag='li'>
                    <DropdownItem className='nav-item'>
                      Mike John responded to your email
                    </DropdownItem>
                  </NavLink>
                  <NavLink tag='li'>
                    <DropdownItem className='nav-item'>
                      You have 5 more tasks
                    </DropdownItem>
                  </NavLink>
                  <NavLink tag='li'>
                    <DropdownItem className='nav-item'>
                      Your friend Michael is in town
                    </DropdownItem>
                  </NavLink>
                  <NavLink tag='li'>
                    <DropdownItem className='nav-item'>
                      Another notification
                    </DropdownItem>
                  </NavLink>
                  <NavLink tag='li'>
                    <DropdownItem className='nav-item'>
                      Another one
                    </DropdownItem>
                  </NavLink>
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

                  {/* <NavLink tag='li'>
                    <DropdownItem className='nav-item'>Settings</DropdownItem>
                  </NavLink> */}
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
        modalClassName='modal-search modal-black'
        isOpen={modalSearch}
        toggle={toggleModalSearch}
      >
        <div className='modal-header'>
          <Input
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

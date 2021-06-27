import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useEffect, useRef, useState } from 'react';
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
import moment from 'moment';
import Spinner from '../components/Spinner/Spinner';
import { fetchInvestments } from '../services/Investments';
import { reverseFormatNumber } from '../helpers/functions';
import axios from 'axios';
import NotificationAlert from 'react-notification-alert';
import Config from '../config.json';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import NumberFormat from 'react-number-format';
import MyTooltip from 'components/Tooltip/MyTooltip';

/*eslint-disable*/
const InvestmentsList = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [broker, setBroker] = useState('');
  const [type, setType] = useState('');
  const [rate, setRate] = useState('');
  const [indexer, setIndexer] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [investmentDate, setInvestmentDate] = useState('');
  const [initialAmount, setInitialAmount] = useState(0);
  const [accruedIncome, setAccruedIncome] = useState(0);
  const [hasChanged, setHasChanged] = useState(false);
  const [brokers, setBrokers] = useState([]);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [investment, setInvestment] = useState([]);
  const [modal, setModal] = useState(false);
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );

  const handleUpdate = async (investmentObj, id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${login.token}`,
      },
    };
    if (hasChanged) {
      investmentObj['initial_amount'] = reverseFormatNumber(initialAmount);
      setHasChanged(false);
    }
    await axios
      .put(
        `${Config.SERVER_ADDRESS}/api/investments/${id}`,
        investmentObj,
        config
      )
      .then((response) => {
        // successDelete();
        toggle();
        notify(`Investimento alterado com Sucesso`);
        investmentObj['broker'] = brokers.find(
          (brk) => brk._id === investmentObj['broker']
        );
        console.log(
          brokers,
          brokers.find((broker) => broker._id === id)
        );
        if (!investmentObj['initial_amount']) {
          investmentObj['initial_amount'] = initialAmount;
        }
        investment.splice(
          investment.findIndex((invest) => invest._id === id),
          1,
          investmentObj
        );

        setInvestment([...investment]);
      })
      .catch((err) => {
        console.log(err);
        notify(err.response.data, 'danger');
      });
  };
  const successDelete = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: 'block', marginTop: '-100px' }}
        title='Deletado!'
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle='success'
        btnSize=''
      >
        Seu investimento foi deletado...
      </ReactBSAlert>
    );
  };
  const cancelDelete = () => {
    setAlert(
      <ReactBSAlert
        danger
        style={{ display: 'block', marginTop: '-100px' }}
        title='Cancelado'
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnText='Ok'
        confirmBtnBsStyle='success'
        btnSize=''
      ></ReactBSAlert>
    );
  };
  const warningWithConfirmAndCancelMessage = (id) => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block', marginTop: '-100px' }}
        title='Você tem certeza disso?'
        onConfirm={() => {
          try {
            handleDelete(id);
          } catch (error) {}
        }}
        onCancel={() => cancelDelete()}
        confirmBtnBsStyle='success'
        cancelBtnBsStyle='danger'
        confirmBtnText='Sim, deletar!'
        cancelBtnText='Cancelar'
        showCancel
        btnSize=''
      >
        Você não poderá recuperar os dados do seu investimentos
      </ReactBSAlert>
    );
  };
  useEffect(() => {
    const getInvestments = async () => {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${login.token}`,
        },
      };
      const brokersFromTheAPI = await axios.get(
        `${Config.SERVER_ADDRESS}/api/brokers`,
        config
      );

      setBrokers(brokersFromTheAPI.data.brokers);
      let investments = await fetchInvestments('', login);
      const filter = JSON.parse(localStorage.getItem('filter'));

      if (filter !== null) {
        investments =
          filter.trim() === ''
            ? [...investments]
            : investments.filter((invest) =>
                invest.name.toLowerCase().includes(filter)
              );
        localStorage.removeItem('filter');
      }
      setInvestment(investments.investments);
      console.log(investments);
      console.log(investment);
      if (investments.hasLoaded) {
        setIsLoading(false);
      }
      return investments;
    };
    getInvestments();
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
      .delete(`${Config.SERVER_ADDRESS}/api/investments/${id}`, config)
      .then((response) => {
        successDelete();
        notify(`Investimento excluído com Sucesso`);
        setInvestment(investment.filter((invest) => invest._id !== id));
      })
      .catch((err) => {
        notify(err.response.data, 'danger');
      });
  };
  const hideAlert = () => {
    setAlert(null);
  };

  const toggle = () => setModal(!modal);
  const closeBtn = (
    <button color='danger' className='close' onClick={toggle}>
      <span style={{ color: 'white' }}>×</span>
    </button>
  );
  const handleArchive = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${login.token}`,
      },
    };
    console.log(`Bearer ${login.token}`);
    await axios
      .get(`${Config.SERVER_ADDRESS}/api/investments/${id}/archive`, config)
      .then((res) => {
        notify(`Você arquivou com sucesso o seu investimento ${name}`);
        setInvestment(investment.filter((invest) => invest._id !== id));
      })
      .catch((err) => {
        notify(err.message, 'danger');
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
            <Modal
              modalClassName='modal-black'
              style={{
                background:
                  'linear-gradient(180deg,#222a42 0,#1d253b)!important',
              }}
              isOpen={modal}
              toggle={toggle}
              className='modal-lg'
            >
              <ModalHeader
                style={{ color: 'hsla(0,0%,100%,.8)' }}
                toggle={toggle}
                close={closeBtn}
              >
                <span style={{ color: 'hsla(0,0%,100%,.9)' }}>
                  Editar Investimento
                </span>
              </ModalHeader>
              <ModalBody
                style={{
                  background:
                    'linear-gradient(180deg,#222a42 0,#1d253b)!important',
                }}
              >
                <Label>Nome</Label>
                <Input
                  required
                  style={{ backgroundColor: '#2b3553' }}
                  type='text'
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <Row style={{ marginBottom: '10px' }}>
                  <Col md='3' style={{ paddingRight: '0' }}>
                    <Label>Corretora</Label>
                    <Input
                      required
                      style={{ backgroundColor: '#2b3553' }}
                      type='select'
                      value={broker}
                      onChange={(e) => {
                        console.log(broker, e.target.value);
                        setBroker(e.target.value);
                      }}
                    >
                      <option value='default' disabled={true}>
                        Selecione uma opção
                      </option>
                      {brokers.map((brk) => (
                        <option key={brk._id} value={brk._id}>
                          {brk.name}
                        </option>
                      ))}
                    </Input>
                  </Col>
                  <Col md='2' style={{ paddingRight: '0' }}>
                    <Label>Tipo</Label>
                    <Input
                      style={{ backgroundColor: '#2b3553' }}
                      type='select'
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value='' disabled={true}>
                        Selecione uma opção
                      </option>
                      <option>CDB</option>
                      <option>LCI</option>
                      <option>LCA</option>
                      <option>Debênture</option>
                    </Input>
                  </Col>
                  <Col md='2' style={{ paddingRight: '0' }}>
                    <Label>Taxa</Label>
                    <Input
                      style={{ backgroundColor: '#2b3553' }}
                      type='text'
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                    />
                  </Col>
                  <Col md='2' style={{ paddingRight: '0' }}>
                    <Label>Indexador</Label>
                    <Input
                      required
                      style={{ backgroundColor: '#2b3553' }}
                      type='select'
                      value={indexer}
                      onChange={(e) => setIndexer(e.target.value)}
                    >
                      <option value='' disabled={true}>
                        Selecione uma opção
                      </option>
                      <option>CDI</option>
                      <option>IPCA</option>
                      <option>Prefixado</option>
                    </Input>
                  </Col>
                  <Col md='3' style={{ paddingRight: '0' }}>
                    <Label>Data do investimento</Label>
                    <Input
                      style={{ backgroundColor: '#2b3553' }}
                      type='date'
                      value={investmentDate.slice(0, 10)}
                      onChange={(e) => {
                        setInvestmentDate(e.target.value);
                      }}
                    />
                  </Col>
                  <Col md='3' style={{ paddingRight: '0' }}>
                    <Label>Data de vencimento</Label>
                    <Input
                      style={{ backgroundColor: '#2b3553' }}
                      type='date'
                      value={dueDate.slice(0, 10)}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </Col>
                  <Col md='2' style={{ paddingRight: '0' }}>
                    <Label>Montante Inicial</Label>
                    <NumberFormat
                      style={{ backgroundColor: '#2b3553' }}
                      onChange={(e) => {
                        setHasChanged(true);
                        setInitialAmount(e.target.value);
                      }}
                      type='text'
                      value={initialAmount}
                      placeholder='R$0.00'
                      thousandSeparator={'.'}
                      decimalSeparator={','}
                      prefix={'R$'}
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
                    console.log(id);
                    handleUpdate(
                      {
                        _id: id,
                        name,
                        broker,
                        type,
                        rate,
                        indexer,
                        investment_date: investmentDate,
                        due_date: dueDate,
                        accrued_income: accruedIncome,
                      },
                      id
                    );
                  }}
                >
                  Salvar
                </Button>
                <Button color='secondary' onClick={toggle}>
                  Cancelar
                </Button>
              </ModalFooter>
            </Modal>
            {alert}
            <Row>
              <Col md='12'>
                <Card style={{ position: 'relative' }}>
                  <CardHeader className='row justify-content-between ml-2 mt-1 mr-2 align-items-center'>
                    <CardTitle className='m-0' tag='h1'>
                      <i className='tim-icons icon-wallet-43'></i> Investments
                    </CardTitle>
                    <Link to='/admin/investment/:id'>
                      <Button>New Investment</Button>
                    </Link>
                  </CardHeader>
                  <CardBody>
                    <Table
                      className='tablesorter'
                      // responsive
                      style={{ overflowX: 'auto', position: 'relative' }}
                    >
                      <thead className='text-primary'>
                        <tr>
                          <th>Name</th>
                          <th>Broker</th>
                          <th>Type</th>
                          <th>Rate</th>
                          <th>Indexer</th>
                          <th>investment date</th>
                          <th>due date</th>
                          <th className='text-center'>initial amount</th>
                          <th className='text-center'>accrued income</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {investment.map((inves) => (
                          <tr id={inves._id} key={inves._id}>
                            <td>
                              <Link to={`/admin/investment/${inves._id}`}>
                                {inves.name}
                              </Link>
                            </td>
                            <td>{inves.broker.name}</td>
                            <td>{inves.type}</td>
                            <td>{inves.rate}</td>
                            <td>{inves.indexer}</td>
                            <td>
                              {moment(inves.investment_date).format(
                                'DD/MM/YYYY'
                              )}
                            </td>
                            <td>
                              {moment(inves.due_date).format('DD/MM/YYYY')}
                            </td>
                            <td className='text-center'>
                              {inves.initial_amount.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })}
                            </td>
                            <td className='text-center'>
                              {inves.accrued_income.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <MyTooltip
                                placement='top'
                                target={`archive-${inves._id}`}
                              >
                                Arquivar
                              </MyTooltip>
                              <Button
                                style={{ cursor: 'default' }}
                                id={`archive-${inves._id}`}
                                color='info'
                                size='sm'
                                className={classNames('btn-icon btn-link like')}
                              >
                                <i
                                  style={{ cursor: 'pointer' }}
                                  id={inves._id}
                                  className='fas fa-archive'
                                  onClick={(e) => {
                                    handleArchive(e.target.id);
                                  }}
                                ></i>
                              </Button>
                              <MyTooltip
                                placement='top'
                                target={`Tooltip-${inves._id}`}
                              >
                                Editar
                              </MyTooltip>
                              <Button
                                id={`Tooltip-${inves._id}`}
                                color='warning'
                                size='sm'
                                className={classNames('btn-icon btn-link like')}
                                style={{ cursor: 'default' }}
                              >
                                <i
                                  onClick={(e) => {
                                    const filtered = investment.find(
                                      (invest) =>
                                        invest._id ===
                                        e.target.parentElement.parentElement
                                          .parentElement.id
                                    );
                                    setBroker(filtered.broker._id);
                                    setId(filtered._id);
                                    setName(filtered.name);
                                    setType(filtered.type);
                                    setRate(filtered.rate);
                                    setIndexer(filtered.indexer);
                                    setDueDate(filtered.due_date);
                                    setInvestmentDate(filtered.investment_date);
                                    setInitialAmount(filtered.initial_amount);
                                    setAccruedIncome(filtered.accrued_income);
                                    toggle();
                                  }}
                                  className='tim-icons icon-pencil'
                                  style={{ cursor: 'pointer' }}
                                />
                              </Button>
                              <MyTooltip
                                placement='top'
                                target={`Delete-${inves._id}`}
                              >
                                Excluir
                              </MyTooltip>
                              <Button
                                id={`Delete-${inves._id}`}
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
                                  id={inves._id}
                                  style={{
                                    // display: 'inline-block !important',
                                    cursor: 'pointer',
                                  }}
                                  className='tim-icons icon-trash-simple classVisible'
                                  onClick={(e) => {
                                    e.preventDefault();
                                    console.log(e.target.id);
                                    warningWithConfirmAndCancelMessage(
                                      e.target.id
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

export default InvestmentsList;

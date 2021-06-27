import axios from 'axios';
import MyTooltip from 'components/Tooltip/MyTooltip';
import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Col,
  CustomInput,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from 'reactstrap';
import Config from '../config.json';
import { countries } from 'views/pages/countries';
import { currencies } from 'views/pages/currencies';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import NotificationAlert from 'react-notification-alert';
import { Link } from 'react-router-dom';
import Spinner from 'components/Spinner/Spinner';

const ArchiveBrokers = () => {
  const sayIt = () => {
    // imageRef.current.sayHello();
  };
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [modal, setModal] = useState(false);
  const [country, setCountry] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).country
      : null
  );

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currency, setCurrency] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).currency
      : null
  );
  const [brokers, setBrokers] = useState([]);
  const fetchCurrency = async (code) => {
    const response = await fetch(
      `https://restcountries.eu/rest/v2/alpha/${code}`
    );
    const res = await response.json();
    setCurrency(res.currencies[0].code);
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
          ? 'Your broker was unarchived...'
          : 'Your broker was deleted...'}
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
          ? 'Do you want to restore the data for this broker?'
          : 'You will not be able to restore the data for your broker again'}
      </ReactBSAlert>
    );
  };

  const hideAlert = () => {
    setAlert(null);
  };

  useEffect(() => {
    const handleAsyncFunction = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${login.token}`,
        },
      };
      const brokersFromTheAPI = await axios.get(
        `${Config.SERVER_ADDRESS}/api/brokers/archive`,
        config
      );
      setBrokers(brokersFromTheAPI.data);
    };
    handleAsyncFunction();
    // eslint-disable-next-line
  }, []);
  const toggle = () => setModal(!modal);
  const closeBtn = (
    <button color='danger' className='close' onClick={toggle}>
      <span style={{ color: 'white' }}>×</span>
    </button>
  );

  const handleUpdate = async (brokerObj) => {
    if (image) {
      const formData = new FormData();
      formData.append('image', image);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      await axios
        .post(`${Config.SERVER_ADDRESS}/api/uploadImages`, formData, config)
        .then(async (res) => {
          const filepath = res.data.filepath.replace('\\', '/');
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${login.token}`,
            },
          };
          brokerObj['filepath'] = filepath;
          await axios
            .put(
              `${Config.SERVER_ADDRESS}/api/brokers/${id}`,
              brokerObj,
              config
            )
            .then((res) => {
              notify('Alterado com sucesso');
              brokers.splice(
                brokers.findIndex((invest) => invest._id === id),
                1,
                brokerObj
              );

              setBrokers([...brokers]);

              setImage(null);
            })
            .catch((error) => console.log(error));
          toggle();
        });
    } else {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${login.token}`,
        },
      };
      brokerObj['filepath'] = imagePreview.replace(Config.SERVER_ADDRESS, '');
      await axios
        .put(`${Config.SERVER_ADDRESS}/api/brokers/${id}`, brokerObj, config)
        .then((res) => {
          notify('Alterado com sucesso');
          brokers.splice(
            brokers.findIndex((invest) => invest._id === id),
            1,
            brokerObj
          );

          setBrokers([...brokers]);

          setImage(null);
        })
        .catch((error) => console.log(error));
      toggle();
    }
  };
  const handleUnarchive = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${login.token}`,
      },
    };
    await axios
      .put(`${Config.SERVER_ADDRESS}/api/brokers/${id}/unarchive`, null, config)
      .then((res) => {
        success();
        notify('Você desarquivou com sucesso a corretora');
        setBrokers(brokers.filter((brk) => brk._id !== id));
      })
      .catch((err) => {
        hideAlert();
        console.error(err.response);
        notify(
          'Não é possível arquivar uma corretora com investimentos ativos',
          'danger'
        );
        // notify(err.response.data.message, 'danger');
      });
  };

  const handleDelete = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${login.token}`,
      },
    };
    await axios
      .delete(`${Config.SERVER_ADDRESS}/api/brokers/${id}`, config)
      .then((res) => {
        success('delete');
        notify('Você deletou com sucesso a corretora');
        setBrokers(brokers.filter((brk) => brk._id !== id));
      })
      .catch((err) => {
        hideAlert();
        notify(
          'Não é possível deletar uma corretora com investimentos ativos cadastrados',
          'danger'
        );
        // notify(err.response.data.message, 'danger');
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
                <span style={{ color: 'hsla(0,0%,100%,.9)' }} onClick={sayIt()}>
                  Edit Broker
                </span>
              </ModalHeader>
              <ModalBody
                style={{
                  background:
                    'linear-gradient(180deg,#222a42 0,#1d253b)!important',
                  paddingBottom: '0',
                }}
              >
                <Row className='mb-10 align-items-center justify-content-center '>
                  <Col md='4' className='pr-0'>
                    <Label>Name</Label>
                    <Input
                      required
                      style={{ backgroundColor: '#2b3553' }}
                      type='text'
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                  </Col>

                  <Col md='4' className='pr-0'>
                    <Label>Country</Label>
                    <Input
                      required
                      style={{ backgroundColor: '#2b3553' }}
                      type='select'
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        fetchCurrency(e.target[e.target.selectedIndex].id);
                      }}
                    >
                      <option value='' disabled={true}>
                        Selecione uma opção
                      </option>
                      {Object.entries(countries).map((country) => (
                        <option
                          key={country[0]}
                          id={country[0]}
                          value={country[0]}
                        >
                          {country[1]}
                        </option>
                      ))}
                    </Input>
                  </Col>
                  <Col md='4' className='pr-0'>
                    <Label>Currency</Label>
                    <Input
                      required
                      style={{ backgroundColor: '#2b3553' }}
                      type='select'
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value='' disabled={true}>
                        Selecione uma opção
                      </option>
                      {Object.entries(currencies).map((currency) => (
                        <option key={currency[0]} value={currency[0]}>
                          {currency[1].name}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </Row>
                <div className='row justify-content-center mt-4'>
                  <img
                    src={imagePreview}
                    style={{ maxWidth: '250px', maxHeight: '250px' }}
                    alt=''
                  />
                </div>
                <CustomInput
                  type='file'
                  id='exampleCustomFileBrowser'
                  name='customFile'
                  onChange={(e) => {
                    let reader = new FileReader();
                    let file = e.target.files[0];
                    reader.onloadend = () => {
                      setImage(file);
                      setImagePreview(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </ModalBody>
              <ModalFooter
                style={{
                  background:
                    'linear-gradient(180deg,#222a42 0,#1d253b)!important',
                }}
              >
                <Button
                  color='success'
                  onClick={() =>
                    handleUpdate({
                      _id: id,
                      name,
                      country,
                      currency,
                    })
                  }
                >
                  Save
                </Button>
                <Button color='secondary' onClick={toggle}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
            {alert}
            <Row>
              <div className='col-md-10 mx-auto'>
                <Card className='card mt-4 pr-5'>
                  <CardHeader className='row justify-content-between ml-2 mt-1 mr-2 align-items-center'>
                    <CardTitle className='m-0' tag='h1'>
                      <i className='fas fa-landmark'></i> Archive Brokers
                    </CardTitle>
                  </CardHeader>
                  <Table className='m-4'>
                    <thead>
                      <tr>
                        <th>Picture</th>
                        <th>Name</th>
                        <th>Country</th>
                        <th>Currency</th>
                        <th style={{ textAlign: 'center' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {brokers.map((brk) => (
                        <tr key={brk._id} id={brk._id}>
                          <th>
                            <div
                              style={{
                                background: `url(${Config.SERVER_ADDRESS}${brk.filepath}) no-repeat center  center   / contain `,
                                width: '100px',
                                height: '100px',
                                // backgroundPosition: 'center',
                                // backgroundRepeat: 'no-repeat',
                                // backgroundSize: '',
                              }}
                              alt='...'
                              className='avatar'
                            />
                          </th>
                          <th>
                            <Link to={`/admin/broker/${brk._id}`}>
                              {brk.name}
                            </Link>
                          </th>
                          <th>{countries[brk.country]}</th>
                          <th>{currencies[brk.currency].name}</th>
                          <td style={{ textAlign: 'center' }}>
                            <MyTooltip
                              placement='top'
                              target={`unarchive-${brk._id}`}
                            >
                              Unarchive
                            </MyTooltip>
                            <Button
                              id={`unarchive-${brk._id}`}
                              style={{ cursor: 'default' }}
                              color='info'
                              size='sm'
                              className='btn-icon btn-link like'
                            >
                              <i
                                id={brk._id}
                                className='tim-icons icon-upload'
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  warningWithConfirmAndCancelMessage(
                                    e.target.id
                                  );
                                }}
                              ></i>
                            </Button>
                            <MyTooltip
                              placement='top'
                              target={`edit-${brk._id}`}
                            >
                              Edit
                            </MyTooltip>
                            <Button
                              id={`edit-${brk._id}`}
                              style={{ cursor: 'default' }}
                              color='warning'
                              size='sm'
                              className='btn-icon btn-link like'
                            >
                              <i
                                className='tim-icons icon-pencil'
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                  toggle();
                                  const filtered = brokers.find(
                                    (brk) =>
                                      brk._id ===
                                      e.target.parentElement.parentElement
                                        .parentElement.id
                                  );
                                  // imageRef.current.sayHello(
                                  //   `${Config.SERVER_ADDRESS}${filtered.filepath}`
                                  // );
                                  setImagePreview(
                                    `${Config.SERVER_ADDRESS}${filtered.filepath}`
                                  );
                                  setId(filtered._id);
                                  setName(filtered.name);
                                  setCountry(filtered.country);
                                  setCurrency(filtered.currency);
                                }}
                              />
                            </Button>
                            <MyTooltip
                              placement='top'
                              target={`Delete-${brk._id}`}
                            >
                              Excluir
                            </MyTooltip>
                            <Button
                              id={`Delete-${brk._id}`}
                              size='sm'
                              className='btn-icon btn-link'
                              color='danger'
                              style={{
                                backgroundColor: 'transparent',
                                outline: 'none',
                                borderColor: 'transparent',
                                cursor: 'default',
                              }}
                            >
                              <i
                                id={brk._id}
                                onClick={(e) => {
                                  e.preventDefault();
                                  warningWithConfirmAndCancelMessage(
                                    e.target.id,
                                    'delete'
                                  );
                                }}
                                style={{ cursor: 'pointer' }}
                                className='tim-icons icon-trash-simple classVisible'
                              ></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              </div>
            </Row>
          </>
        )}
      </div>
    </>
  );
};

export default ArchiveBrokers;

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  Col,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from 'reactstrap';
import NotificationAlert from 'react-notification-alert';
import Spinner from '../components/Spinner/Spinner';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import defaultImg from 'assets/img/logo.png';

const CountriesListInflations = () => {
  const [alert, setAlert] = useState(null);
  const [inflations, setInflations] = useState([]);
  const [countryName, setCountryName] = useState('');
  const [alpha2Code, setAlpha2Code] = useState('');
  const [originalAlpha2Code, setOriginalAlpha2Code] = useState('');
  const [values, setValues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewDataModalOpen, setIsNewDataModalOpen] = useState(false);

  const address = process.env.REACT_APP_SERVER_ADDRESS;

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

  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );

  useEffect(() => {
    const getInflations = async () => {
      const response = await axios.get(`${address}/api/inflations`);
      setInflations(response.data);
    };
    getInflations();
  }, []);

  const success = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: 'block', marginTop: '-100px' }}
        title='Deleted!'
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle='success'
        btnSize=''
      >
        Your Country Info was deleted...
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
  const warningWithConfirmAndCancelMessage = (id) => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block', marginTop: '-100px' }}
        title='Are you sure?'
        onConfirm={() => {
          handleDelete(id);
        }}
        onCancel={() => cancel()}
        confirmBtnBsStyle='success'
        cancelBtnBsStyle='danger'
        confirmBtnText='Yes, delete!'
        cancelBtnText='Cancel'
        showCancel
        btnSize=''
      >
        You will not be able to restore the data for your Country Info Inflation
        again
      </ReactBSAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
  const toggle = () => {
    setIsModalOpen(!isModalOpen);
  };
  const toggleModalNewData = () => {
    setIsNewDataModalOpen(!isNewDataModalOpen);
  };
  const closeBtn = (
    <button color='danger' className='close' onClick={() => toggle()}>
      <span style={{ color: 'white' }}>&times;</span>
    </button>
  );
  const closeBtnNewDataModal = (
    <button
      color='danger'
      className='close'
      onClick={() => toggleModalNewData()}
    >
      <span style={{ color: 'white' }}>&times;</span>
    </button>
  );
  const handleSave = async (ObjCountryInfo) => {
    console.log(ObjCountryInfo);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${login.token}`,
      },
    };
    await axios
      .put(
        `${address}/api/inflations/${originalAlpha2Code}`,
        ObjCountryInfo,
        config
      )
      .then((res) => {
        inflations.splice(
          inflations.findIndex((inf) => inf.alpha2Code === originalAlpha2Code),
          1,
          ObjCountryInfo
        );
        setInflations(
          inflations
            .filter((inf) => inf.alpha2Code)
            .sort((a, b) => a['Country Name'].localeCompare(b['Country Name']))
        );
        notify(
          'You have successfully updated the country info for the inflation data'
        );
      })
      .catch((error) =>
        notify(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          'danger'
        )
      );
    toggle();
  };
  const handleDelete = async (id) => {
    const config = { headers: { Authorization: `Bearer ${login.token}` } };
    await axios
      .delete(`${address}/api/inflations/${id}`, config)
      .then((res) => {
        notify('You have successfully deleted your country info data');
        success();
        setInflations(inflations.filter((inf) => inf.alpha2Code !== id));
      })
      .catch((error) =>
        notify(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          'danger'
        )
      );
  };

  const handleNewData = async (ObjectCountryInfo) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${login.token}`,
      },
    };
    await axios
      .post(`${address}/api/inflations`, ObjectCountryInfo, config)
      .then((res) => {
        notify('You have successfully created a new country info data');
        setInflations(
          [...inflations, ObjectCountryInfo]
            .filter((inf) => inf.alpha2Code)
            .sort((a, b) => a['Country Name'].localeCompare(b['Country Name']))
        );
      })
      .catch((error) =>
        notify(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          'danger'
        )
      );
  };
  return (
    <div className='content'>
      {inflations.length === 0 ? (
        <Spinner />
      ) : (
        <>
          <div className='react-notification-alert-container'>
            <NotificationAlert ref={notificationAlertRef} />
          </div>
          <Modal
            isOpen={isModalOpen}
            toggle={() => toggle()}
            keyboard={true}
            modalClassName='modal-black'
          >
            <ModalHeader close={closeBtn} toggle={() => toggle()}>
              Edit Country info
            </ModalHeader>
            <ModalBody>
              <Row className='justify-content-center align-items-center'>
                <Col md='6'>Country Name</Col>
                <Col md='6'>
                  <Input
                    type='text'
                    value={countryName}
                    onChange={(e) => setCountryName(e.target.value)}
                  ></Input>
                </Col>
              </Row>
              <Row className='mt-2 justify-content-center align-items-center'>
                <Col md='6'>Alpha 2 Code</Col>
                <Col md='6'>
                  <Input
                    type='text'
                    value={alpha2Code}
                    onChange={(e) => setAlpha2Code(e.target.value)}
                  ></Input>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button
                color='success'
                onClick={(e) =>
                  handleSave({
                    'Country Name': countryName,
                    alpha2Code,
                    values,
                  })
                }
              >
                Save
              </Button>
              <Button onClick={toggle}>Back</Button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={isNewDataModalOpen}
            toggle={() => toggleModalNewData()}
            keyboard={true}
            modalClassName='modal-black'
          >
            <ModalHeader
              close={closeBtnNewDataModal}
              toggle={() => toggleModalNewData()}
            >
              Add new Country Info
            </ModalHeader>
            <ModalBody>
              <Row className='justify-content-center align-items-center'>
                <Col md='6'>Country Name</Col>
                <Col md='6'>
                  <Input
                    type='text'
                    value={countryName}
                    onChange={(e) => setCountryName(e.target.value)}
                  ></Input>
                </Col>
              </Row>
              <Row className='mt-2 justify-content-center align-items-center'>
                <Col md='6'>Alpha 2 Code</Col>
                <Col md='6'>
                  <Input
                    type='text'
                    value={alpha2Code}
                    onChange={(e) => setAlpha2Code(e.target.value)}
                  ></Input>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button
                color='success'
                onClick={(e) =>
                  handleNewData({
                    'Country Name': countryName,
                    alpha2Code,
                    values,
                  })
                }
              >
                Save
              </Button>
              <Button onClick={toggleModalNewData}>Back</Button>
            </ModalFooter>
          </Modal>
          {alert}
          <Card>
            <CardHeader className='mb-4 m-2  row justify-content-between align-items-center'>
              <h1 style={{ marginBottom: 0 }}>
                <i className='fas fa-flag'></i> Countries List Inflation
              </h1>
              <Button
                onClick={(e) => {
                  setAlpha2Code('');
                  setOriginalAlpha2Code('');
                  setCountryName('');
                  setValues([]);
                  toggleModalNewData(e);
                }}
              >
                New Country Info data
              </Button>
            </CardHeader>

            <Table>
              <thead>
                <tr>
                  <th>Flag</th>
                  <th>Country Name</th>
                  <th>Alpha 2 Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inflations
                  .filter((inf) => inf.alpha2Code)
                  .sort((a, b) =>
                    a['Country Name'].localeCompare(b['Country Name'])
                  )
                  .map((inf) => (
                    <tr id={inf.alpha2Code} key={inf.alpha2Code}>
                      <td>
                        <img
                          style={{ width: '32px' }}
                          src={`/flags/${inf.alpha2Code}.png`}
                          alt={inf.alpha2Code}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.setAttribute('src', defaultImg);
                          }}
                        />
                      </td>
                      <td style={{ color: 'white' }} id={inf.alpha2Code}>
                        {inf['Country Name']}
                      </td>
                      <td>{inf.alpha2Code}</td>
                      <td id={inf.alpha2Code}>
                        <Button
                          color='info'
                          className='btn-link btn btn-primary'
                          onClick={(e) => {
                            setAlpha2Code(
                              e.target.parentElement.parentElement.id
                            );
                            setOriginalAlpha2Code(
                              e.target.parentElement.parentElement.id
                            );
                            setCountryName(
                              inflations.find(
                                (inf) =>
                                  inf.alpha2Code ===
                                  e.target.parentElement.parentElement.id
                              )['Country Name']
                            );
                            setValues(
                              inflations.find(
                                (inf) =>
                                  inf.alpha2Code ===
                                  e.target.parentElement.parentElement.id
                              ).values
                            );
                            toggle();
                          }}
                        >
                          <i className='tim-icons icon-pencil'></i>
                        </Button>
                        <Button
                          color='danger'
                          className='btn-link btn btn-primary'
                          onClick={(e) => {
                            warningWithConfirmAndCancelMessage(
                              e.target.parentElement.parentElement.id
                            );
                          }}
                        >
                          <i className='tim-icons icon-trash-simple'></i>
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
  );
};

export default CountriesListInflations;

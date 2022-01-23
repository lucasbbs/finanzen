import axios from 'axios';
import { format, parse } from 'date-fns';

import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Col,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';
import NotificationAlert from 'react-notification-alert';
import Spinner from '../components/Spinner/Spinner';
import { ISODateFormat } from 'helpers/functions';

const Inflations = () => {
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
  const [index, setIndex] = useState(0);
  const [month, setMonth] = useState('');
  const [inflation, setInflation] = useState(0);
  const [selectedInflation, setSelectedInflation] = useState([]);
  const [alpha2Code, setAlpha2Code] = useState('');
  const [countryName, setCountryName] = useState('');
  const [isThereAnyChanges, setIsThereAnyChanges] = useState(false);

  const [inflations, setInflations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const address = process.env.REACT_APP_SERVER_ADDRESS;

  const toggle = () => {
    setIsModalOpen(!isModalOpen);
  };
  const toggleAddModal = () => {
    setIsAddModalOpen(!isAddModalOpen);
  };
  useEffect(() => {
    const getInflations = async () => {
      const response = await axios.get(`${address}/api/inflations`);
      setInflations(response.data);
    };
    getInflations();
  }, []);

  const setSelection = (e) => {
    if (e.target.value) {
      setAlpha2Code(e.target.value);
      setCountryName(
        inflations.find((inflation) => inflation.alpha2Code === e.target.value)[
          'Country Name'
        ]
      );
      setSelectedInflation(
        inflations.find((inflation) => inflation.alpha2Code === e.target.value)
          .values
      );

      setIsThereAnyChanges(false);
    } else {
      setSelectedInflation([]);
      setIsThereAnyChanges(false);
    }
  };
  const handleClick = (e) => {
    if (30 < e.nativeEvent.offsetX && e.nativeEvent.offsetX < 60) {
      setMonth(e.target.getAttribute('data'));
      setInflation(e.target.title);
      setIndex(e.target.id);
      toggle();
    }
  };
  const closeBtn = (
    <button color='danger' className='close' onClick={() => toggle()}>
      <span style={{ color: 'white' }}>&times;</span>
    </button>
  );
  const closeBtnAddModal = (
    <button color='danger' className='close' onClick={() => toggleAddModal()}>
      <span style={{ color: 'white' }}>&times;</span>
    </button>
  );
  const handleSubmit = async (e) => {
    const newObj = {};
    newObj[month] = Number(inflation);
    selectedInflation.splice(index, 1, newObj);
    setSelectedInflation(selectedInflation);
    toggle();
    setIsThereAnyChanges(true);
    setMonth('');
  };
  const handleSubmitAddInflation = async (e) => {
    const newObj = {};
    newObj[`${month}-01`] = Number(inflation);
    setSelectedInflation(
      [...selectedInflation, newObj].sort(
        (a, b) => new Date(Object.keys(a)) - new Date(Object.keys(b))
      )
    );
    toggleAddModal();
    setIsThereAnyChanges(true);
    setMonth('');
  };
  const handleSave = async (InflationsObject) => {
    // console.log(InflationsObject);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${login.token}`,
      },
    };

    await axios
      .put(`${address}/api/inflations/${alpha2Code}`, InflationsObject, config)
      .then((res) =>
        notify(`You have updated the inflations for ${countryName}`)
      )
      .catch((error) =>
        notify(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          'danger'
        )
      );
  };
  const handleRemove = (e) => {
    setSelectedInflation(
      selectedInflation.filter((_, i) => Number(index) !== i)
    );
    setIsThereAnyChanges(true);
    toggle();
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
              Edit the inflation for {month}
            </ModalHeader>
            <ModalBody>
              <Input
                value={inflation}
                onChange={(e) => setInflation(e.target.value)}
              />
              <Button color='danger' onClick={(e) => handleRemove(e)}>
                Delete
              </Button>
            </ModalBody>
            <ModalFooter>
              <Button color='success' onClick={(e) => handleSubmit(e)}>
                Submit
              </Button>
              <Button onClick={toggle}>Back</Button>
            </ModalFooter>
          </Modal>
          <Modal
            isOpen={isAddModalOpen}
            toggle={() => toggleAddModal()}
            keyboard={true}
            modalClassName='modal-black'
          >
            <ModalHeader
              close={closeBtnAddModal}
              toggle={() => toggleAddModal()}
            >
              Add an inflation rate
            </ModalHeader>
            <ModalBody>
              <Row>
                <Col>
                  <span>Please Select a month</span>{' '}
                </Col>
                <Col md='6'>
                  <Input
                    type='month'
                    onChange={(e) => setMonth(e.target.value)}
                  ></Input>
                </Col>
              </Row>

              <Input
                value={inflation}
                onChange={(e) => setInflation(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color='success'
                onClick={(e) => handleSubmitAddInflation(e)}
              >
                Submit
              </Button>
              <Button color='danger' onClick={toggleAddModal}>
                Back
              </Button>
            </ModalFooter>
          </Modal>
          <Row className='justify-content-center align-items-center ml-2 mt-1 mr-2 '>
            {/* <Card style={{ position: 'relative' }}> */}
            <Col md='6' className='row'>
              <h1 style={{ marginRight: '25px' }}>
                <i className='fas fa-comment-dollar'></i> Inflations Editor
              </h1>
              {isThereAnyChanges ? (
                <Button
                  onClick={() =>
                    handleSave({
                      alpha2Code,
                      'Country Name': countryName,
                      values: selectedInflation,
                    })
                  }
                >
                  Save
                </Button>
              ) : null}
            </Col>
            <Col md='6'>
              <Input
                type='select'
                style={{ background: 'rgb(43, 53, 83)' }}
                onChange={(e) => setSelection(e)}
              >
                <option value=''>Select an Option</option>
                {inflations
                  .filter((inflation) => inflation.alpha2Code)
                  .map((inflation) => (
                    <option
                      key={inflation.alpha2Code}
                      value={inflation.alpha2Code}
                    >
                      {inflation['Country Name']}
                    </option>
                  ))}
              </Input>
              {selectedInflation.length !== 0 ? (
                <Button
                  className='btn-link btn btn-primary'
                  onClick={toggleAddModal}
                >
                  <i className='fas fa-plus'></i> Add
                </Button>
              ) : null}
            </Col>
            <Row>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                }}
              >
                <div style={{ width: '3vw' }}></div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(12, 1fr)',
                }}
              >
                <div style={{ width: '6.2vw' }}>janeiro</div>
                <div style={{ width: '6.2vw' }}>fevereiro</div>
                <div style={{ width: '6.2vw' }}>março</div>
                <div style={{ width: '6.2vw' }}>abril</div>
                <div style={{ width: '6.2vw' }}>maio</div>
                <div style={{ width: '6.2vw' }}>junho</div>
                <div style={{ width: '6.2vw' }}>julho</div>
                <div style={{ width: '6.2vw' }}>agosto</div>
                <div style={{ width: '6.2vw' }}>setembro</div>
                <div style={{ width: '6.2vw' }}>outubro</div>
                <div style={{ width: '6.2vw' }}>novembro</div>
                <div style={{ width: '6.2vw' }}>dezembro</div>
              </div>
            </Row>

            <Row className='align-items-center'>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                }}
              >
                {selectedInflation.length !== 0 &&
                  Array(
                    selectedInflation.length % 12 === 0 &&
                      parse(
                        Object.keys(selectedInflation[0]),
                        'yyyy-MM-dd',
                        new Date()
                      ).getMonth() !== 0
                      ? Math.ceil(selectedInflation.length / 12) + 1
                      : parse(
                          Object.keys(selectedInflation[0]),
                          'yyyy-MM-dd',
                          new Date()
                        ).getMonth() <=
                        1 +
                          parse(
                            Object.keys(
                              selectedInflation[selectedInflation.length - 1]
                            ),
                            'yyyy-MM-dd',
                            new Date()
                          ).getMonth()
                      ? Math.ceil(selectedInflation.length / 12)
                      : Math.ceil(selectedInflation.length / 12) + 1
                  )
                    .fill(null)
                    .map((_, index) => (
                      <div key={index} style={{ height: '44px', width: '3vw' }}>
                        {ISODateFormat(
                          Object.keys(selectedInflation[0])
                        ).getFullYear() + index}
                      </div>
                    ))}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(12, 1fr)',
                }}
              >
                <div
                  style={{
                    gridColumnStart:
                      selectedInflation.length !== 0
                        ? ISODateFormat(
                            Object.keys(selectedInflation[0])
                          ).getMonth() + 1
                        : null,
                  }}
                >
                  <h6>
                    {selectedInflation.length !== 0
                      ? format(
                          parse(
                            Object.keys(selectedInflation[0]),
                            'yyyy-MM-dd',
                            new Date()
                          ),
                          'dd/MM/yyyy'
                        )
                      : null}
                  </h6>
                  <h6
                    id={0}
                    data={
                      selectedInflation.length !== 0
                        ? Object.keys(selectedInflation[0])
                        : null
                    }
                    className='inflation'
                    onClick={(e) => handleClick(e)}
                    title={
                      selectedInflation.length !== 0
                        ? Object.values(selectedInflation[0])
                        : null
                    }
                  >
                    {selectedInflation.length !== 0
                      ? Number(Object.values(selectedInflation[0])).toFixed(2)
                      : null}
                  </h6>
                </div>
                {selectedInflation.slice(1).map((inflation, index) =>
                  Object.entries(inflation).map((entry) => (
                    <div style={{ width: '6.2vw' }} key={entry[0]}>
                      <h6>
                        {format(
                          parse(entry[0], 'yyyy-MM-dd', new Date()),
                          'dd/MM/yyyy'
                        )}
                      </h6>
                      <h6
                        id={index + 1}
                        data={entry[0]}
                        className='inflation'
                        title={entry[1]}
                        onClick={(e) => handleClick(e)}
                      >
                        {entry[1].toFixed(2)}
                      </h6>
                    </div>
                  ))
                )}

                {/* <div style={{ gridColumnStart: 1 }}>One</div>
              <div>Two</div>
              <div style={{ width: '90vw' }}>Three</div>
              <div>Four</div>
              <div>Five</div>
              <div>One</div>
              <div>Two</div>
              <div>Three</div>
              <div>Four</div>
              <div>Five</div>
              <div>One</div>
              <div>Two</div>
              <div>Three</div>
              <div>Four</div>
              <div>Five</div> */}
              </div>
            </Row>
            {/* </Card> */}
          </Row>
        </>
      )}
    </div>
  );
};

export default Inflations;

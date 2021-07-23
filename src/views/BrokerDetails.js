import React, { useRef, useState, useEffect } from 'react';
import { Button, Col, Input, Label, Row, Table } from 'reactstrap';
import axios from 'axios';
import NotificationAlert from 'react-notification-alert';
import Spinner from '../components/Spinner/Spinner';
import Config from '../config.json';
import { countries } from 'views/pages/countries';
import { currencies } from 'views/pages/currencies';
import ImageUpload from 'components/CustomUpload/ImageUpload';
import { useParams } from 'react-router-dom';
// import { format, parse } from 'date-fns';
import { currencyFormat } from '../helpers/functions';
import moment from 'moment';

const BrokerDetails = () => {
  const [name, setName] = useState('');
  // eslint-disable-next-line
  const [file, setFile] = useState('');
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const [country, setCountry] = useState(login.country);
  const [currency, setCurrency] = useState(login.currency);
  const [isLoading, setIsLoading] = useState(true);
  const [investments, setinvestments] = useState([]);
  const [filePath, setFilePath] = useState('');
  const [isArchived, setIsArchived] = useState(false);

  const { id } = useParams();
  useEffect(() => {
    const getBrokerDetails = async () => {
      if (id !== ':id') {
        const config = {
          headers: {
            Authorization: `Bearer ${login.token}`,
          },
        };
        const investmentsFromApi = await axios.get(
          `${Config.SERVER_ADDRESS}/api/investments/all`,
          config
        );
        setinvestments(investmentsFromApi.data);
        setIsLoading(true);

        const brokerFromTheAPI = await axios.get(
          `${Config.SERVER_ADDRESS}/api/brokers/${id}`,
          config
        );
        console.log(brokerFromTheAPI);
        setName(brokerFromTheAPI.data['broker'].name);
        setCountry(brokerFromTheAPI.data['broker'].country);
        setCurrency(brokerFromTheAPI.data['broker'].currency);
        setFilePath(brokerFromTheAPI.data['broker'].filepath);
        setIsArchived(brokerFromTheAPI.data['broker'].isArchived);
        if (brokerFromTheAPI.data['hasLoaded']) {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    getBrokerDetails();
    // eslint-disable-next-line
  }, [id]);

  const fetchCurrency = async (code) => {
    const response = await fetch(
      `https://restcountries.eu/rest/v2/alpha/${code}`
    );
    const res = await response.json();
    setCurrency(res.currencies[0].code);
  };

  const handleSave = () => {
    const fileFromTheComponent = imageRef.current.handleSubmit();
    setFile(fileFromTheComponent);
    uploadFileHandler(fileFromTheComponent);
  };

  const uploadFileHandler = async (image) => {
    if (image) {
      const formData = new FormData();
      formData.append('image', image);
      try {
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
            await axios
              .post(
                `${Config.SERVER_ADDRESS}/api/brokers/`,
                {
                  name,
                  country,
                  currency,
                  filepath,
                },
                config
              )
              .then((res) => {
                notify('Successfully registered broker');
              })
              .catch((error) =>
                notify(
                  error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
                  'danger'
                )
              );
          });
      } catch (error) {
        console.error(error);
        notify(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          'danger'
        );
      }
    } else {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${login.token}`,
        },
      };
      await axios
        .post(
          `${Config.SERVER_ADDRESS}/api/brokers/`,
          {
            name,
            country,
            currency,
          },
          config
        )
        .then((res) => {
          notify('Successfully registered broker');
        })
        .catch((error) =>
          notify(
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
            'danger'
          )
        );
    }
  };
  const imageRef = useRef(null);
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
            <Row className='justify-content-center'>
              <div
                style={{
                  background: `url(${Config.SERVER_ADDRESS}${filePath}) no-repeat center center / contain `,
                  maxWidth: '700px',
                  minWidth: '500px',
                  minHeight: '120px',
                }}
                alt={name}
              />
            </Row>
            <Row>
              <Col md='12'>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px',
                  }}
                >
                  <h1 style={{ marginBottom: '0' }}>
                    <i className='far fa-handshake'></i> {name}
                  </h1>
                </div>
                <Col md='10' className='mx-auto'>
                  <Row style={{ marginBottom: '10px' }}>
                    <Col md='6' style={{ paddingRight: '0' }}>
                      <Label>Name</Label>
                      <Input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ backgroundColor: '#2b3553' }}
                      />
                    </Col>
                    <Col md='3' style={{ paddingRight: '0' }}>
                      <Label>Country</Label>
                      <Input
                        style={{ backgroundColor: '#2b3553' }}
                        value={country}
                        type='select'
                        onChange={(e) => {
                          setCountry(e.target.value);
                          fetchCurrency(e.target[e.target.selectedIndex].id);
                        }}
                      >
                        <option value='' disabled={true}>
                          Select an option
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
                    <Col md='3' style={{ paddingRight: '0' }}>
                      <Label>Currency</Label>
                      <Input
                        style={{ backgroundColor: '#2b3553' }}
                        type='select'
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                      >
                        <option value='' disabled={true}>
                          Select an option
                        </option>
                        {Object.entries(currencies).map((currency) => (
                          <option key={currency[0]} value={currency[0]}>
                            {currency[1].name}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </Row>
                  {id !== ':id' ? (
                    <Table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Rate</th>
                          <th>Investment date</th>
                          <th>Due date</th>
                          <th style={{ textAlign: 'right' }}>Initial amount</th>
                          <th style={{ textAlign: 'right' }}>Accrued income</th>
                        </tr>
                      </thead>
                      <tbody>
                        {investments
                          .filter(
                            (investment) =>
                              investment.broker !== null &&
                              investment.broker._id === id
                          )
                          .map((investment) => (
                            <tr key={investment._id}>
                              <td>{investment.name}</td>
                              <td>{investment.type}</td>
                              <td>{investment.rate}</td>
                              <td>
                                {moment(investment.investment_date).format(
                                  'DD/MM/YYYY'
                                )}
                              </td>
                              <td>
                                {moment(investment.due_date).format(
                                  'DD/MM/YYYY'
                                )}
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                {currencyFormat(investment.initial_amount)}
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                {currencyFormat(investment.accrued_income)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                      <tfoot>
                        {!isArchived ? (
                          <tr>
                            <td>Total not archived</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style={{ textAlign: 'right' }}>
                              {currencyFormat(
                                investments
                                  .filter(
                                    (investment) =>
                                      investment.broker !== null &&
                                      investment.broker._id === id &&
                                      investment.isArchived === false
                                  )
                                  .reduce(
                                    (acc, curr) => acc + curr.initial_amount,
                                    0
                                  )
                              )}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {currencyFormat(
                                investments
                                  .filter(
                                    (investment) =>
                                      investment.broker !== null &&
                                      investment.broker._id === id &&
                                      investment.isArchived === false
                                  )
                                  .reduce(
                                    (acc, curr) => acc + curr.accrued_income,
                                    0
                                  )
                              )}
                            </td>
                          </tr>
                        ) : null}

                        <tr>
                          <td>Total Archived</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td style={{ textAlign: 'right' }}>
                            {currencyFormat(
                              investments
                                .filter(
                                  (investment) =>
                                    investment.broker !== null &&
                                    investment.broker._id === id &&
                                    investment.isArchived === true
                                )
                                .reduce(
                                  (acc, curr) => acc + curr.initial_amount,
                                  0
                                )
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {currencyFormat(
                              investments
                                .filter(
                                  (investment) =>
                                    investment.broker !== null &&
                                    investment.broker._id === id &&
                                    investment.isArchived === true
                                )
                                .reduce(
                                  (acc, curr) => acc + curr.accrued_income,
                                  0
                                )
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    </Table>
                  ) : (
                    <Table>
                      <Row>
                        <Col
                          className='row flex-column align-items-center mx-auto mt-3'
                          md='3'
                          sm='4'
                        >
                          <Label>Broker IMage</Label>
                          <ImageUpload
                            addBtnColor='primary'
                            changeBtnColor='primary'
                            removeBtnColor='danger'
                            addBtnClasses='btn-round'
                            changeBtnClasses='btn-round'
                            removeBtnClasses='btn-round'
                            ref={imageRef}
                          />
                        </Col>
                      </Row>
                      <div className='row justify-content-center'>
                        <Button
                          className='mx-auto'
                          color='success'
                          onClick={(e) => handleSave()}
                        >
                          Submit
                        </Button>
                      </div>
                    </Table>
                  )}
                </Col>
              </Col>
            </Row>
          </>
        )}
      </div>
    </>
  );
};

export default BrokerDetails;

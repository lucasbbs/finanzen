import React, { useRef, useState } from 'react';
import { Button, Col, Input, Label, Row } from 'reactstrap';
import axios from 'axios';
import NotificationAlert from 'react-notification-alert';
import Spinner from '../components/Spinner/Spinner';
import Config from '../config.json';
import { countries } from 'views/pages/countries';
import { currencies } from 'views/pages/currencies';
import ImageUpload from 'components/CustomUpload/ImageUpload';

const BrokerDetails = () => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [currency, setCurrency] = useState('');
  const [file, setFile] = useState('');
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const fetchCurrency = async (code) => {
    const response = await fetch(
      `https://restcountries.eu/rest/v2/alpha/${code}`
    );
    const res = await response.json();
    setCurrency(res.currencies[0].code);
  };
  const imageRef = useRef(null);

  const handleSave = () => {
    const fileFromTheComponent = imageRef.current.handleSubmit();
    setFile(fileFromTheComponent);
    uploadFileHandler(fileFromTheComponent);
  };

  const uploadFileHandler = async (image) => {
    if (image) {
      const formData = new FormData();
      formData.append('image', image);
      // setUploading(true);
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
                notify('Corretora cadastrada com sucesso');
              })
              .catch((err) => notify(notify(err.response.data, 'danger')));
          });
      } catch (error) {
        console.error(error);
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
          notify('Corretora cadastrada com sucesso');
        })
        .catch((err) => notify(notify(err.response.data, 'danger')));
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
  return (
    <>
      {' '}
      <div className='react-notification-alert-container'>
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div className='content'>
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
                <Col md='3' style={{ paddingRight: '0' }}>
                  <Label>Currency</Label>
                  <Input
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
            </Col>

            {/* {investment['isValid'] ? (
            <>
              <Incomes
                id={id}
                incomesToBeUpdated={investment['invest'].incomes}
                incomes={currentincomes}
                numberPerPage={investmentsPerPage}
                setNumberPerPage={setNumberPerPage}
                setNewIncomes={setNewIncomes}
                setAccruedIncome={setAccruedIncome}
                setIsLoading={setIsLoading}
              />
              <PaginationUI
                incomesPerPage={investmentsPerPage}
                totalIncomes={incomes.length}
                paginate={paginate}
                currentPageNumber={currentPage}
              />
            </>
          ) : (
            <div className='mt-3'>
              <Row className='justify-content-center align-items-center m-80'>
                <Button
                  className='mt-30'
                  color='success'
                  // onClick={() =>
                  //   handleSave({
                  //     name,
                  //     broker,
                  //     type,
                  //     rate,
                  //     indexer,
                  //     investment_date: investmentDate,
                  //     due_date: dueDate,
                  //     initial_amount: reverseFormatNumber(
                  //       initialAmount,
                  //       'pt-BR'
                  //     ),
                  //   })
                  // }
                >
                  Salvar
                </Button>
              </Row>
            </div>
          )} */}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default BrokerDetails;

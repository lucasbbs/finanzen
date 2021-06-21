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
import React, { useState } from 'react';
import axios from 'axios';
import { currencies } from './currencies';
import { countries } from './countries';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Label,
  CardText,
} from 'reactstrap';
import Config from '../../config.json';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import { useHistory } from 'react-router-dom';

const User = () => {
  let history = useHistory();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [match, setMatch] = useState(true);
  const [password, setPassword] = useState(null);
  const [email] = React.useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).email
      : null
  );
  const [alert, setAlert] = useState(null);
  const [source, setsource] = React.useState('');
  const [destination, setdestination] = React.useState('');
  const [sourceState, setsourceState] = React.useState('');
  const [destinationState, setdestinationState] = React.useState('');

  const [isHidden, setIsHidden] = useState(false);
  const [name, setName] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).name
      : null
  );
  const [userId] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))._id
      : null
  );
  // const [email] = useState(JSON.parse(localStorage.getItem('userInfo')).email);
  const [token] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).token
      : null
  );
  const [country, setCountry] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).country
      : null
  );
  const [currency, setCurrency] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).currency
      : null
  );
  // function that verifies if two strings are equal
  const compare = (string1, string2) => {
    if (string1 === string2) {
      return true;
    }
    return false;
  };

  const stateFunctions = {
    setsource: (value) => setsource(value),
    setdestination: (value) => setdestination(value),
    setsourceState: (value) => setsourceState(value),
    setdestinationState: (value) => setdestinationState(value),
  };
  const change = (event, stateName, type, stateNameEqualTo, maxValue) => {
    switch (type) {
      case 'equalTo':
        if (compare(event.target.value, stateNameEqualTo.value)) {
          stateFunctions['set' + stateName + 'State']('has-success');
          stateFunctions['set' + stateNameEqualTo.stateName + 'State'](
            'has-success'
          );
          setMatch(true);
          setPassword(event.target.value);
        } else {
          stateFunctions['set' + stateName + 'State']('has-danger');
          stateFunctions['set' + stateNameEqualTo.stateName + 'State'](
            'has-danger'
          );
          setMatch(false);
        }
        break;

      default:
        break;
    }
    stateFunctions['set' + stateName](event.target.value);
  };
  const fetchCurrency = async (code) => {
    const response = await fetch(
      `https://restcountries.eu/rest/v2/alpha/${code}`
    );
    const res = await response.json();
    setCurrency(res.currencies[0].code);
    // return await response.json();
  };
  const handleSave = async (userObj) => {
    if (!match) {
    } else {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      await axios
        .put(`${Config.SERVER_ADDRESS}/api/users/${userId}`, userObj, config)
        .then((res) => {
          userInfo['country'] = country;
          userInfo['currency'] = currency;
          userInfo['name'] = name;
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          console.log('alterado com sucesso');
        })
        .catch((error) => console.log(error));
    }
  };

  const handleDelete = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    await axios
      .delete(`${Config.SERVER_ADDRESS}/api/users/${userId}`, config)
      .then((res) => {
        successDelete();
        console.log(res);
        localStorage.removeItem('userInfo');
      })
      .catch((err) => console.log(err));
  };

  const successDelete = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: 'block', marginTop: '-100px' }}
        title='Deletado!'
        onConfirm={() => {
          hideAlert();
          history.push('/auth/login');
        }}
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
  const warningWithConfirmAndCancelMessage = () => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block', marginTop: '-100px' }}
        title='Você tem certeza disso?'
        onConfirm={() => {
          try {
            handleDelete();
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
  const hideAlert = () => {
    setAlert(null);
  };
  return (
    <>
      <div className='content'>
        {alert}
        <Row>
          <Col md='12'>
            <Card>
              <CardHeader>
                <h5 className='title'>Edit Profile</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    {/* <Col className='pr-md-1' md='5'>
                      <FormGroup>
                        <label>Company (disabled)</label>
                        <Input
                          // defaultValue='Creative Code Inc.'
                          className='borderColor'
                          disabled
                          type='text'
                        />
                      </FormGroup>
                    </Col> */}
                    <Col md='3' style={{ paddingRight: '0' }}>
                      <FormGroup>
                        <label>Nome</label>
                        <Input
                          value={name}
                          style={{ backgroundColor: '#2b3553' }}
                          onChange={(e) => setName(e.target.value)}
                          className='borderColor'
                          type='text'
                        />
                      </FormGroup>
                    </Col>
                    <Col md='3' style={{ paddingRight: '0' }}>
                      <FormGroup>
                        <label>Endereço de Email</label>
                        <Input
                          style={{
                            backgroundColor: '#2b3553',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }}
                          disabled
                          placeholder='email@email.com'
                          value={email}
                          className='borderColor'
                          type='email'
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {/* <Row>
                    {/* <Col className='pr-md-1' md='6'>
                      <FormGroup>
                        <label>First Name</label>
                        <Input
                          defaultValue='Mike'
                          className='borderColor'
                          type='text'
                        />
                      </FormGroup>
                    </Col> */}
                  {/* <Col className='pl-md-1' md='6'>
                      <FormGroup>
                        <label>Last Name</label>
                        <Input
                          defaultValue='Andrew'
                          className='borderColor'
                          type='text'
                        />
                      </FormGroup>
                    </Col>
                  </Row> */}
                  {/* <Row>
                    <Col md='12'>
                      <FormGroup>
                        <label>Address</label>
                        <Input
                          defaultValue='Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09'
                          placeholder='Home Address'
                          className='borderColor'
                          type='text'
                        />
                      </FormGroup>
                    </Col>
                  </Row> */}
                  <Row>
                    {/* <Col className='pr-md-1' md='4'>
                      <FormGroup>
                        <label>City</label>
                        <Input
                          defaultValue='Minsk'
                          className='borderColor'
                          type='text'
                        />
                      </FormGroup>
                    </Col> */}
                    {/* <Col className='px-md-1' md='4'>
                      <FormGroup>
                        <label>Country</label>
                        <Input
                          defaultValue='Belarus'
                          className='borderColor'
                          type='text'
                        />
                      </FormGroup>
                    </Col>
                    <Col className='pl-md-1' md='4'>
                      <FormGroup>
                        <label>Postal Code</label>
                        <Input
                          placeholder='ZIP Code'
                          className='borderColor'
                          type='number'
                        />
                      </FormGroup>
                    </Col>*/}
                    <Col md='3' style={{ paddingRight: '0' }}>
                      <Label>País</Label>
                      <Input
                        required
                        style={{ backgroundColor: '#2b3553' }}
                        type='select'
                        value={country}
                        onChange={(e) => {
                          setCountry(e.target.value);
                          fetchCurrency(e.target[e.target.selectedIndex].id);
                          setIsHidden(false);
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
                    <Col md='3' hidden={isHidden} style={{ paddingRight: '0' }}>
                      <label>Moeda</label>
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
                          // (country) => console.log(country[1].name)
                          <option key={currency[0]} value={currency[0]}>
                            {currency[1].name}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </Row>
                  {/* <Row>
                    <Col md='8'>
                      <FormGroup>
                        <label>About Me</label>
                        <Input
                          cols='80'
                          className='borderColor'
                          defaultValue="Lamborghini Mercy, Your chick she so thirsty, I'm in
                            that two seat Lambo."
                          placeholder='Here can be your description'
                          rows='4'
                          type='textarea'
                        />
                      </FormGroup>
                    </Col>
                  </Row> */}
                  <Row>
                    <Label sm='2'>Password</Label>
                    <Col sm='2' style={{ paddingRight: '0' }}>
                      <FormGroup className={sourceState}>
                        <Input
                          id='idSource'
                          style={{ backgroundColor: '#2b3553' }}
                          className='borderColor'
                          placeholder='password'
                          type='password'
                          onChange={(e) =>
                            change(e, 'source', 'equalTo', {
                              value: destination,
                              stateName: 'destination',
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col sm='2' style={{ paddingRight: '0' }}>
                      <FormGroup className={destinationState}>
                        <Input
                          id='idDestination'
                          style={{ backgroundColor: '#2b3553' }}
                          className='borderColor'
                          placeholder='confirm password'
                          type='password'
                          onChange={(e) =>
                            change(e, 'destination', 'equalTo', {
                              value: source,
                              stateName: 'source',
                            })
                          }
                        />
                        {destinationState === 'has-danger' ? (
                          <label className='error'>
                            Please enter the same value.
                          </label>
                        ) : null}
                      </FormGroup>
                    </Col>
                    {/* <Col className='label-on-right' tag='label' sm='4'>
                      <code>equalTo="#idSource"</code>
                    </Col> */}
                  </Row>
                </Form>
              </CardBody>
              <CardFooter>
                <Button
                  className='btn-fill'
                  color='primary'
                  type='submit'
                  onClick={() => {
                    handleSave({ name, country, currency, password });
                  }}
                >
                  Salvar
                </Button>
                <Button
                  className='btn-fill'
                  color='danger'
                  type='submit'
                  onClick={() => warningWithConfirmAndCancelMessage()}
                >
                  Excluir perfil
                </Button>
              </CardFooter>
            </Card>
          </Col>
          <Col md='4'>
            <Card className='card-user'>
              <CardBody>
                <CardText />
                <div className='author'>
                  <div className='block block-one' />
                  <div className='block block-two' />
                  <div className='block block-three' />
                  <div className='block block-four' />
                  <a href='#pablo' onClick={(e) => e.preventDefault()}>
                    <img
                      alt='...'
                      className='avatar'
                      src={require('assets/img/emilyz.jpg').default}
                    />
                    <h5 className='title'>Mike Andrew</h5>
                  </a>
                  <p className='description'>Ceo/Co-Founder</p>
                </div>
                <div className='card-description'>
                  Do not be scared of the truth because we need to restart the
                  human foundation in truth And I love you like Kanye loves
                  Kanye I love Rick Owens’ bed design but the back is...
                </div>
              </CardBody>
              <CardFooter>
                <div className='button-container'>
                  <Button className='btn-icon btn-round' color='facebook'>
                    <i className='fab fa-facebook' />
                  </Button>
                  <Button className='btn-icon btn-round' color='twitter'>
                    <i className='fab fa-twitter' />
                  </Button>
                  <Button className='btn-icon btn-round' color='google'>
                    <i className='fab fa-google-plus' />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default User;

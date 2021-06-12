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
} from 'reactstrap';
import Config from '../../config.json';

const User = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const countryListPortuguese = {
    AF: 'Afeganistão',
    AL: 'Albânia',
    DZ: 'Argélia',
    AS: 'Samoa Americana',
    AD: 'Andorra',
    AO: 'Angola',
    AI: 'Anguila',
    AQ: 'Antártica',
    AG: 'Antigua e Barbuda',
    AR: 'Argentina',
    AM: 'Armênia',
    AW: 'Aruba',
    AU: 'Austrália',
    AT: 'Áustria',
    AZ: 'Azerbaijão',
    BS: 'Bahamas',
    BH: 'Bahrain',
    BD: 'Bangladesh',
    BB: 'Barbados',
    BY: 'Belarus',
    BE: 'Bélgica',
    BZ: 'Belize',
    BJ: 'Benin',
    BM: 'Bermudas',
    BT: 'Butão',
    BO: 'Bolívia',
    BA: 'Bósnia e Herzegovina',
    BW: 'Botswana',
    BV: 'Ilha Bouvet',
    BR: 'Brasil',
    IO: 'Território Britânico do Oceano Índico',
    BN: 'Brunei Darussalam',
    BG: 'Bulgária',
    BF: 'Burkina Faso',
    BI: 'Burundi',
    CV: 'Cabo Verde',
    KH: 'Camboja',
    CM: 'Camarões',
    CA: 'Canadá',
    KY: 'Ilhas Cayman',
    CF: 'República Centro-Africana',
    TD: 'Chade',
    CL: 'Chile',
    CN: 'China',
    CX: 'Ilha do Natal',
    CC: 'Ilhas Cocos',
    CO: 'Colômbia',
    KM: 'Comores',
    CD: 'República Democrática do Congo',
    CG: 'República do Congo',
    CK: 'Ilhas Cook',
    CR: 'Costa Rica',
    HR: 'Croácia',
    CU: 'Cuba',
    CW: 'Curaçao',
    CY: 'Chipre',
    CZ: 'Czechia',
    CI: 'Costa do Marfim',
    DK: 'Dinamarca',
    DJ: 'Djibouti',
    DM: 'Dominica',
    DO: 'República Dominicana',
    EC: 'Equador',
    EG: 'Egito',
    SV: 'El Salvador',
    GQ: 'Guiné Equatorial',
    ER: 'Eritreia',
    EE: 'Estônia',
    SZ: 'Eswatini',
    ET: 'Etiópia',
    FK: 'Ilhas Falkland',
    FO: 'Ilhas Faroé',
    FJ: 'Fiji',
    FI: 'Finlândia',
    FR: 'França',
    GF: 'Guiana Francesa',
    PF: 'Polinésia Francesa',
    TF: 'Territórios Franceses do Sul',
    GA: 'Gabão',
    GM: 'Gâmbia',
    GE: 'Georgia',
    DE: 'Alemanha',
    GH: 'Gana',
    GI: 'Gibraltar',
    GR: 'Grécia',
    GL: 'Groenlândia',
    GD: 'Granada',
    GP: 'Guadalupe',
    GU: 'Guam',
    GT: 'Guatemala',
    GG: 'Guernsey',
    GN: 'Guiné',
    GW: 'Guiné-Bissau',
    GY: 'Guiana',
    HT: 'Haiti',
    HM: 'Ilha Heard e Ilhas McDonald',
    VA: 'Santa Sé',
    HN: 'Honduras',
    HK: 'Hong Kong',
    HU: 'Hungria',
    IS: 'Islândia',
    IN: 'Índia',
    ID: 'Indonésia',
    IR: 'Irã',
    IQ: 'Iraque',
    IE: 'Irlanda',
    IM: 'Ilha de Man',
    IL: 'Israel',
    IT: 'Itália',
    JM: 'Jamaica',
    JP: 'Japão',
    JE: 'Jersey',
    JO: 'Jordânia',
    KZ: 'Cazaquistão',
    KE: 'Quênia',
    KI: 'Kiribati',
    KP: 'Coreia do Norte',
    KR: 'Coreia do Sul',
    KW: 'Kuwait',
    KG: 'Quirguistão',
    LA: 'República Democrática Popular do Laos',
    LV: 'Letônia',
    LB: 'Líbano',
    LS: 'Lesoto',
    LR: 'Libéria',
    LY: 'Líbia',
    LI: 'Liechtenstein',
    LT: 'Lituânia',
    LU: 'Luxemburgo',
    MO: 'Macau',
    MG: 'Madagáscar',
    MW: 'Malawi',
    MY: 'Malásia',
    MV: 'Maldivas',
    ML: 'Mali',
    MT: 'Malta',
    MH: 'Ilhas Marshall',
    MQ: 'Martinica',
    MR: 'Mauritânia',
    MU: 'Maurício',
    YT: 'Mayotte',
    MX: 'México',
    FM: 'Micronésia',
    MD: 'Moldávia',
    MC: 'Monaco',
    MN: 'Mongólia',
    ME: 'Montenegro',
    MS: 'Montserrat',
    MA: 'Marrocos',
    MZ: 'Moçambique',
    MM: 'Mianmar',
    NA: 'Namíbia',
    NR: 'Nauru',
    NP: 'Nepal',
    NL: 'Holanda',
    NC: 'Nova Caledônia',
    NZ: 'Nova Zelândia',
    NI: 'Nicarágua',
    NE: 'Níger',
    NG: 'Nigéria',
    NU: 'Niue',
    NF: 'Ilha Norfolk',
    MP: 'Ilhas Marianas do Norte',
    NO: 'Noruega',
    OM: 'Omã',
    PK: 'Paquistão',
    PW: 'Palau',
    PS: 'Palestina',
    PA: 'Panamá',
    PG: 'Papua Nova Guiné',
    PY: 'Paraguai',
    PE: 'Peru',
    PH: 'Filipinas',
    PN: 'Pitcairn',
    PL: 'Polônia',
    PT: 'Portugal',
    PR: 'Porto Rico',
    QA: 'Catar',
    MK: 'República da Macedônia do Norte',
    RO: 'Romênia',
    RU: 'Rússia',
    RW: 'Ruanda',
    RE: 'Reunião',
    BL: 'São Bartolomeu',
    SH: 'Santa Helena, Ascensão e Tristão da Cunha',
    KN: 'São Cristóvão e Neves',
    LC: 'Santa Lúcia',
    MF: 'Saint Martin',
    PM: 'São Pedro e Miquelon',
    VC: 'São Vicente e Granadinas',
    WS: 'Samoa',
    SM: 'San Marino',
    ST: 'São Tomé e Príncipe',
    SA: 'Arábia Saudita',
    SN: 'Senegal',
    RS: 'Sérvia',
    SC: 'Seychelles',
    SL: 'Serra Leoa',
    SG: 'Cingapura',
    SX: 'Sint Maarten',
    SK: 'Eslováquia',
    SI: 'Eslovênia',
    SB: 'Ilhas Salomão',
    SO: 'Somália',
    // XS: 'Somalilândia',
    ZA: 'África do Sul',
    GS: 'Ilhas Geórgia do Sul e Sandwich do Sul',
    SS: 'Sudão do Sul',
    ES: 'Espanha',
    LK: 'Sri Lanka',
    SD: 'Sudão',
    SR: 'Suriname',
    SJ: 'Svalbard e Jan Mayen',
    SE: 'Suécia',
    CH: 'Suíça',
    SY: 'República Árabe da Síria',
    TW: 'Taiwan',
    TJ: 'Tajiquistão',
    TZ: 'Tanzânia',
    TH: 'Tailândia',
    TL: 'Timor-Leste',
    TG: 'Togo',
    TK: 'Tokelau',
    TO: 'Tonga',
    TT: 'Trinidad e Tobago',
    TN: 'Tunísia',
    TR: 'Turquia',
    TM: 'Turcomenistão',
    TC: 'Ilhas Turks e Caicos',
    TV: 'Tuvalu',
    UG: 'Uganda',
    UA: 'Ucrânia',
    AE: 'Emirados Árabes Unidos',
    GB: 'Grã-Bretanha',
    UM: 'Ilhas Menores Distantes dos Estados Unidos',
    US: 'Estados Unidos da América',
    UY: 'Uruguai',
    UZ: 'Uzbequistão',
    VU: 'Vanuatu',
    VE: 'Venezuela',
    VN: 'Viet Nam',
    VG: 'Ilhas Virgens (britânicas)',
    VI: 'Ilhas Virgens (EUA)',
    WF: 'Wallis e Futuna',
    EH: 'Saara Ocidental',
    YE: 'Iémen',
    ZM: 'Zâmbia',
    ZW: 'Zimbábue',
    AX: 'Ilhas Åland',
  };
  const [isHidden, setIsHidden] = useState(false);
  const [name, setName] = useState(
    JSON.parse(localStorage.getItem('userInfo')).name
  );
  const [userId] = useState(JSON.parse(localStorage.getItem('userInfo'))._id);
  const [email] = useState(JSON.parse(localStorage.getItem('userInfo')).email);
  const [token] = useState(JSON.parse(localStorage.getItem('userInfo')).token);
  const [country, setCountry] = useState(
    JSON.parse(localStorage.getItem('userInfo')).country
  );
  const [currency, setCurrency] = useState(
    JSON.parse(localStorage.getItem('userInfo')).currency
  );
  // JSON.parse(localStorage.getItem('userInfo').currency)

  const fetchCurrency = async (code) => {
    const response = await fetch(
      `https://restcountries.eu/rest/v2/alpha/${code}`
    );
    const res = await response.json();
    setCurrency(res.currencies[0].code);
    // return await response.json();
  };
  const handleSave = async (userObj) => {
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
        console.log(res);
      })
      .catch((error) => console.log(error));
  };
  return (
    <>
      <div className='content'>
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
                    <Col className='pr-md-1' md='5'>
                      <FormGroup>
                        <label>Nome</label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className='borderColor'
                          type='text'
                        />
                      </FormGroup>
                    </Col>
                    <Col className='pl-md-1' md='4'>
                      <FormGroup>
                        <label>Endereço de Email</label>
                        <Input
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
                      <label>País</label>
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
                        {Object.entries(countryListPortuguese).map(
                          (country) => (
                            <option
                              key={country[0]}
                              id={country[0]}
                              value={country[0]}
                            >
                              {country[1]}
                            </option>
                          )
                        )}
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
                </Form>
              </CardBody>
              <CardFooter>
                <Button
                  className='btn-fill'
                  color='primary'
                  type='submit'
                  onClick={() => {
                    console.log({ name, country, currency });
                    handleSave({ name, country, currency });
                  }}
                >
                  Salvar
                </Button>
              </CardFooter>
            </Card>
          </Col>
          {/* <Col md='4'>
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
          </Col> */}
        </Row>
      </div>
    </>
  );
};

export default User;

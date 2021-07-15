import axios from 'axios';
import { addDays, format, parse } from 'date-fns';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, Col, Input, Row } from 'reactstrap';
import Config from '../config.json';
const Inflations = () => {
  const [selectedInflation, setSelectedInflation] = useState([]);
  const [inflations, setInflations] = useState([]);
  useEffect(() => {
    const getInflations = async () => {
      const response = await axios.get(
        `${Config.SERVER_ADDRESS}/api/inflations`
      );
      setInflations(response.data);
    };
    getInflations();
  }, []);

  const setSelection = (e) => {
    setSelectedInflation(
      inflations.find((inflation) => inflation.alpha2Code === e.target.value)
        .values
    );
  };
  return (
    <div className='content'>
      <Row className='justify-content-center align-items-center ml-2 mt-1 mr-2 '>
        {/* <Card style={{ position: 'relative' }}> */}
        <Col md='6'>
          <h1>Inflations Editor</h1>
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
                <option key={inflation.alpha2Code} value={inflation.alpha2Code}>
                  {inflation['Country Name']}
                </option>
              ))}
          </Input>
        </Col>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(13, 1fr)',
          }}
        >
          <div style={{ width: '60px' }}></div>
          <div style={{ width: '130px' }}>janeiro</div>
          <div style={{ width: '130px' }}>fevereiro</div>
          <div style={{ width: '130px' }}>março</div>
          <div style={{ width: '130px' }}>abril</div>
          <div style={{ width: '130px' }}>maio</div>
          <div style={{ width: '130px' }}>junho</div>
          <div style={{ width: '130px' }}>julho</div>
          <div style={{ width: '130px' }}>agosto</div>
          <div style={{ width: '130px' }}>setembro</div>
          <div style={{ width: '130px' }}>outubro</div>
          <div style={{ width: '130px' }}>novembro</div>
          <div style={{ width: '130px' }}>dezembro</div>
        </div>
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
                    ).getMonth() <
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
                .fill(1)
                .map((inflation, index) => (
                  <div style={{ height: '44px', width: '60px' }}>
                    {addDays(
                      new Date(Object.keys(selectedInflation[0])),
                      1
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
                    ? addDays(
                        new Date(Object.keys(selectedInflation[0])),
                        1
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
                id={
                  selectedInflation.length !== 0
                    ? Object.keys(selectedInflation[0])
                    : null
                }
              >
                {selectedInflation.length !== 0
                  ? Object.values(selectedInflation[0])
                  : null}
              </h6>
            </div>
            {selectedInflation.slice(1).map((inflation) =>
              Object.entries(inflation).map((entry) => (
                <div style={{ width: '130px' }}>
                  <h6>
                    {format(
                      parse(entry[0], 'yyyy-MM-dd', new Date()),
                      'dd/MM/yyyy'
                    )}
                  </h6>
                  <h6 id={entry[0]}> {entry[1]}</h6>
                </div>
              ))
            )}

            {/* <div style={{ gridColumnStart: 1 }}>One</div>
              <div>Two</div>
              <div style={{ width: '90px' }}>Three</div>
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
    </div>
  );
};

export default Inflations;

import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Col, Table } from 'reactstrap';
import { getDataForTheTopInvestmentsTable } from '../../helpers/functions.js';
import { currencyFormat } from '../../helpers/functions';
import MyTooltip from '../../components/Tooltip/MyTooltip';

const TableTopInvestments = ({ investments }) => {
  const [tableTopInvestmentsMonth, setTableTopInvestmentsMonth] = useState([]);

  useEffect(() => {
    setTableTopInvestmentsMonth(getDataForTheTopInvestmentsTable(investments));
  }, [investments]);

  console.log(tableTopInvestmentsMonth);
  return (
    <Col lg='12' md='12'>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Top Investments</CardTitle>
        </CardHeader>
        <CardBody style={{ overflow: 'hidden' }}>
          <Table className='tablesorter'>
            <thead className='text-primary'>
              <tr>
                <th
                  style={{
                    maxWidth: '350px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    display: 'inline-block',
                    textOverflow: 'ellipsis',
                    minWidth: '300px',
                  }}
                >
                  Nome
                </th>
                <th
                  style={{
                    maxWidth: '300px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    display: 'inline-block',
                    textOverflow: 'ellipsis',
                    minWidth: '280px',
                    textAlign: 'center',
                  }}
                >
                  Percentual
                </th>
                <th
                  style={{
                    maxWidth: '300px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    display: 'inline-block',
                    textOverflow: 'ellipsis',
                    minWidth: '180px',
                    textAlign: 'right',
                  }}
                >
                  Montante Acumulado
                </th>
              </tr>
            </thead>
            <tbody>
              {tableTopInvestmentsMonth.map((invest) => (
                <tr key={invest[0]}>
                  <td
                    style={{
                      maxWidth: '300px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      display: 'inline-block',
                      textOverflow: 'ellipsis',
                      minWidth: '300px',
                    }}
                  >
                    <span id={`Tooltip-${invest[0]}`}>
                      {invest[1]}
                      <MyTooltip
                        placement='left'
                        target={`Tooltip-${invest[0]}`}
                      >
                        {invest[1]}
                        <br />
                      </MyTooltip>
                    </span>
                  </td>
                  <td
                    style={{
                      maxWidth: '350px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      display: 'inline-block',
                      textOverflow: 'ellipsis',
                      minWidth: '280px',
                      textAlign: 'center',
                    }}
                  >
                    {invest[2].toLocaleString('pt-br', {
                      style: 'percent',
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    style={{
                      maxWidth: '300px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      display: 'inline-block',
                      textOverflow: 'ellipsis',
                      minWidth: '180px',
                      textAlign: 'right',
                    }}
                  >
                    {currencyFormat(invest[3], invest[4])}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Col>
  );
};

export default TableTopInvestments;

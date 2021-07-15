import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Input,
  Table,
} from 'reactstrap';
import { getDataForTheTopInvestmentsTable } from '../../helpers/functions.js';
import { currencyFormat } from '../../helpers/functions';
import MyTooltip from '../../components/Tooltip/MyTooltip';
import { setDate } from 'date-fns';
import { Link } from 'react-router-dom';

const TableTopInvestments = ({ investments, date, setDate }) => {
  const [tableTopInvestmentsMonth, setTableTopInvestmentsMonth] = useState([]);
  useEffect(() => {
    // prettier-ignore
    setTableTopInvestmentsMonth(getDataForTheTopInvestmentsTable(investments, date));
  }, [investments, date]);

  return (
    <Col lg='12' md='12'>
      <Card>
        <CardHeader className='row'>
          <Col md='6'>
            <CardTitle tag='h4'>Top Investments</CardTitle>
          </Col>
          <Col md='6' className='row align-items-center'>
            <Col md='3'>
              <span style={{ fontSize: '12.5px' }}>Select a date</span>
            </Col>
            <Col md='9'>
              <Input
                type='month'
                value={date.slice(0, 7)}
                onChange={(e) => setDate(e.target.value)}
              />
            </Col>
          </Col>
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
                  Name
                </th>
                <th
                  style={{
                    maxWidth: '300px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    display: 'inline-block',
                    textOverflow: 'ellipsis',
                    minWidth: '140px',
                    textAlign: 'center',
                  }}
                >
                  Income
                </th>
                <th
                  style={{
                    maxWidth: '300px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    display: 'inline-block',
                    textOverflow: 'ellipsis',
                    minWidth: '140px',
                    textAlign: 'center',
                  }}
                >
                  Rate
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
                  Accumulated Amount
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
                    <Link to={`/admin/investment/${invest[0]}`}>
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
                    </Link>
                  </td>
                  <td
                    style={{
                      maxWidth: '350px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      display: 'inline-block',
                      textOverflow: 'ellipsis',
                      minWidth: '140px',
                      textAlign: 'center',
                    }}
                  >
                    {currencyFormat(invest[5], invest[4])}
                  </td>
                  <td
                    style={{
                      maxWidth: '350px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      display: 'inline-block',
                      textOverflow: 'ellipsis',
                      minWidth: '140px',
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

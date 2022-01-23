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
import React from 'react';
import classNames from 'classnames';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Button,
} from 'reactstrap';

import ReactTable from 'components/ReactTable/ReactTable.js';
import MyTooltip from 'components/Tooltip/MyTooltip';

const dataTable = [
  [
    'LCI (Inter) 7445146 (LCI DI 360 - 110% do CDI - vencimento: 04/10/2021)',
    'Inter',
    'LCI',
    '110%',
    'CDI',
    '06/10/2020',
    '03/10/2021',
    'R$ 10.000,00',
    'R$ 169,18',
  ],
  [
    'LCI 12283631 (Inter) (LCI 98% do CDI - vencimento 17/08/2021)',
    'Inter',
    'LCI',
    '98%',
    'CDI',
    '17/02/2021',
    '16/08/2021',
    'R$ 173,73',
    'R$ 0,97',
  ],
  [
    'LCI (Inter) (IPCA + 3,71% - vencimento: 13/03/2026)',
    'Inter',
    'LCI',
    '3,71%',
    'IPCA',
    '15/03/2021',
    '12/03/2026',
    'R$ 572,21',
    'R$ 1,60',
  ],
  [
    'LCI 7445209 (Inter)(LCI DI 360 - 110% do CDI - vencimento: 04/10/2021)',
    'Inter',
    'LCI',
    '110%',
    'CDI',
    '06/10/2020',
    '03/10/2021',
    'R$ 40.000,00',
    'R$ 556,88',
  ],
  [
    'LCI (Inter) (LCI IPCA - 3,37% + IPCA - vencimento:23/03/2022',
    'Inter',
    'LCI',
    '3,37%',
    'IPCA',
    '23/04/2020',
    '22/03/2022',
    'R$ 3.380,41',
    'R$ 289,87',
  ],
  [
    'LCI 1848240 (Inter) IPCA Final 3 anos - 3,64% + IPCA - vencimento: 25/05/2022',
    'Inter',
    'LCI',
    '3,64%',
    'IPCA',
    '20/05/2019',
    '24/05/2022',
    'R$ 7.400,00',
    'R$ 1.294,83',
  ],
  [
    'LCA Pré BTG Pactual (Inter) (6,35% - vencimento: 09/12/2024)',
    'Inter',
    'LCA',
    '6,35%',
    'PRE',
    '07/01/2021',
    '08/12/2024',
    'R$ 1.001,22',
    'R$ 22,01',
  ],
  [
    'CDB Pos Liquidez Diária 3786434 (Inter)',
    'Inter',
    'CDB',
    '102%',
    'CDI',
    '06/01/2020',
    '30/01/2022',
    'R$ 15.000,00',
    'R$ 727,58',
  ],
  [
    'CRA Jalles Machado E21 (Inter) (4,4% + IPCA) - vencimento: 19/02/2026',
    'Inter',
    'CRA',
    '4,40%',
    'IPCA',
    '12/10/2020',
    '18/02/2026',
    'R$ 4.143,72',
    'R$ 180,86',
  ],
  [
    'LCI (Inter) (LCI IPCA - 5.67% + IPCA - vencimento: 09/06/2022',
    'Inter',
    'LCI',
    '5,67%',
    'IPCA',
    '06/04/2020',
    '08/06/2022',
    'R$ 2.591,71',
    'R$ 387,28',
  ],
  [
    'LCI 1656032 (Inter) - (LCI IPCA FINAL 3 ANOS - 3,77%+IPCA - vencimento: 26/04/2022)',
    'Inter',
    'LCI',
    '3,77%',
    'IPCA',
    '21/04/2019',
    '25/04/2022',
    'R$ 14.432,77',
    'R$ 2.718,30',
  ],
  [
    'LCI 412277 (Inter) - (LCI IPCA FINAL 5 ANOS - 5,47 + IPCA - vencimento: 27/06/2022)',
    'Inter',
    'LCI',
    '5,47%',
    'IPCA',
    '26/06/2017',
    '26/06/2022',
    'R$ 3.000,00',
    'R$ 1.390,70',
  ],
  [
    'LCI 1334865 (Inter) - (LCI IPCA FINAL 5 ANOS - 4,75% + IPCA - vencimento: 21/02/2024)',
    'Inter',
    'LCI',
    '4,75%',
    'IPCA',
    '20/02/2019',
    '20/02/2024',
    'R$ 34.450,00',
    'R$ 7.916,71',
  ],
  [
    'LCI 589271 (Inter) - (LCI IPCA FINAL 5 ANOS - 5,36% + IPCA - vencimento: 19/12/2022)',
    'Inter',
    'LCI',
    '5,36%',
    'IPCA',
    '17/12/2017',
    '18/12/2022',
    'R$ 8.200,00',
    'R$ 3.203,26',
  ],
  [
    'Debênture (Inter) LAMEA6 - 5% + IPVA - vencimento: 15/10/2030)',
    'Inter',
    'Debênture',
    '5,00%',
    'IPCA',
    '28/01/2021',
    '14/10/2030',
    'R$ 4.989,52',
    'R$ 114,73',
  ],
  [
    'Debênture Incentivada (Inter) (IGSN15 - 4,85% + IPCA - vencimento:15/07/2034)',
    'Inter',
    'Debênture',
    '4,85%',
    'IPCA',
    '02/09/2020',
    '14/07/2034',
    'R$ 3.000,00',
    'R$ 184,59',
  ],
  [
    'Debênture Incentivada (Inter) (IGSN15 - 4,92% + IPCA - vencimento:15/07/2034)',
    'Inter',
    'Debênture',
    '4,92%',
    'IPCA',
    '27/09/2020',
    '14/07/2034',
    'R$ 15.000,00',
    'R$ 929,74',
  ],
  [
    'Debênture Incentivada (Inter) (IGSN15 - 5,00% + IPCA - vencimento:15/07/2034)',
    'Inter',
    'Debênture',
    '5,00%',
    'IPCA',
    '25/11/2020',
    '14/07/2034',
    'R$ 1.000,00',
    'R$ 38,62',
  ],
  [
    'Debênture Incentivada (Inter) (IGSN15 - 5,03% + IPCA - vencimento:15/07/2034)',
    'Inter',
    'Debênture',
    '5,03%',
    'IPCA',
    '06/10/2020',
    '14/07/2034',
    'R$ 27.000,00',
    'R$ 1.259,86',
  ],
  [
    'Debênture Incentivada (Inter) (IGSN15 - 4,95% + IPCA - vencimento:15/07/2034)',
    'Inter',
    'Debênture',
    '4,95%',
    'IPCA',
    '21/09/2020',
    '14/07/2034',
    'R$ 4.000,00',
    'R$ 216,79',
  ],
  [
    'Debênture Incentivada (Inter) (CMGD27 - 4,77% + IPCA - vencimento: 15/06/2026)',
    'Inter',
    'Debênture',
    '4,77%',
    'IPCA',
    '20/05/2020',
    '14/06/2026',
    'R$ 3.019,59',
    'R$ 280,52',
  ],
  [
    'Debênture Incentivada (Inter) (BRKP28 - 4,40% + IPCA - vencimento:15/09/2034)))',
    'Inter',
    'Debênture',
    '4,40%',
    'IPCA',
    '17/02/2021',
    '14/09/2034',
    'R$ 21.000,00',
    'R$ 301,59',
  ],
  [
    'Debênture Incentivada (Inter) (BRKP28 - IPCA +4,5% - vencimento: 15/09/2034) )',
    'Inter',
    'Debênture',
    '4,50%',
    'IPCA',
    '28/02/2021',
    '14/09/2034',
    'R$ 2.000,00',
    'R$ 14,45',
  ],
  [
    'CDB (BANCO BMG S A) - (CDB DI 1800 - 7,25% + IPCA - vencimento: 25/07/2022)',
    'Ativa',
    'CDB',
    '7,25%',
    'IPCA',
    '24/07/2017',
    '24/07/2022',
    'R$ 5.000,00',
    'R$ 2.731,15',
  ],
  [
    'CDB (BANCO MODAL S.A) - (CDB DI 1080 - 118,2% do CDI - vencimento: 30/05/2022)',
    'Ativa',
    'CDB',
    '118,20%',
    'CDI',
    '22/06/2017',
    '29/05/2022',
    'R$ 30.000,00',
    'R$ 4.484,47',
  ],
  [
    'Debênture Incentivada (Ativa) (UTPS21 - 5,75 + IPCA - vencimento: 15/10/2036)',
    'Ativa',
    'Debênture',
    '5,75%',
    'IPCA',
    '15/11/2020',
    '14/10/2026',
    'R$ 40.000,00',
    'R$ 1.663,00',
  ],
  [
    'CDB (Easynvest) (Banco Máxima) IPCA + 5,30% - vencimento: 16/05/2022',
    'Easynvest',
    'CDB',
    '5,30%',
    'IPCA',
    '14/05/2019',
    '15/05/2022',
    'R$ 8.283,00',
    'R$ 1.784,92',
  ],
];

const ReactTables = () => {
  const [data, setData] = React.useState(
    dataTable.map((prop, key) => {
      return {
        id: key,
        name: (
          <>
            <span key={`Tooltip${key}`} id={`Tooltip${key}`}>
              {prop[0]}
              <MyTooltip placement='left' target={`Tooltip${key}`}>
                {prop[0]}
                <br />
              </MyTooltip>
            </span>
          </>
        ),
        broker: prop[1],
        type: prop[2],
        rate: prop[3],
        indexer: prop[4],
        investment_date: prop[5],
        due_date: prop[6],
        initial_amount: prop[7],
        accrued_income: prop[8],
        actions: (
          // we've added some custom button actions
          <div className='actions-right'>
            {/* use this button to add a like kind of action */}
            <Button
              onClick={() => {
                let obj = data.find((o) => o.id === key);
                alert(
                  "You've clicked LIKE button on \n{ \nName: " +
                    obj.name +
                    ', \nposition: ' +
                    obj.position +
                    ', \noffice: ' +
                    obj.office +
                    ', \nage: ' +
                    obj.age +
                    '\n}.'
                );
              }}
              color='info'
              size='sm'
              className={classNames('btn-icon btn-link like', {
                'btn-neutral': key < 5,
              })}
            >
              <i className='tim-icons icon-heart-2' />
            </Button>{' '}
            {/* use this button to add a edit kind of action */}
            <Button
              onClick={() => {
                let obj = data.find((o) => o.id === key);
                alert(
                  "You've clicked EDIT button on \n{ \nName: " +
                    obj.name +
                    ', \nposition: ' +
                    obj.position +
                    ', \noffice: ' +
                    obj.office +
                    ', \nage: ' +
                    obj.age +
                    '\n}.'
                );
              }}
              color='warning'
              size='sm'
              className={classNames('btn-icon btn-link like', {
                'btn-neutral': key < 5,
              })}
            >
              <i className='tim-icons icon-pencil' />
            </Button>{' '}
            {/* use this button to remove the data row */}
            <Button
              onClick={() => {
                var newdata = data;
                newdata.find((o, i) => {
                  if (o.id === key) {
                    // here you should add some custom code so you can delete the data
                    // from this component and from your server as well
                    data.splice(i, 1);
                    // console.log(data);
                    return true;
                  }
                  return false;
                });
                setData(newdata);
              }}
              color='danger'
              size='sm'
              className={classNames('btn-icon btn-link like', {
                'btn-neutral': key < 5,
              })}
            >
              <i className='tim-icons icon-simple-remove' />
            </Button>{' '}
          </div>
        ),
      };
    })
  );
  return (
    <>
      <div className='content'>
        <Col md={8} className='ml-auto mr-auto'>
          <h2 className='text-center'>Investments</h2>
          {/* <p className='text-center'>
            A powerful react plugin handcrafted by our friends from{' '}
            <a
              href='https://react-table.js.org/#/story/readme'
              target='_blank'
              rel='noopener noreferrer'
            >
              react-table
            </a>
            . It is a highly flexible tool, based upon the foundations of
            progressive enhancement on which you can add advanced interaction
            controls. Please check out their{' '}
            <a
              href='https://react-table.js.org/#/story/readme'
              target='_blank'
              rel='noopener noreferrer'
            >
              full documentation.
            </a>
          </p> */}
        </Col>
        <Row className='mt-5'>
          <Col xs={12} md={12}>
            <Card>
              <CardHeader>
                <CardTitle tag='h4'>React Table</CardTitle>
              </CardHeader>
              <CardBody>
                <ReactTable
                  data={data}
                  filterable
                  resizable={true}
                  columns={[
                    {
                      Header: 'Investment',
                      accessor: 'name',
                    },
                    {
                      Header: 'Broker',
                      accessor: 'broker',
                    },
                    {
                      Header: 'Type',
                      accessor: 'type',
                    },
                    {
                      Header: 'Rate',
                      accessor: 'rate',
                    },
                    { Header: 'Indexer', accessor: 'indexer' },
                    { Header: 'Investment Date', accessor: 'investment_date' },
                    { Header: 'Due Date', accessor: 'due_date' },
                    { Header: 'Initial Amount', accessor: 'initial_amount' },
                    { Header: 'Accrued Income', accessor: 'accrued_income' },
                    {
                      Header: 'Actions',
                      accessor: 'actions',
                      sortable: false,
                      filterable: false,
                    },
                  ]}
                  defaultPageSize={10}
                  showPaginationTop
                  showPaginationBottom={false}
                  className='-striped -highlight'
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ReactTables;

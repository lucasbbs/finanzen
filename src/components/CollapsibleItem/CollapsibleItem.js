import PaginationUI from 'components/Pagination/Pagination';
import { format } from 'date-fns';
import { currencyFormat, ISODateFormat } from 'helpers/functions';
import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Collapse, Table } from 'reactstrap';

const CollapsibleItem = ({
  id,
  name,
  currency,
  initialAmmount,
  balance,
  icon,
  transactions,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statementsPerPage] = useState(3);
  const [
    transactionsForTheComponent,
    setTransactionsForTheComponent,
  ] = useState([]);
  useEffect(() => {
    const newObjTransaction = {};
    newObjTransaction['_id'] = 'initialEvent';
    newObjTransaction['type'] = 'Initial Amount';
    newObjTransaction['category'] = {
      _id: 'Initial Category',
      name: 'Initial Deposit',
      icon: { Number: 1273 },
    };
    newObjTransaction['observation'] = 'Initial deposit made';
    newObjTransaction['ammount'] = initialAmmount;

    setTransactionsForTheComponent([newObjTransaction, ...transactions]);
  }, [initialAmmount, transactions]);
  const [openedCollapse, setOpenedCollapse] = useState(false);
  const type = {
    Revenue: 'plus',
    Expense: 'minus',
    Transfer: 'transfer',
    'Initial Amount': 'start',
  };
  const typeColor = {
    Revenue: '#1a821a',
    Expense: '#ce2033',
    Transfer: '#0084D9',
    'Initial Amount': '#F0E68C',
  };

  const indexOfLastStatement = currentPage * statementsPerPage;

  const indexOfFirstPost = indexOfLastStatement - statementsPerPage;

  const currentStatements = transactionsForTheComponent.slice(
    indexOfFirstPost,
    indexOfLastStatement
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <Card className='card-plain'>
      <CardHeader role='tab'>
        <a
          id='0'
          aria-expanded={openedCollapse}
          href='#finanzen'
          data-parent='#accordion'
          data-toggle='collapse'
          onClick={(e) => {
            e.preventDefault();
            setOpenedCollapse(!openedCollapse);
          }}
        >
          <div className='col row justify-content-between align-items-center'>
            <div className='row align-items-center'>
              <span className='mx-2' style={{ fontSize: '35px' }}>
                <i
                  style={{ float: 'none' }}
                  className={`icomoon-${icon.Number}`}
                ></i>
              </span>
              <div className='col row flex-column'>
                <span>{[name, currency].join(', ')}</span>
                <small>
                  Balance: {currencyFormat(initialAmmount + balance, currency)}
                </small>
              </div>
            </div>
            <i className='tim-icons icon-minimal-down' />
          </div>
        </a>
      </CardHeader>
      <Collapse role='tabpanel' isOpen={openedCollapse}>
        <CardBody style={{ padding: 0 }}>
          <Table>
            <colgroup>
              <col span='1' style={{ width: '15%' }} />
            </colgroup>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Type</th>
                <th style={{ textAlign: 'center' }}>Date</th>
                <th style={{ textAlign: 'center' }}>Category</th>
                <th style={{ textAlign: 'center' }}>Observation</th>
                <th style={{ textAlign: 'center' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentStatements.map((trans) => (
                <tr id={trans._id} key={trans._id}>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '45px',
                        lineHeight: '45px',
                        color: typeColor[trans.type],
                      }}
                    >
                      {<i className={`icomoon-${type[trans.type]}`} />}
                    </span>
                    <br />
                    <span>
                      {trans.type === 'Transfer'
                        ? trans.dueToAccount._id === id
                          ? 'Outgoing transfer'
                          : 'Incoming transfer'
                        : trans.type}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {trans.date
                      ? format(ISODateFormat(trans.date), 'dd/MM/yy')
                      : null}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        color: 'var(--primary)',
                        display: 'inline-block',
                        fontSize: '45px',
                        backgroundColor: 'black',
                        lineHeight: '45px',
                        height: '65px',
                        width: '65px',
                        borderRadius: '50%',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '60px',
                        }}
                      >
                        {trans.type !== 'Transfer' ? (
                          <i
                            className={`icomoon-${trans?.category?.icon?.Number}`}
                          />
                        ) : trans.dueToAccount._id === id ? (
                          <i
                            className={`icomoon-${trans.dueFromAccount.icon.Number}`}
                          />
                        ) : (
                          <i
                            className={`icomoon-${trans.dueToAccount.icon.Number}`}
                          />
                        )}
                      </div>
                    </span>
                    <br />
                    <span>
                      {trans.type !== 'Transfer'
                        ? trans.category.name
                        : trans.dueToAccount._id === id
                        ? trans.dueFromAccount.name
                        : trans.dueToAccount.name}
                    </span>
                  </td>

                  <td>{trans.observation}</td>
                  <td>
                    {currencyFormat(
                      id !== trans.dueToAccount?._id &&
                        trans.type === 'Transfer'
                        ? trans.ammount * trans.exchangeRate
                        : trans.ammount,
                      currency
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className='row justify-content-center'>
            <PaginationUI
              incomesPerPage={statementsPerPage}
              totalIncomes={transactionsForTheComponent.length}
              paginate={paginate}
              currentPageNumber={currentPage}
            />
          </div>
        </CardBody>
      </Collapse>
    </Card>
  );
};

export default CollapsibleItem;

import { currencyFormat } from 'helpers/functions';
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
  const [openedCollapse, setopenedCollapse] = useState(false);
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
            setopenedCollapse(!openedCollapse);
          }}
        >
          {[name, currency].join(', ')}

          <i className='tim-icons icon-minimal-down' />
        </a>
      </CardHeader>
      <Collapse role='tabpanel' isOpen={openedCollapse}>
        <CardBody style={{ padding: 0 }}>
          {
            <span style={{ fontSize: '35px' }}>
              <i className={`icomoon-${icon.Number}`}></i>
            </span>
          }

          <Table>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Type</th>
                <th style={{ textAlign: 'center' }}>Category</th>
                <th>Observation</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactionsForTheComponent.map((trans) => (
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
                    {trans.type === 'Transfer'
                      ? trans.dueToAccount === id
                        ? 'Outgoing transfer'
                        : 'Incoming transfer'
                      : trans.type}
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
                        ) : typeof trans.dueToAccount === 'string' ? (
                          <i
                            className={`icomoon-${trans.dueFromAccount?.icon?.Number}`}
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
                        : typeof trans.dueToAccount === 'string'
                        ? trans.dueFromAccount.name
                        : trans.dueToAccount.name}
                    </span>
                  </td>

                  <td>{trans.observation}</td>
                  <td>{currencyFormat(trans.ammount, currency)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Collapse>
    </Card>
  );
};

export default CollapsibleItem;

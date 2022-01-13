import axios from 'axios';
import { format, parse } from 'date-fns';
import Progressbar from 'components/Progress/Progress';
import React, { useRef, useState } from 'react';
import { Button, Col, CustomInput, Input, Label, Row, Table } from 'reactstrap';
import { reverseFormatNumber } from '../helpers/functions';
import { fetchInvestments } from 'services/Investments';
import ProgressbarCircle from 'components/ProgressbarCircle/ProgressbarCircle';
import { useEffect } from 'react';
import Spinner from '../components/Spinner/Spinner';
import NumberFormat from 'react-number-format';
import NotificationAlert from 'react-notification-alert';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import { currencies } from './pages/currencies';

const Uploader = () => {
  const [alert, setAlert] = useState(null);
  const [isSubmited, setIsSubmited] = useState(false);
  const [date, setDate] = useState('');
  const [file, setFile] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const [hasChosdenDate, setHasChosdenDate] = useState(false);
  const [submitCount, setSubmiCount] = useState(0);
  const [counter, setCounter] = useState(0);

  const [investmentsBulkUpdate, setInvestmentsBulkUpdate] = useState([]);
  const [incomesArray] = useState({});

  const setCounting = () => {
    setSubmiCount(submitCount + 1);
  };

  const address = process.env.REACT_APP_SERVER_ADDRESS;
  useEffect(() => {
    const handlePromise = async () => {
      setUploaded(true);
      let i = 0;
      for (const income of investmentsBulkUpdate) {
        setCounter(i);
        i++;
        const investment = await fetchInvestments(income.id, login);

        Object.assign(income, { currency: investment.invest.broker.currency });
        let incomeObject = {};
        incomeObject[
          `${format(parse(date, 'yyyy-MM', new Date()), 'yyyy-MM-dd')}income`
        ] = {
          type: 'income',
          tax: reverseFormatNumber(
            document.querySelector(`#taxSelector${income.id}`).value
          ),
          value: reverseFormatNumber(
            document.querySelector(`#selector${income.id}`).value
          ),
        };
        const index = investment.invest.incomes
          .map((key) => Object.keys(key)[0])
          .indexOf(Object.keys(incomeObject)[0]);
        let incomes = [];
        if (index !== -1) {
          investment.invest.incomes.splice(index, 1);
          incomes = [...investment.invest.incomes, incomeObject].sort(
            (a, b) => new Date(Object.keys(a)[0]) - new Date(Object.keys(b)[0])
          );
        } else {
          incomes = [...investment.invest.incomes, incomeObject].sort(
            (a, b) => new Date(Object.keys(a)[0]) - new Date(Object.keys(b)[0])
          );
        }
        incomesArray[income.id] = incomes;
      }
      setUploading(false);
    };
    if (uploading) {
      handlePromise();
    }

    if (
      submitCount === investmentsBulkUpdate.length &&
      investmentsBulkUpdate.length !== 0
    ) {
      notify(
        `${submitCount} You have successfully bulk updated your investments for the month of ${date}`
      );
    }
    // eslint-disable-next-line
  }, [investmentsBulkUpdate, submitCount]);
  const onSubmit = async (e) => {
    e.preventDefault();

    setUploading(true);
    const formData = new FormData();

    formData.append('file', file);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${login.token}`,
      },
      onUploadProgress: (progressEvent) => {
        setUploadPercentage(
          parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          )
        );
      },
    };
    await axios
      .post(`${address}/api/upload`, formData, config)
      .then((res) => {
        setInvestmentsBulkUpdate(res.data.xlData);
        setFile(res.fileName);
      })
      .catch((error) => {
        console.log(error);
        // notify(
        //   // error.response && error.response.data.message
        //   //   ? error.response.data.message
        //   //   : error.message
        //   //   ? error.message
        //   //   :
        //   'Please verify if you have filled all of the required fields for the incomes',
        //   'danger'
        // );
        setUploadPercentage(0);
      });
  };
  const submitHandler = () => {
    setIsSubmited(true);
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

  const hideAlert = () => {
    setAlert(null);
  };
  const success = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: 'block', marginTop: '-100px' }}
        title={'Done'}
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle='success'
        btnSize=''
      ></ReactBSAlert>
    );
  };
  const cancel = () => {
    setAlert(
      <ReactBSAlert
        danger
        style={{
          display: 'block',
          marginTop: '-100px',
        }}
        title='Cancelled'
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnText='Ok'
        confirmBtnBsStyle='success'
        btnSize=''
      ></ReactBSAlert>
    );
  };
  const warningWithConfirmAndCancelMessage = (e) => {
    setAlert(
      <ReactBSAlert
        warning
        style={{
          display: 'block',
          marginTop: '-100px',
        }}
        title='Are you sure?'
        onConfirm={() => {
          setHasChosdenDate(true);
          success();
        }}
        onCancel={() => cancel()}
        confirmBtnBsStyle='success'
        cancelBtnBsStyle='danger'
        confirmBtnText={'Yes'}
        cancelBtnText='Cancel'
        showCancel
        btnSize=''
      >
        {}
      </ReactBSAlert>
    );
  };
  return (
    <>
      <div className='react-notification-alert-container'>
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div className='content'>
        {alert}
        <h1 className='card-title'>
          <i className='fas fa-cloud-upload-alt'></i> Upload
        </h1>
        <Row>
          <div className='card flex-row text-center justify-content-center'>
            {uploading ? (
              <Spinner percentage={counter / investmentsBulkUpdate.length} />
            ) : null}

            <h2
              className='text-center'
              style={{ marginTop: '30px', paddingTop: '0.2rem' }}
            >
              Investments on
            </h2>
            <Input
              disabled={hasChosdenDate}
              type='month'
              style={{
                width: '335px',
                marginTop: '30px',
                fontSize: '1.6875rem',
              }}
              onChange={(e) => {
                setDate(e.target.value);
                warningWithConfirmAndCancelMessage(e);
              }}
              value={date}
            />
          </div>
        </Row>

        {hasChosdenDate ? (
          <>
            <div className='row justify-content-center'>
              <Button
                href={`${address}/api/upload/download/${login._id}/${date}`}
                color='primary'
              >
                <i className='far fa-file-excel' /> Download Excel Template
              </Button>
            </div>
            <form onSubmit={onSubmit}>
              <Label htmlFor='exampleCustomFileBrowser'>
                Choose an excel file
              </Label>
              <CustomInput
                type='file'
                id='exampleCustomFileBrowser'
                name='customFile'
                onChange={(e) => setFile(e.target.files[0])}
              />
              <div className='mt-5'>
                <Progressbar
                  style={{ height: ' !important' }}
                  percentage={uploadPercentage}
                />
              </div>

              <Input
                type='submit'
                disabled={uploaded}
                className='btn brn-primary btn-block mt-4'
                value='Upload'
              />
            </form>
          </>
        ) : null}

        {uploaded ? (
          <>
            <Table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>Name</th>
                  <th>Value/Taxes</th>
                </tr>
              </thead>
              <tbody>
                {investmentsBulkUpdate.map((invest) => (
                  <tr key={invest.id}>
                    <th scope='row'>{invest['id']}</th>
                    <td>{invest['name']}</td>
                    <td
                      className='row align-items-center justify-content-center py-0'
                      style={{ paddingTop: '0 !important' }}
                    >
                      <div>
                        <Row>
                          <Col md='4'>
                            <NumberFormat
                              disabled={uploading}
                              type='text'
                              placeholder={`0`}
                              thousandSeparator={'.'}
                              decimalSeparator={','}
                              prefix={`${
                                invest.currency
                                  ? currencies[invest.currency]?.symbol_native
                                  : ''
                              }`}
                              customInput={Input}
                              id={'selector' + invest.id}
                              defaultValue={
                                invest[date]
                                  ? Number(invest[date].toFixed(2))
                                  : null
                              }
                              onChange={(e) => {
                                e.target.id.replace('selector', '');
                                const tax = Object.values(
                                  incomesArray[
                                    e.target.id.replace('selector', '')
                                  ].find(
                                    (income) =>
                                      Object.keys(income)[0] ===
                                      `${format(
                                        parse(date, 'yyyy-MM', new Date()),
                                        'yyyy-MM-dd'
                                      )}income`
                                  )
                                )[0].tax;
                                // incomesArray.find((incomes) => {
                                //   console.log(incomes);
                                //   return (
                                //     Object.keys(incomes)[0] ===
                                //     e.target.id.replace('selector', '')
                                //   );
                                // });

                                const obj = {};
                                obj[
                                  `${format(
                                    parse(date, 'yyyy-MM', new Date()),
                                    'yyyy-MM-dd'
                                  )}income`
                                ] = {
                                  type: 'income',
                                  tax: tax,
                                  value: reverseFormatNumber(e.target.value),
                                };
                                incomesArray[invest.id].splice(
                                  incomesArray[invest.id].indexOf(date + '-01'),
                                  1,
                                  obj
                                );
                              }}
                            />
                          </Col>
                          <Col md='4'>
                            <NumberFormat
                              disabled={uploading}
                              type='text'
                              placeholder='0'
                              thousandSeparator={'.'}
                              decimalSeparator={','}
                              prefix={`${
                                invest.currency
                                  ? currencies[invest.currency]?.symbol_native
                                  : ''
                              }`}
                              customInput={Input}
                              id={'taxSelector' + invest.id}
                              defaultValue={
                                invest['taxes']
                                  ? Number(invest['taxes'].toFixed(2))
                                  : 0
                              }
                              onChange={(e) => {
                                e.target.id.replace('taxSelector', '');
                                const value = Object.values(
                                  incomesArray[
                                    e.target.id.replace('taxSelector', '')
                                  ].find(
                                    (income) =>
                                      Object.keys(income)[0] ===
                                      `${format(
                                        parse(date, 'yyyy-MM', new Date()),
                                        'yyyy-MM-dd'
                                      )}income`
                                  )
                                )[0].value;
                                // incomesArray.find((incomes) => {
                                //   console.log(incomes);
                                //   return (
                                //     Object.keys(incomes)[0] ===
                                //     e.target.id.replace('selector', '')
                                //   );
                                // });

                                const obj = {};
                                obj[
                                  `${format(
                                    parse(date, 'yyyy-MM', new Date()),
                                    'yyyy-MM-dd'
                                  )}income`
                                ] = {
                                  type: 'income',
                                  tax: reverseFormatNumber(e.target.value),
                                  value: value,
                                };
                                incomesArray[invest.id].splice(
                                  incomesArray[invest.id].indexOf(date + '-01'),
                                  1,
                                  obj
                                );
                                // const obj = {};
                                // obj[
                                //   `${format(
                                //     parse(date, 'yyyy-MM', new Date()),
                                //     'yyyy-MM-dd'
                                //   )}income`
                                // ] = {
                                //   type: 'income',
                                //   tax: 0,
                                //   value: reverseFormatNumber(e.target.value),
                                // };
                                // incomesArray[invest.id].splice(
                                //   incomesArray[invest.id].indexOf(date + '-01'),
                                //   1,
                                //   obj
                                // );
                              }}
                            />
                          </Col>
                          <ProgressbarCircle
                            handleAddIncomeCall={isSubmited}
                            incomesObj={{ incomes: incomesArray[invest.id] }}
                            id={invest.id}
                            setCounting={setCounting}
                            isTheLastOne={
                              investmentsBulkUpdate[
                                investmentsBulkUpdate.length - 1
                              ].id
                            }
                          />
                        </Row>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Row className='justify-content-center mt-4'>
              <Button
                disabled={uploading}
                color='success'
                className='text-center'
                onClick={() => submitHandler()}
              >
                Submit
              </Button>
            </Row>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Uploader;

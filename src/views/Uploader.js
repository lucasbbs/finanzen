import axios from 'axios';
import { format, parse } from 'date-fns';
import Progressbar from 'components/Progress/Progress';
import React, { useRef, useState } from 'react';
import { Button, CustomInput, Input, Label, Row, Table } from 'reactstrap';
import Config from '../config.json';
import { reverseFormatNumber } from '../helpers/functions';
import { fetchInvestments } from 'services/Investments';
import ProgressbarCircle from 'components/ProgressbarCircle/ProgressbarCircle';
import { useEffect } from 'react';
import Spinner from '../components/Spinner/Spinner';
import NumberFormat from 'react-number-format';
import NotificationAlert from 'react-notification-alert';

const Uploader = () => {
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

  const [investmentsBulkUpdate, setInvestmentsBulkUpdate] = useState([]);
  const [incomesArray] = useState({});

  console.log(submitCount + 1);

  const setCounting = () => {
    setSubmiCount(submitCount + 1);
  };

  useEffect(() => {
    const handlePromise = async () => {
      for (const income of investmentsBulkUpdate) {
        setUploaded(true);
        const investment = await fetchInvestments(income.id, login);

        let incomeObject = {};
        incomeObject[
          format(parse(date, 'yyyy-MM', new Date()), 'yyyy-MM-dd')
        ] = reverseFormatNumber(
          // prettier-ignore
          document.querySelector(`#selector${income.id}`).value
        );
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
        `Você efetuou com sucesso a atualização em lote dos seus investimentos para o mê de ${date}`
      );
    }
    console.log(investmentsBulkUpdate);
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
      .post(`${Config.SERVER_ADDRESS}/api/upload`, formData, config)
      .then((res) => {
        setInvestmentsBulkUpdate(res.data.xlData);
        setFile(res.fileName);
      })
      .catch((err) => setUploadPercentage(0));
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
  return (
    <>
      <div className='react-notification-alert-container'>
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div className='content'>
        <h1>
          <i className='fas fa-cloud-upload-alt'></i> Upload
        </h1>
        <Row>
          <div className='card flex-row text-center justify-content-center'>
            {uploading ? <Spinner /> : null}

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
                if (
                  window.confirm(
                    'Você tem certeza de que deseja escolher esas data?'
                  )
                ) {
                  setDate(e.target.value);
                  setHasChosdenDate(true);
                }
              }}
              value={date}
            />
          </div>
        </Row>

        {hasChosdenDate ? (
          <>
            <div className='row justify-content-center'>
              <Button
                href={`${Config.SERVER_ADDRESS}/api/upload/download/${login._id}/${date}`}
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
              <div className='text-center mt-5'>{uploadPercentage}%</div>

              <Progressbar
                style={{ height: ' !important' }}
                className='mt-5'
                percentage={uploadPercentage}
              />

              <Input
                type='submit'
                disabled={uploaded}
                className='btn brn-primary btn-block mt-4'
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
                  <th>Value</th>
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
                        <NumberFormat
                          type='text'
                          placeholder='R$0.00'
                          thousandSeparator={'.'}
                          decimalSeparator={','}
                          prefix={'R$'}
                          customInput={Input}
                          id={'selector' + invest.id}
                          defaultValue={Number(invest[date].toFixed(2))}
                          onChange={(e) => {
                            const obj = {};
                            obj[
                              format(
                                parse(date, 'yyyy-MM', new Date()),
                                'yyyy-MM-dd'
                              )
                            ] = reverseFormatNumber(e.target.value);
                            incomesArray[invest.id].splice(
                              incomesArray[invest.id].indexOf(date + '-01'),
                              1,
                              obj
                            );
                          }}
                        />
                      </div>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Row className='justify-content-center mt-4'>
              <Button
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

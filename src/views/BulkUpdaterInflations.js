import axios from 'axios';
import Progressbar from 'components/Progress/Progress';
import React, { useRef, useState } from 'react';
import {
  Button,
  CustomInput,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
} from 'reactstrap';
import { useEffect } from 'react';
import Spinner from '../components/Spinner/Spinner';
import NotificationAlert from 'react-notification-alert';
const BulkUpdaterInflations = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lengthArray, setlengthArray] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [mainCheckbox, setMainCheckbox] = useState(true);
  const [inflations, setInflations] = useState([]);
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

  const [inflationsBulkUpdate, setInflationsBulkUpdate] = useState([]);
  const [incomesArray] = useState({});
  const setCounting = () => {
    setSubmiCount(submitCount + 1);
  };

  const address = process.env.REACT_APP_SERVER_ADDRESS;

  useEffect(() => {
    // const handlePromise = async () => {
    //   for (const inflation of inflationsBulkUpdate) {
    //     setUploaded(true);
    //   }
    //   setUploading(false);
    // };
    // if (uploading) {
    //   handlePromise();
    // }

    // if (
    //   submitCount === inflationsBulkUpdate.length &&
    //   inflationsBulkUpdate.length !== 0
    // ) {}
    // console.log(investmentsBulkUpdate);
    const getInflations = async () => {
      await axios.get(`${address}/api/inflations`).then((res) =>
        setInflations(
          res.data
            .map((inf) => {
              return { selected: true, ...inf };
            })
            .filter((inf) => inf.alpha2Code)
            .sort((a, b) => a.alpha2Code.localeCompare(b.alpha2Code))
        )
      );
    };
    if (inflations.length === 0) {
      getInflations();
    }
    // eslint-disable-next-line
  }, [inflationsBulkUpdate, submitCount]);
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
      .post(`${address}/api/inflationsbulkupload`, formData, config)
      .then(async (res) => {
        const array = res.data.xlData.filter(
          (data) => Object.keys(data).length !== 0
        );
        setlengthArray(array.length);
        setIsLoading(true);
        for (const iterator of res.data.xlData
          .filter((data) => Object.keys(data).length !== 0)
          .keys()) {
          setCurrentIndex(iterator);
          const configJson = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${login.token}`,
            },
          };
          await axios.put(
            `${address}/api/inflations/${String(
              Object.keys(array[iterator])[0]
            )}`,
            {
              alpha2Code: String(Object.keys(array[iterator])[0]),
              'Country Name': String(
                inflations.find(
                  (inf) =>
                    inf.alpha2Code === String(Object.keys(array[iterator])[0])
                )['Country Name']
              ),
              values: Object.values(array[iterator])[0],
            },
            configJson
          );
          if (iterator === array.length - 1) {
            setIsLoading(false);
          }
        }
        setFile(res.fileName);
        notify(
          `You have successfully bulk updated the inflations ${res.data.xlData
            .filter((data) => Object.keys(data).length !== 0)
            .map((inf) => Object.keys(inf)[0])
            .join(', ')}`
        );
      })
      .catch((error) => {
        notify(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          'danger'
        );
        setUploadPercentage(0);
      });
  };
  const submitHandler = () => {
    // setIsSubmited(true);
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
      {isLoading && (
        <>
          <Spinner percentage={currentIndex / lengthArray} />
        </>
      )}
      <div className='react-notification-alert-container'>
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div className='content'>
        <h1>
          <i className='fas fa-cloud-upload-alt'></i> Bulk Inflations Editor
        </h1>
        <>
          <div className='row justify-content-center'>
            <Button
              href={`${address}/api/inflationsbulkupload/download/${inflations
                .filter((inf) => inf.selected)
                .map((inf) => inf.alpha2Code)}`}
              color='primary'
            >
              <i className='far fa-file-excel' /> Download Excel Template
            </Button>
            <Table>
              <thead>
                <tr>
                  <th>
                    <FormGroup check>
                      <Label check>
                        <Input
                          type='checkbox'
                          checked={mainCheckbox}
                          onChange={(e) => {
                            setInflations(
                              inflations.map((inf) => ({
                                ...inf,
                                selected: e.target.checked,
                              }))
                            );
                            setMainCheckbox(e.target.checked);
                          }}
                        />
                        <span
                          className={[
                            'form-check-sign',
                            inflations.some((inf) => inf.selected === false)
                              ? inflations.every(
                                  (inf) => inf.selected === false
                                )
                                ? null
                                : 'customClassForCheckboxes'
                              : null,
                          ].join(' ')}
                        >
                          <span className='check' />
                        </span>
                      </Label>
                    </FormGroup>
                  </th>
                  <th>Alpha 2 Code</th>
                  <th>Country Name</th>
                </tr>
              </thead>
              <tbody>
                {inflations
                  .filter((inf) => inf.alpha2Code)
                  .sort((a, b) => a.alpha2Code.localeCompare(b.alpha2Code))
                  .map((inf, index) => (
                    <tr index={index} id={inf.alpha2Code} key={inf.alpha2Code}>
                      <td>
                        <FormGroup check>
                          <Label check>
                            <Input
                              defaultValue=''
                              type='checkbox'
                              checked={inf.selected}
                              onChange={(e) => {
                                const index = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute(
                                  'index'
                                );
                                const infObj = inflations[index];
                                infObj['selected'] = e.target.checked;
                                inflations.splice(index, 1, infObj);
                                setInflations([...inflations]);
                              }}
                            />
                            <span className='form-check-sign'>
                              <span className='check' />
                            </span>
                          </Label>
                        </FormGroup>
                      </td>
                      <td>{inf.alpha2Code}</td>
                      <td>{inf['Country Name']}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
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
              <Progressbar percentage={uploadPercentage} />
            </div>

            <Input
              type='submit'
              disabled={uploaded}
              className='btn brn-primary btn-block mt-4'
              value='Upload'
            />
          </form>
        </>
      </div>
    </>
  );
};

export default BulkUpdaterInflations;

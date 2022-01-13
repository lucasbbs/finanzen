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
import { ChromePicker } from 'react-color';
import { useEffect, useState, useRef } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import {
  Card,
  CardBody,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  FormGroup,
  ModalFooter,
  Button,
  CardHeader,
  CardTitle,
  Collapse,
} from 'reactstrap';
import NotificationAlert from 'react-notification-alert';
import 'moment-recur';
import axios from 'axios';
import {
  RGBAToHexA,
  contrast,
  hexAToRGBA,
  createDateString,
} from 'helpers/functions';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import { ISODateFormat } from 'helpers/functions';

const localizer = momentLocalizer(moment);
// const DnDCalendar = withDragAndDrop(BigCalendar);

const Calendar = () => {
  const [name, setName] = useState('');
  const [nestedModal, setNestedModal] = useState(false);
  const [closeAll, setCloseAll] = useState(false);

  const [investmentProjectId, setInvestmentProjectId] = useState('');
  const [calendarslt, setCalendarslt] = useState('');
  const [openedCollapseOne, setopenedCollapseOne] = useState(true);
  const [openedCollapseTwo, setopenedCollapseTwo] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState(undefined);
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const [modalSelectCalendar, setModalSelectCalendar] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [alert, setAlert] = useState(null);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [recurringEvents, setRecurringEvents] = useState([]);
  const [initialEvents, setInitialEvents] = useState([]);
  const [allDay, setAllDay] = useState(true);
  const [until, setUntil] = useState('');
  const [selectedCalendar, setSelectedCalendar] = useState('');
  const [calendars, setCalendars] = useState([]);
  const [interval, setIntervalo] = useState(0);
  const [recurrence, setRecurrence] = useState('');
  const [isRecurringEvent, setIsRecurringEvent] = useState(false);
  const [description, setDescription] = useState('');
  const [id, setId] = useState('');
  const [calendarId, setCalendarId] = useState('');
  const [title, setTitle] = useState('');
  const [startFrom, setStartFrom] = useState('');
  const [endAt, setEndAt] = useState('');
  const [modal, setModal] = useState(false);
  const [startRecurrenceFrom, setStartRecurrenceFrom] = useState('');
  const [inputMonth, setInputMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const address = process.env.REACT_APP_SERVER_ADDRESS;
  const selectedEvent = (event, pointerEvent) => {
    if (pointerEvent.nativeEvent.offsetX <= 13) {
      warningWithConfirmAndCancelMessage(event);
    } else {
      setIsEditable(!event.investment);
      setDescription(event.description);
      if (event.until) {
        setUntil(event.until.slice(0, 10));
      }
      if (event.startRecurrenceFrom) {
        setStartRecurrenceFrom(event.startRecurrenceFrom.slice(0, 10));
      }
      setSelectedCalendar(event.calendar);
      setIntervalo(event.interval);
      setRecurrence(event.freq);
      setSelectedCalendar(event.calendar);
      setAllDay(event.allDay);
      setIsRecurringEvent(event.recurrent);
      setId(event._id);
      setTitle(event.title);
      setColor(hexAToRGBA(event.color));
      if (event.allDay) {
        setStartFrom(createDateString(event.start).slice(0, 10));
        setEndAt(createDateString(event.end).slice(0, 10));
      } else {
        setStartFrom(createDateString(event.start).slice(0, 16));
        setEndAt(createDateString(event.end).slice(0, 16));
      }
      toggle();
    }
  };

  useEffect(() => {
    if (calendarslt !== '') {
      setCalendarEvents(
        ...calendars
          .filter((clnd) => clnd._id === calendarslt)
          .map((clnd) =>
            clnd.eventCalendars.map((event) => ({
              ...event,
              color: event.color ? event.color : clnd.color,
            }))
          )
      );

      console.log(
        ...calendars
          .filter((clnd) => clnd._id === calendarslt)
          .map((clnd) =>
            clnd.eventCalendars.map((event) => ({
              ...event,
              color: event.color ? event.color : clnd.color,
            }))
          )
      );
    } else {
      setCalendarEvents(
        calendars
          .map((clnd) =>
            clnd.eventCalendars.map((event) => ({
              ...event,
              color: event.color ? event.color : clnd.color,
            }))
          )
          .flat()
      );
    }
  }, [calendarslt]);

  useEffect(() => {
    const getEvents = async () => {
      const config = { headers: { Authorization: `Bearer ${login.token}` } };
      let { data } = await axios.get(`${address}/api/calendars/`, config);
      setCalendars(data);
      setInitialEvents(
        data
          .map((calendar) =>
            calendar.eventCalendars.map((evt) => ({
              ...evt,
              start: new Date(evt.start),
              end: new Date(evt.end),
            }))
          )
          .flat()
      );
      setCalendarEvents(
        data
          .map((calendar) =>
            calendar.eventCalendars.map((event) => ({
              ...event,
              color: calendar.color,
            }))
          )
          .flat()
      );
    };
    getEvents();
  }, []);

  class RecurringEvent {
    constructor(
      start,
      freq,
      interval,
      end,
      title,
      allDay,
      color,
      endRecurrence,
      exceptions,
      _id,
      description,
      calendar,
      startRecurrenceFrom
    ) {
      this.currentMonth;
      this.start = start;
      this.startRecurrenceFrom = startRecurrenceFrom;
      this.end = end;
      this.endRecurrence = endRecurrence;
      this.freq = freq;
      this.interval = interval;
      this.exceptions = exceptions;
      this.title = title;
      this.allDay = allDay;
      this.color = color;
      this.calendar = calendar;
      this.rInterval = moment().recur({
        start: this.startRecurrenceFrom,
        end: moment(endRecurrence).add(1, 'days').toDate(),
        rules: [{ units: { [interval]: true }, measure: freq }],
        exceptions: exceptions,
      });
      this._id = _id;
      this.description = description;
    }

    setCurrentMonth(month) {
      this.currentMonth = new Date(month);
    }

    setCurrentStart() {
      return new Date(
        this.currentMonth.getFullYear(),
        this.currentMonth.getMonth(),
        1
      );
    }

    setCurrentEnd() {
      return new Date(
        this.currentMonth.getFullYear(),
        this.currentMonth.getMonth() + 1,
        0
      );
    }

    getMonths() {
      const ar = [];
      const start = moment(this.setCurrentStart(), 'YYYY-MM-DD').startOf(
        'week'
      );
      const diffStart =
        new Date(this.start).getTime() -
        new Date(
          new Date(this.start).getFullYear(),
          new Date(this.start).getMonth(),
          new Date(this.start).getDate()
        ).getTime();
      const end = moment(this.setCurrentEnd(), 'YYYY-MM-DD').endOf('week');
      const diff = new Date(this.end) - new Date(this.start);

      for (end; start.isBefore(end); start.add(1, 'day')) {
        if (this.rInterval.matches(start)) {
          ar.push({
            _id: this._id,
            description: this.description,
            title: this.title,
            start: new Date(new Date(start).getTime() + diffStart),
            end: new Date(new Date(start).getTime() + diff + diffStart), //.add(diff, 'minutes').toDate(),
            recurrent: true,
            until: this.endRecurrence,
            color: this.color,
            freq: this.freq,
            interval: this.interval,
            allDay: this.allDay,
            calendar: this.calendar,
            startRecurrenceFrom: this.startRecurrenceFrom,
          });
        }
      }
      return ar;
    }
  }

  useEffect(() => {
    setRecurringEvents(
      initialEvents
        ? initialEvents
            .filter((evt) => evt.recurrent)
            .map(
              (evt) =>
                new RecurringEvent(
                  evt.start,
                  evt.freq,
                  evt.interval,
                  evt.end,
                  evt.title,
                  evt.allDay,
                  evt.color,
                  evt.until,
                  evt.exceptions,
                  evt._id,
                  evt.description,
                  evt.calendar,
                  evt.startRecurrenceFrom
                )
            )
        : []
    );
    const newEvents = initialEvents
      ? initialEvents.filter((evt) => !evt.recurrent)
      : [];
    recurringEvents.forEach((element) => {
      element.setCurrentMonth(date);
      element.getMonths().forEach((elm) => {
        newEvents.push(elm);
      });
    });
    setCalendarEvents(newEvents);
  }, [initialEvents]);

  useEffect(() => {
    const newEvents = calendarEvents.filter((evt) => !evt.recurrent);
    recurringEvents.forEach((element) => {
      element.setCurrentMonth(date);
      element.getMonths().forEach((elm) => {
        newEvents.push(elm);
      });
    });
    setCalendarEvents(newEvents);
  }, [recurringEvents, date]);

  //initial set of dates

  const addNewEventAlert = (slotInfo) => {
    if (view === 'week' || view === 'day') {
      setAllDay(false);
      setStartFrom(createDateString(slotInfo.start).slice(0, 16));
      setEndAt(createDateString(slotInfo.end).slice(0, 16));
    } else {
      setAllDay(true);
      setStartFrom(createDateString(slotInfo.start).slice(0, 10));
      setEndAt(createDateString(slotInfo.end).slice(0, 10));
    }
    toggle();
  };

  const addNewEvent = async () => {
    var newEvents = calendarEvents;
    const config = { headers: { Authorization: `Bearer ${login.token}` } };
    const obj = {
      title: title,
      start: allDay
        ? moment(startFrom).add(0, 'days').toDate()
        : new Date(startFrom),
      end: allDay ? moment(endAt).add(0, 'days').toDate() : new Date(endAt),
      description: description,
      recurrent: isRecurringEvent,
      allDay: allDay,
      calendar: selectedCalendar,
      color: color ? RGBAToHexA(color.r, color.g, color.b, color.a) : undefined,
    };

    if (isRecurringEvent) {
      obj.freq = recurrence;
      obj.interval = interval;
      obj.until = until;
      obj.startRecurrenceFrom = ISODateFormat(startRecurrenceFrom);
    }

    let data;
    if (id === '') {
      try {
        data = await axios.post(`${address}/api/eventCalendars/`, obj, config);
        data = data.data;

        calendars[
          calendars.findIndex((clndr) => clndr._id === data.calendar)
        ].eventCalendars.push(data);

        newEvents.push({
          ...data,
          start: new Date(data.start),
          end: new Date(data.end),
        });
        handleEvents();
        toggle();
        notify(
          `You have successfully added the event ${obj.title} for ${obj.start}-${obj.end}`
        );
      } catch (error) {
        notify(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          'danger'
        );
      }
    } else {
      try {
        data = await axios.put(
          `${address}/api/eventCalendars/${id}`,
          obj,
          config
        );
        data = data.data;
        const pickedEvent = newEvents.findIndex((evt) => evt._id === id);
        const indexCalendar = calendars.findIndex(
          (clndr) => clndr._id === data.calendar
        );
        const indexEventCalendar = calendars[
          indexCalendar
        ].eventCalendars.findIndex((evt) => evt._id === data._id);
        calendars[indexCalendar].eventCalendars[indexEventCalendar] = {
          ...data,
          start: new Date(data.start),
          end: new Date(data.end),
        };
        newEvents[pickedEvent] = {
          ...data,
          start: new Date(data.start),
          end: new Date(data.end),
        };
        handleEvents();
        toggle();
        notify(
          `You have successfully updated the event ${obj.title} for ${obj.start}-${obj.end}`
        );
      } catch (error) {
        notify(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          'danger'
        );
      }
      console.log(calendars);
    }
    function handleEvents() {
      if (isRecurringEvent) {
        if (id === '') {
          setRecurringEvents([
            ...recurringEvents,
            new RecurringEvent(
              data.start,
              data.freq,
              data.interval,
              data.end,
              data.title,
              data.allDay,
              data.color,
              data.until,
              data.exceptions,
              data._id,
              data.description,
              data.calendar,
              data.startRecurrenceFrom
            ),
          ]);
        } else {
          const selectedIndex = recurringEvents.findIndex(
            (evt) => evt._id === id
          );
          if (selectedIndex === -1) {
            recurringEvents.push(
              new RecurringEvent(
                data.start,
                data.freq,
                data.interval,
                data.end,
                data.title,
                data.allDay,
                data.color,
                data.until,
                data.exceptions,
                data._id,
                data.description,
                data.calendar,
                data.startRecurrenceFrom
              )
            );
          } else {
            recurringEvents[selectedIndex] = new RecurringEvent(
              data.start,
              data.freq,
              data.interval,
              data.end,
              data.title,
              data.allDay,
              data.color,
              data.until,
              data.exceptions,
              data._id,
              data.description,
              data.calendar,
              data.startRecurrenceFrom
            );
          }

          setRecurringEvents([...recurringEvents]);
        }
      } else {
        setCalendarEvents(newEvents);
      }
    }
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

  const deleteSingleEvent = async (event) => {
    const config = { headers: { Authorization: `Bearer ${login.token}` } };
    const exceptions = recurringEvents.find((evt) => evt._id === event._id)
      .exceptions;
    exceptions.push(event.start);
    const obj = {
      exceptions: exceptions,
    };
    try {
      const { data } = await axios.put(
        `${address}/api/eventCalendars/${event._id}`,
        obj,
        config
      );
      const selectedIndex = recurringEvents.findIndex(
        (evt) => evt._id === event._id
      );
      if (selectedIndex === -1) {
        recurringEvents.push(
          new RecurringEvent(
            data.start,
            data.freq,
            data.interval,
            data.end,
            data.title,
            data.allDay,
            data.color,
            data.until,
            data.exceptions,
            data._id,
            data.description,
            data.calendar,
            data.startRecurrenceFrom
          )
        );
      } else {
        recurringEvents[selectedIndex] = new RecurringEvent(
          data.start,
          data.freq,
          data.interval,
          data.end,
          data.title,
          data.allDay,
          data.color,
          data.until,
          data.exceptions,
          data._id,
          data.description,
          data.calendar,
          data.startRecurrenceFrom
        );
      }

      setRecurringEvents([...recurringEvents]);
      success();
    } catch (error) {
      notify(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
        'danger'
      );
    }
  };
  const deleteCalendar = async (id) => {
    const config = { headers: { Authorization: `Bearer ${login.token}` } };
    try {
      const { data } = await axios.delete(
        `${address}/api/calendars/${id}`,
        config
      );
      success('calendar');
      setCalendars(calendars.filter((calendar) => calendar._id !== id));
      setCalendarEvents(
        calendarEvents.filter((event) => event.calendar !== id)
      );
      notify('You have succesfully deleted a calendar and all of its events');
    } catch (error) {
      notify(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
        'danger'
      );
    }
  };
  const deleteEvent = async (id) => {
    const config = { headers: { Authorization: `Bearer ${login.token}` } };
    try {
      const { data } = await axios.delete(
        `${address}/api/eventCalendars/${id}`,
        config
      );

      const indexCalendar = calendars.findIndex(
        (clndr) => clndr._id === data.calendar
      );
      calendars[indexCalendar].eventCalendars = calendars[
        indexCalendar
      ].eventCalendars.filter((evt) => evt._id !== id);
      setCalendarEvents(calendarEvents.filter((evt) => evt._id !== id));
      setRecurringEvents(recurringEvents.filter((evt) => evt._id !== id));
      successDeleteRecurring();
      notify('You have successfully deleted the event in your calendar');
    } catch (error) {
      notify(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
        'danger'
      );
    }
  };

  const eventColors = (event, start, end, isSelected) => {
    var backgroundColor = 'event-';
    event.color
      ? (backgroundColor = backgroundColor + event.color)
      : (backgroundColor = backgroundColor + 'default');
    return {
      className: backgroundColor,
    };
  };
  const handleMoveEvent = ({ event, start, end, allDay }) => {
    const updatedEvent = { ...event.resource };
    updatedEvent.startDate = start;
    updatedEvent.endDate = end;
    updatedEvent.isAllDay = allDay;
  };

  const handleNavigate = (event, kind, direction, teste) => {
    setDate(event);
  };
  const handleView = (view) => {
    setView(view);
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    const rgba = hexAToRGBA(event.color);
    var backgroundColor = event.color;
    var style = {
      backgroundColor: backgroundColor ? backgroundColor : null,
      borderRadius: '0px',
      opacity: 0.8,
      color:
        contrast([255, 255, 255], [rgba?.r, rgba?.g, rgba?.b]) >= 4
          ? 'white'
          : 'black',
      border: '0px',
      display: 'block',
      // height: '15px',
    };
    return {
      style: style,
      className: ['eventListenerClass', event.recurrent ? 'recurrent' : null],
    };
  };

  const closeBtn = (fn) => {
    return (
      <button color='danger' className='close' onClick={() => fn()}>
        <span style={{ color: 'white' }}>×</span>
      </button>
    );
  };

  const toggleModalSelectCalendar = () => {
    setModalSelectCalendar(!modalSelectCalendar);
  };

  const toggle = () => {
    setModal(!modal);
    if (modal) {
      setDescription('');
      setColor(undefined);
      setId('');
      setIsRecurringEvent(false);
      setTitle('');
      setSelectedCalendar('');
      setIsEditable(true);
      setIntervalo(0);
      setRecurrence('');
      setStartRecurrenceFrom('');
      setUntil('');
    }
  };

  const popover = {
    position: 'absolute',
    zIndex: '2',
  };
  const cover = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  };
  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const successDeleteRecurring = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: 'block', marginTop: '-100px' }}
        title='Deleted'
        onConfirm={() => {
          hideAlert();
        }}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle='success'
        btnSize=''
      >
        Your event was deleted...
      </ReactBSAlert>
    );
  };
  const success = (type = 'event') => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: 'block', marginTop: '-100px' }}
        title='Deleted'
        onConfirm={() => {
          hideAlert();
        }}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle='success'
        btnSize=''
      >
        {type === 'event'
          ? 'Your event was deleted...'
          : 'Your calendar was deleted'}
      </ReactBSAlert>
    );
  };
  const cancelDelete = () => {
    setAlert(
      <ReactBSAlert
        danger
        style={{ display: 'block', marginTop: '-100px' }}
        title='Cancelled'
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnText='Ok'
        confirmBtnBsStyle='success'
        btnSize=''
      ></ReactBSAlert>
    );
  };
  const warningWithConfirmAndCancelMessage = (event, type = 'event') => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block', marginTop: '-100px' }}
        title='Are you sure?'
        customButtons={
          <>
            <Button color='danger' onClick={() => cancelDelete()}>
              Cancel
            </Button>

            <Button
              color='success'
              onClick={() => {
                if (type === 'event') {
                  deleteEvent(event._id);
                } else {
                  deleteCalendar(event);
                }
              }}
            >
              {event.recurrent
                ? 'Delete all the event for this recurrence'
                : 'Delete'}
            </Button>

            {event.recurrent ? (
              <Button onClick={() => deleteSingleEvent(event)}>
                Delete only this event
              </Button>
            ) : null}
          </>
        }
        showCancel
        btnSize=''
      >
        {type === 'event'
          ? 'you will not be able to restore this event data'
          : 'you will not be able to restore this calendar'}
      </ReactBSAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
  const toggleNested = () => {
    if (nestedModal) {
      setColor(undefined);
      setName('');
      setId('');
    }
    setNestedModal(!nestedModal);
    setCloseAll(false);
  };
  const toggleAll = () => {
    setNestedModal(!nestedModal);
    setCloseAll(true);
  };

  const handleSave = async (objCalendar) => {
    const config = { headers: { Authorization: `Bearer ${login.token}` } };
    try {
      if (calendarId === '') {
        const { data } = await axios.post(
          `${address}/api/calendars`,
          objCalendar,
          config
        );
        data['eventCalendars'] = [];
        setCalendars([...calendars, data]);
        notify('You have successfully created a calendar');
      } else {
        const { data } = await axios.put(
          `${address}/api/calendars/${calendarId}`,
          objCalendar,
          config
        );
        const newCalendars = calendars;
        newCalendars[
          calendars.findIndex((calendar) => calendar._id === calendarId)
        ] = data;
        setCalendars([...newCalendars]);
        notify('You have successfully updated a calendar');
      }
    } catch (error) {
      notify(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
        'danger'
      );
    }
  };

  return (
    <>
      <div className='react-notification-alert-container'>
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div className='content'>
        {alert}
        <Modal
          isOpen={modal}
          toggle={() => toggle()}
          modalClassName='modal-black'
          autoFocus={false}
        >
          <ModalHeader close={closeBtn(toggle)}>
            Add New Calendar Event
          </ModalHeader>
          <ModalBody>
            <Label>Calendar</Label>
            <Input
              disabled={!isEditable}
              type='select'
              autoFocus={isEditable}
              style={{ backgroundColor: '#27293d' }}
              value={selectedCalendar}
              onChange={(e) => setSelectedCalendar(e.target.value)}
            >
              <option value='' disabled>
                Select an option
              </option>
              {calendars.map((calendar) => (
                <option key={calendar._id} value={calendar._id}>
                  {calendar.name}
                </option>
              ))}
            </Input>
            <Label htmlFor='titleId'>Title</Label>
            <Input
              autoFocus={!isEditable}
              id='titleId'
              style={{ backgroundColor: '#27293d' }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <FormGroup
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
              }}
              check
            >
              <Label
                htmlFor='allDayId'
                style={{ marginBottom: 0, marginRight: '10px' }}
              >
                All day Event?
              </Label>
              <Label className={!isEditable ? 'disabled' : ''} check>
                <Input
                  disabled={!isEditable}
                  id='allDay'
                  style={{ backgroundColor: '#27293d' }}
                  checked={allDay}
                  onChange={(e) => {
                    setAllDay(e.target.checked);
                  }}
                  type='checkbox'
                />
                <span className='form-check-sign'>
                  <span className='check' />
                </span>
              </Label>
            </FormGroup>
            <Label htmlFor='startFromId'>Start From:</Label>
            <Input
              disabled={!isEditable}
              id='startFromId'
              style={{ backgroundColor: '#27293d' }}
              type={!allDay ? 'datetime-local' : 'date'}
              value={startFrom}
              onChange={(e) => setStartFrom(e.target.value)}
            />
            <Label htmlFor='endAtId'>End At:</Label>
            <Input
              disabled={!isEditable}
              id='endAtId'
              style={{ backgroundColor: '#27293d' }}
              type={!allDay ? 'datetime-local' : 'date'}
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
            />
            <Label htmlFor='ColorPickerId'>Color</Label>
            <br />
            <button
              style={{
                borderRadius: '20px',
                color:
                  contrast([255, 255, 255], [color?.r, color?.g, color?.b]) >= 4
                    ? 'white'
                    : 'black',
                background: color
                  ? RGBAToHexA(color.r, color.g, color.b, color.a)
                  : null,
                outline: 'none',
                border: 'none',
              }}
              onClick={handleClick}
            >
              Pick Color
            </button>
            {displayColorPicker ? (
              <div style={popover}>
                <div style={cover} onClick={handleClick} />
                <ChromePicker
                  id='ColorPickerId'
                  color={color}
                  onChange={(e) => setColor(e.rgb)}
                />
              </div>
            ) : null}
            <br />

            <Label htmlFor='descriptionId'>Description</Label>
            <Input
              id='descriptionId'
              style={{ backgroundColor: '#27293d' }}
              type='textarea'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Input>
            <FormGroup
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
              }}
              check
            >
              <Label
                htmlFor='recurringEventsId'
                style={{ marginBottom: 0, marginRight: '10px' }}
              >
                Recurring Event?
              </Label>
              <Label className={!isEditable ? 'disabled' : ''} check>
                <Input
                  disabled={!isEditable}
                  id='recurringEventsId'
                  style={{ backgroundColor: '#27293d' }}
                  checked={isRecurringEvent}
                  onChange={(e) => {
                    setIsRecurringEvent(e.target.checked);
                  }}
                  type='checkbox'
                />
                <span className='form-check-sign'>
                  <span className='check' />
                </span>
              </Label>
            </FormGroup>
            {isRecurringEvent ? (
              <Row>
                <Col md='6'>
                  <Label htmlFor='recurrenceId'>Recurrence</Label>
                  <Input
                    id='recurrenceId'
                    style={{ backgroundColor: '#27293d' }}
                    value={recurrence}
                    type='select'
                    onChange={(e) => setRecurrence(e.target.value)}
                  >
                    <option value='' disabled>
                      Select an option
                    </option>
                    <option value='days'>Daily</option>
                    <option value='weeks'>Weekly</option>
                    <option value='months'>Monthly</option>
                    <option value='years'>Yearly</option>
                  </Input>
                </Col>
                <Col md='6'>
                  <Label htmlFor='intervalId'>Interval</Label>
                  <Input
                    id='intervalId'
                    style={{ backgroundColor: '#27293d' }}
                    value={interval}
                    onChange={(e) => setIntervalo(e.target.value)}
                  />
                </Col>
                <Col md='6'>
                  <Label htmlFor='startRecurrenceId'>
                    Start Recurrence From
                  </Label>
                  <Input
                    type='date'
                    id='startRecurrenceId'
                    style={{ backgroundColor: '#27293d' }}
                    value={startRecurrenceFrom}
                    onChange={(e) => {
                      setStartRecurrenceFrom(e.target.value);
                    }}
                  />
                </Col>
                <Col md='6'>
                  <Label htmlFor='untilId'>Until</Label>
                  <Input
                    type='date'
                    id='untilId'
                    style={{ backgroundColor: '#27293d' }}
                    value={until}
                    onChange={(e) => setUntil(e.target.value)}
                  />
                </Col>
              </Row>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button color='danger' onClick={toggle}>
              Cancel
            </Button>
            <Button color='success' onClick={addNewEvent}>
              Confirm
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={modalSelectCalendar}
          toggle={() => toggleModalSelectCalendar()}
          modalClassName='modal-black'
          autoFocus={false}
        >
          <ModalHeader close={closeBtn(toggleModalSelectCalendar)}>
            Handle your calendars
          </ModalHeader>
          <ModalBody>
            <Modal
              modalClassName='modal-black'
              isOpen={nestedModal}
              toggle={() => {
                toggleNested();
              }}
              onClosed={closeAll ? toggleModalSelectCalendar : undefined}
            >
              <ModalHeader close={closeBtn(toggleNested)}>
                Create a new calendar
              </ModalHeader>
              <ModalBody>
                <Label htmlFor='nameCalendarId'>Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id='nameCalendarId'
                />
                <Label htmlFor='ColorPickerId'>Color</Label>
                <br />
                <button
                  style={{
                    borderRadius: '20px',
                    color:
                      contrast(
                        [255, 255, 255],
                        [color?.r, color?.g, color?.b]
                      ) >= 4
                        ? 'white'
                        : 'black',
                    background: color
                      ? RGBAToHexA(color.r, color.g, color.b, color.a)
                      : null,
                    outline: 'none',
                    border: 'none',
                  }}
                  onClick={handleClick}
                >
                  Pick Color
                </button>
                {displayColorPicker ? (
                  <div style={popover}>
                    <div style={cover} onClick={handleClick} />
                    <ChromePicker
                      id='ColorPickerId'
                      color={color}
                      onChange={(e) => setColor(e.rgb)}
                    />
                  </div>
                ) : null}
                <br />
              </ModalBody>
              <ModalFooter>
                <Button
                  color='primary'
                  onClick={() => {
                    handleSave({
                      name,
                      color: color
                        ? RGBAToHexA(color.r, color.g, color.b, color.a)
                        : undefined,
                    });
                    toggleNested();
                  }}
                >
                  Save
                </Button>
                <Button
                  onClick={() => {
                    handleSave({
                      name,
                      color: color
                        ? RGBAToHexA(color.r, color.g, color.b, color.a)
                        : undefined,
                    });
                    toggleAll();
                  }}
                >
                  Save and Close All
                </Button>
              </ModalFooter>
            </Modal>
            <div
              aria-multiselectable={true}
              className='card-collapse'
              id='accordion'
              role='tablist'
            >
              <Card className='card-plain'>
                <CardHeader role='tab'>
                  <a
                    aria-expanded={openedCollapseOne}
                    href='#'
                    data-parent='#accordion'
                    data-toggle='collapse'
                    onClick={(e) => {
                      e.preventDefault();
                      setopenedCollapseOne(!openedCollapseOne);
                      setopenedCollapseTwo(false);
                    }}
                  >
                    Filter Calendar
                    <i className='tim-icons icon-minimal-down' />
                  </a>
                </CardHeader>
                <Collapse role='tabpanel' isOpen={openedCollapseOne}>
                  <CardBody>
                    <Input
                      id='calendarSelectorId'
                      type='select'
                      style={{ backgroundColor: '#27293d' }}
                    >
                      <option value=''>Select all</option>
                      {calendars.map((calendar) => (
                        <option key={calendar._id} value={calendar._id}>
                          {calendar.name}
                        </option>
                      ))}
                    </Input>
                    <div className='mt-3 row justify-content-center'>
                      <Button
                        color='success'
                        onClick={() => {
                          setCalendarslt(
                            document.querySelector('#calendarSelectorId').value
                          );
                          toggleModalSelectCalendar();
                        }}
                      >
                        Filter
                      </Button>
                    </div>
                  </CardBody>
                </Collapse>
              </Card>
              <Card className='card-plain'>
                <CardHeader role='tab'>
                  <a
                    aria-expanded={openedCollapseTwo}
                    href='#'
                    data-parent='#accordion'
                    data-toggle='collapse'
                    onClick={(e) => {
                      e.preventDefault();
                      setopenedCollapseTwo(!openedCollapseTwo);
                      setopenedCollapseOne(false);
                    }}
                  >
                    Manage Calendars
                    <i className='tim-icons icon-minimal-down' />
                  </a>
                </CardHeader>
                <Collapse role='tabpanel' isOpen={openedCollapseTwo}>
                  <CardBody>
                    {calendars.map((calendar) => (
                      <div
                        className='row justify-content-between'
                        key={calendar._id}
                      >
                        <FormGroup check className='form-check-radio'>
                          <Label check>
                            <Input
                              checked={calendar._id === investmentProjectId}
                              onChange={(e) =>
                                setInvestmentProjectId(e.target.value)
                              }
                              value={calendar._id}
                              id='exampleRadios2'
                              name='radiosToSelectProject'
                              type='radio'
                            />
                            <span className='form-check-sign' />
                            {calendar.name}
                          </Label>
                        </FormGroup>
                        <div>
                          <Button
                            className='btn-link'
                            data-id={calendar._id}
                            onClick={
                              (e) => {
                                setName(
                                  calendars.find(
                                    (calendar) =>
                                      calendar._id ===
                                      e.currentTarget.getAttribute('data-id')
                                  ).name
                                );
                                setColor(
                                  hexAToRGBA(
                                    calendars.find(
                                      (calendar) =>
                                        calendar._id ===
                                        e.currentTarget.getAttribute('data-id')
                                    ).color
                                  )
                                );
                                setCalendarId(
                                  e.currentTarget.getAttribute('data-id')
                                );

                                toggleNested();
                              }
                              // warningWithConfirmAndCancelMessage(
                              //   e.currentTarget.getAttribute('data-id'),
                              //   'calendar'
                              // )
                            }
                            color='warning'
                          >
                            <i className='fas fa-pencil-alt'></i>
                          </Button>
                          <Button
                            className='btn-link'
                            data-id={calendar._id}
                            onClick={(e) =>
                              warningWithConfirmAndCancelMessage(
                                e.currentTarget.getAttribute('data-id'),
                                'calendar'
                              )
                            }
                            color='danger'
                          >
                            <i className='fas fa-trash-alt'></i>
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Row>
                      <Button className='m-0' onClick={toggleNested}>
                        New Calendar
                      </Button>
                    </Row>
                  </CardBody>
                </Collapse>
              </Card>
            </div>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </Modal>

        <Row>
          <Col className='ml-auto mr-auto' md='10'>
            <Card className='card-calendar'>
              <CardHeader>
                <CardTitle className='row justify-content-between' tag='h2'>
                  <Col>
                    <div>
                      <i className='tim-icons icon-calendar-60'></i> Calendar
                    </div>
                  </Col>
                  <Col>
                    <Input
                      className='mx-auto'
                      style={{
                        width: '290px',
                        marginTop: '0',
                        fontSize: '1.2rem',
                      }}
                      type='month'
                      value={inputMonth}
                      onChange={(e) => {
                        const diffStart =
                          new Date().getTime() -
                          new Date(
                            new Date().getFullYear(),
                            new Date().getMonth(),
                            new Date().getDate()
                          ).getTime();
                        setInputMonth(e.target.value);
                        setDate(
                          new Date(
                            new Date(e.target.value + '-01').getTime() +
                              diffStart
                          )
                        );
                      }}
                    ></Input>
                  </Col>

                  <Col>
                    <Button
                      type='button'
                      style={{ float: 'right' }}
                      onClick={() => toggleModalSelectCalendar()}
                    >
                      Select Calendar
                    </Button>
                  </Col>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <BigCalendar
                  selectable
                  localizer={localizer}
                  events={calendarEvents}
                  view={view}
                  onView={handleView}
                  scrollToTime={new Date(1970, 1, 1, 6)}
                  date={date}
                  onNavigate={handleNavigate}
                  onSelectEvent={(event, pointerEvent) =>
                    selectedEvent(event, pointerEvent)
                  }
                  onSelectSlot={(slotInfo) => addNewEventAlert(slotInfo)}
                  eventPropGetter={eventColors}
                  eventPropGetter={eventStyleGetter}
                  onEventDrop={handleMoveEvent}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Calendar;

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
// react component used to create a calendar with events on it
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
// dependency plugin for react-big-calendar
import moment from 'moment';

// reactstrap components
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
} from 'reactstrap';
import NotificationAlert from 'react-notification-alert';
import 'moment-business-days';
import 'moment-recur';
import axios from 'axios';
import Config from '../config.json';
import {
  RGBAToHexA,
  contrast,
  hexAToRGBA,
  createDateString,
} from 'helpers/functions';

const localizer = momentLocalizer(moment);
// const DnDCalendar = withDragAndDrop(BigCalendar);

const Calendar = () => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState(undefined);
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const [calendarEvents, setCalendarEvents] = useState([]);
  // const [event, setEvents] = useState(events.filter((evt) => !evt.recurrent));
  const [alert, setAlert] = useState(null);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [recurringEvents, setRecurringEvents] = useState([]);
  const [initialEvents, setInitialEvents] = useState([]);

  const [allDay, setAllDay] = useState(true);
  const [until, setUntil] = useState('');
  const [selectedCalendar, setSelectedCalendar] = useState('');
  const [calendars, setCalendars] = useState([]);
  const [interval, setInterval] = useState(0);
  const [recurrence, setRecurrence] = useState('');
  const [isRecurringEvent, setIsRecurringEvent] = useState(false);
  const [description, setDescription] = useState('');
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [startFrom, setStartFrom] = useState('');
  const [endAt, setEndAt] = useState('');
  const [modal, setModal] = useState(false);

  const selectedEvent = (event, pointerEvent) => {
    console.log(event);
    if (pointerEvent.nativeEvent.offsetX <= 13) {
      deleteEvent(event._id);
    } else {
      setDescription(event.description);
      if (event.until) {
        setUntil(event.until.slice(0, 10));
      }
      setSelectedCalendar(event.calendar);
      setInterval(event.interval);
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
    const getEvents = async () => {
      const config = { headers: { Authorization: `Bearer ${login.token}` } };
      let { data } = await axios.get(
        `${Config.SERVER_ADDRESS}/api/calendars/`,
        config
      );

      setCalendars(data);
      setInitialEvents(
        ...data.map((calendar) =>
          calendar.eventCalendars.map((evt) => ({
            ...evt,
            start: new Date(evt.start),
            end: new Date(evt.end),
          }))
        )
      );
      setCalendarEvents(
        ...data.map((calendar) =>
          calendar.eventCalendars.map((event) => ({
            ...event,
            color: calendar.color,
          }))
        )
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
      calendar
    ) {
      this.currentMonth;
      this.start = start;
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
        start: this.start,
        end: endRecurrence,
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
      const end = moment(this.setCurrentEnd(), 'YYYY-MM-DD').endOf('week');
      const diff = new Date(this.end) - new Date(this.start);

      for (end; start.isBefore(end); start.add(1, 'day')) {
        if (this.rInterval.matches(start)) {
          ar.push({
            _id: this._id,
            description: this.description,
            title: this.title,
            start: new Date(start),
            end: new Date(new Date(start).getTime() + diff), //.add(diff, 'minutes').toDate(),
            recurrent: true,
            until: this.endRecurrence,
            color: this.color,
            freq: this.freq,
            interval: this.interval,
            allDay: this.allDay,
            calendar: this.calendar,
          });
        }
      }
      return ar;
    }
  }

  useEffect(() => {
    setRecurringEvents(
      initialEvents
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
              evt.calendar
            )
        )
    );
    const newEvents = initialEvents.filter((evt) => !evt.recurrent);
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
      setEndAt(
        moment(createDateString(slotInfo.end))
          .add(-1, 'days')
          .toDate()
          .toISOString()
          .slice(0, 10)
      );
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
    }
    let data;
    if (id === '') {
      try {
        data = await axios.post(
          `${Config.SERVER_ADDRESS}/api/eventCalendars/`,
          obj,
          config
        );
        data = data.data;
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
          `${Config.SERVER_ADDRESS}/api/eventCalendars/${id}`,
          obj,
          config
        );
        data = data.data;
        const pickedEvent = newEvents.findIndex((evt) => evt._id === id);
        newEvents[pickedEvent] = data;
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
              data.calendar
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
                data.calendar
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
              data.calendar
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

  const deleteEvent = async (id) => {
    const config = { headers: { Authorization: `Bearer ${login.token}` } };
    await axios.delete(
      `${Config.SERVER_ADDRESS}/api/eventCalendars/${id}`,
      config
    );
    setCalendarEvents(calendarEvents.filter((evt) => evt._id !== id));
    setRecurringEvents(recurringEvents.filter((evt) => evt._id !== id));
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
    var backgroundColor = event.color;
    var style = {
      backgroundColor: backgroundColor ? backgroundColor : null,
      borderRadius: '0px',
      opacity: 0.8,
      color: 'black',
      border: '0px',
      display: 'block',
      // height: '15px',
    };
    return {
      style: style,
      className: ['eventListenerClass', event.recurrent ? 'recurrent' : null],
    };
  };

  const closeBtn = (
    <button color='danger' className='close' onClick={() => toggle()}>
      <span style={{ color: 'white' }}>×</span>
    </button>
  );
  const toggle = () => {
    setModal(!modal);
    if (modal) {
      setDescription('');
      setColor(undefined);
      setId('');
      setIsRecurringEvent(false);
      setTitle('');
      setSelectedCalendar('');
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
          <ModalHeader close={closeBtn}>Add New Calendar Event</ModalHeader>
          <ModalBody>
            <Label>Calendar</Label>
            <Input
              type='select'
              autoFocus={true}
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
              <Label check>
                <Input
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
              id='startFromId'
              style={{ backgroundColor: '#27293d' }}
              type={!allDay ? 'datetime-local' : 'date'}
              value={startFrom}
              onChange={(e) => setStartFrom(e.target.value)}
            />
            <Label htmlFor='endAtId'>End At:</Label>
            <Input
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
              <Label check>
                <Input
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
                <Col md='4'>
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
                <Col md='4'>
                  <Label htmlFor='intervalId'>Interval</Label>
                  <Input
                    id='intervalId'
                    style={{ backgroundColor: '#27293d' }}
                    value={interval}
                    onChange={(e) => setInterval(e.target.value)}
                  />
                </Col>
                <Col md='4'>
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
        <Row>
          <Col className='ml-auto mr-auto' md='10'>
            <Card className='card-calendar'>
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

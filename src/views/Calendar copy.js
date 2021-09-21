import React, { useEffect, useState } from 'react';
// reactstrap components
import {
  Card,
  CardBody,
  Row,
  Col,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  FormGroup,
  Button,
} from 'reactstrap';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
import FullCalendar, { formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';
import listPlugin from '@fullcalendar/list';
import axios from 'axios';
import Config from '../config.json';
import { addMinutes } from 'date-fns';

let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export function createEventId() {
  return String(eventGuid++);
}

const Calendar = () => {
  const [until, setUntil] = useState('');
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const [selectedCalendar, setSelectedCalendar] = useState('');
  const [calendars, setCalendars] = useState([]);
  const [interval, setInterval] = useState(0);
  const [recurrence, setRecurrence] = useState('');
  const [infoClick, setInfoClick] = useState(null);
  const [isRecurringEvent, setIsRecurringEvent] = useState(false);
  const [id, setId] = useState('');
  const [slotInfo, setSlotInfo] = useState('');
  const [title, setTitle] = useState('');
  const [startFrom, setStartFrom] = useState('');
  const [endAt, setEndAt] = useState('');
  const [modal, setModal] = useState(false);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [description, setDescription] = useState('');
  const [initialEvents, setInitialEvents] = useState([]);

  const stripTimeZoneOffset = (date) =>
    addMinutes(date, date.getTimezoneOffset());

  useEffect(() => {
    const getEvents = async () => {
      const config = { headers: { Authorization: `Bearer ${login.token}` } };
      let { data } = await axios.get(
        `${Config.SERVER_ADDRESS}/api/calendars/`,
        config
      );

      const setFrequency = (key) => {
        switch (key) {
          case 0:
            return 'yearly';
          case 1:
            return 'monthly';
          case 2:
            return 'weekly';
          case 3:
            return 'daily';

          default:
            break;
        }
      };
      data = data.map((dat) => ({
        ...dat,
        eventCalendars: dat.eventCalendars.map((event) =>
          event.recurrent ? event : { ...event, editable: true }
        ),
      }));
      // setInitialEvents([...data[0].eventCalendars]);
      setCalendars(data);
      setInitialEvents([
        ...data[0].eventCalendars
          .filter((event) => !event.recurrent)
          .map((event) => ({
            ...event,
            color: data[0].color,
            start: event.allDay
              ? event.start.slice(0, 10)
              : event.start.slice(0, 16),
            inicio: event.allDay
              ? event.start.slice(0, 10)
              : event.start.slice(0, 16),
            end: event.end
              ? event.allDay
                ? event.end.slice(0, 10)
                : event.end.slice(0, 16)
              : undefined,
            fim: event.end
              ? event.allDay
                ? event.end.slice(0, 10)
                : event.end.slice(0, 16)
              : undefined,
            id: event._id,
          })),
        ...data[0].eventCalendars
          .filter((event) => event.recurrent)
          .map((event) => ({
            ...event,
            start: event.allDay
              ? event.start.slice(0, 10)
              : event.start.slice(0, 16),
            inicio: event.allDay
              ? event.start.slice(0, 10)
              : event.start.slice(0, 16),
            end: event.end
              ? event.allDay
                ? event.end.slice(0, 10)
                : event.end.slice(0, 16)
              : undefined,
            fim: event.end
              ? event.allDay
                ? event.end.slice(0, 10)
                : event.end.slice(0, 16)
              : undefined,
            allDay: event.allDay,
            color: data[0].color,
            rrule: {
              dtstart: event.allDay
                ? event.start.slice(0, 10)
                : event.start.slice(0, 16),
              until: event.until
                ? event.allDay
                  ? event.until.slice(0, 10)
                  : event.until.slice(0, 16)
                : undefined,
              freq: setFrequency(event.freq),
              interval: event.interval,
            },
            id: event._id,
          })),
      ]);
    };
    getEvents();
  }, []);

  const addNewEventAlert = (slotInfo) => {
    setSlotInfo(slotInfo);
    if (slotInfo.allDay) {
      setStartFrom(slotInfo.startStr);
      setEndAt(slotInfo.endStr);
    } else {
      setStartFrom(slotInfo.startStr.slice(0, 16));
      setEndAt(slotInfo.endStr.slice(0, 16));
    }

    toggle();
  };
  const addNewEvent = () => {
    // clear date selection
    if (id) {
      let click = infoClick.event;
      console.log(click);
      click.setProp('allDay', slotInfo.allDay);
      click.setProp('id', id);
      click.setProp('title', title);
      click.setProp('color', 'orange');
      if (click._def?.recurringDef === null) {
        click.setDates(startFrom, endAt, { allDay: infoClick.event.allDay });
      }
      click.setExtendedProp('inicio', startFrom);
      click.setExtendedProp('fim', endAt);
      click.setExtendedProp('description', description);
    } else {
      let calendarApi = slotInfo.view.calendar;
      calendarApi.unselect();
      let obj = {
        id: createEventId(),
        title: title,
        start: startFrom,
        end: endAt,
        allDay: slotInfo.allDay,
        color: 'orange',
        description: 'teste',
      };
      if (!isRecurringEvent) {
        obj.editable = true;
      }
      if (isRecurringEvent && recurrence !== '') {
        let recString;
        switch (recurrence) {
          case `0`:
            recString = 'DAILY';
            break;
          case `1`:
            recString = 'WEEKLY';
            break;
          case `2`:
            recString = 'MONTHLY';
            break;
          case `3`:
            recString = 'YEARLY';
            break;
          default:
            break;
        }
        obj['rrule'] = {
          dtstart: startFrom,
          until: until,
          freq: recString,
          interval: interval === '' ? 0 : Number(interval),
        };
      }
      calendarApi.addEvent(obj);
    }
    toggle();
  };

  const handleEventClick = (clickInfo) => {
    const clicked = currentEvents.find(
      (evt) => evt._def.extendedProps._id === clickInfo.id
    );
    console.log(clicked, clickInfo);
    if (clickInfo.jsEvent.offsetX < 11) {
      if (
        confirm(
          `Are you sure you want to delete the event '${clickInfo.event.title}'`
        )
      ) {
        clickInfo.event.remove();
      }
    } else {
      setInfoClick(clickInfo);
      setId(clickInfo.event.extendedProps._id);
      setSlotInfo({ ...slotInfo, allDay: clickInfo.event.allDay });
      setTitle(clickInfo.event.title);
      setDescription(clickInfo.event.extendedProps.description);
      if (clickInfo.event.allDay) {
        setStartFrom(clickInfo.event._def.extendedProps.inicio.slice(0, 10));
        setEndAt(clickInfo.event._def.extendedProps.fim.slice(0, 10));
      } else {
        setStartFrom(clickInfo.event._def.extendedProps.inicio.slice(0, 16));
        setEndAt(clickInfo.event._def.extendedProps.fim.slice(0, 16));
      }
      if (clickInfo.event._def.recurringDef !== null) {
        setIsRecurringEvent(true);
        setUntil(
          clickInfo.event._def.recurringDef.typeData.rruleSet._rrule[0].options.until
            .toISOString()
            .slice(0, 10)
        );
        let recurrStr;
        let variable =
          clickInfo.event._def.recurringDef.typeData.rruleSet._rrule[0].options
            .freq;
        switch (variable) {
          case 0:
            recurrStr = '3';
            break;
          case 1:
            recurrStr = '2';
            break;
          case 2:
            recurrStr = '1';
            break;
          case 3:
            recurrStr = '0';
            break;

          default:
            break;
        }
        setRecurrence(recurrStr);
        setInterval(
          clickInfo.event._def.recurringDef.typeData.rruleSet._rrule[0].options
            .interval
        );
        // if (clickInfo.event.allDay) {
        //   setStartFrom(clickInfo.event.startStr.slice(0, 10));
        //   setEndAt(
        //     clickInfo.event._def.recurringDef.typeData.rruleSet._rrule[0]
        //       .options.until
        //       ? clickInfo.event._def.recurringDef.typeData.rruleSet._rrule[0].options.until
        //           .toISOString()
        //           .slice(0, 10)
        //       : ''
        //   );
        // } else {
        //   setStartFrom(clickInfo.event.startStr.slice(0, 16));
        //   setEndAt(
        //     clickInfo.event._def.recurringDef.typeData.rruleSet._rrule[0]
        //       .options.until
        //       ? clickInfo.event._def.recurringDef.typeData.rruleSet._rrule[0].options.until
        //           .toISOString()
        //           .slice(0, 16)
        //       : ''
        //   );
        // }
      }
      toggle();
    }
  };
  const handleEvents = (events) => {
    setCurrentEvents(events);
  };
  const closeBtn = (
    <button color='danger' className='close' onClick={() => toggle()}>
      <span style={{ color: 'white' }}>×</span>
    </button>
  );
  const toggle = () => {
    setModal(!modal);
    if (modal) {
      setId('');
      setIsRecurringEvent(false);
      setTitle('');
      setDescription('');
    }
  };

  const updateEvent = async (event) => {
    const config = { headers: { Authorization: `Bearer ${login.token}` } };
    const obj = {
      title: event.event.title,
      start: event.event.startStr,
      end: event.event.endStr || endAt,
      allDay: event.event.allDay,
    };
    if (isRecurringEvent) {
      obj.recurrent = true;
      obj.freq = recurrence;
      obj.interval = interval;
      obj.until = until;
    } else {
      obj.recurrent = false;
    }
    const { data } = await axios.put(
      `${Config.SERVER_ADDRESS}/api/eventCalendars/${event.event.extendedProps._id}`,
      obj,
      config
    );

    if (data.recurrent) {
      window.location.reload();
    }
  };

  const addEvent = async (event) => {
    const config = { headers: { Authorization: `Bearer ${login.token}` } };
    let obj = {
      title: event.event.title,
      start: startFrom,
      end: endAt,
      allDay: event.event.allDay,
      calendar: selectedCalendar,
    };
    if (event.event._def.recurringDef !== null) {
      obj.recurrent = true;
      obj.freq =
        event.event._def.recurringDef.typeData.rruleSet._rrule[0].options.freq;
      obj.interval =
        event.event._def.recurringDef.typeData.rruleSet._rrule[0].options.interval;
      obj.until = until;
    } else {
      obj.recurrent = false;
    }
    const { data } = await axios.post(
      `${Config.SERVER_ADDRESS}/api/eventCalendars/`,
      obj,
      config
    );
    event.event.setProp('id', data._id);
    event.event.setExtendedProp('_id', data._id);
  };

  const deleteEvent = async (event) => {
    const config = { headers: { Authorization: `Bearer ${login.token}` } };
    await axios.delete(
      `${Config.SERVER_ADDRESS}/api/eventCalendars/${event.event._def.extendedProps._id}`,
      config
    );
  };
  return (
    <>
      <div className='content'>
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
                  id='allDayId'
                  style={{ backgroundColor: '#27293d' }}
                  checked={slotInfo.allDay}
                  onChange={(e) => {
                    setSlotInfo({ ...slotInfo, allDay: e.target.checked });
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
              type={!slotInfo.allDay ? 'datetime-local' : 'date'}
              value={startFrom}
              onChange={(e) => setStartFrom(e.target.value)}
            />

            <Label htmlFor='endAtId'>End At:</Label>
            <Input
              id='endAtId'
              style={{ backgroundColor: '#27293d' }}
              type={!slotInfo.allDay ? 'datetime-local' : 'date'}
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
            />
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
                    onChange={(e) => {
                      console.log(e.target);
                      setRecurrence(e.target.value);
                    }}
                  >
                    <option value='' disabled>
                      Select an option
                    </option>
                    <option value='0'>Daily</option>
                    <option value='1'>Weekly</option>
                    <option value='2'>Monthly</option>
                    <option value='3'>Yearly</option>
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
                <FullCalendar
                  plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                    rrulePlugin,
                    listPlugin,
                  ]}
                  buttonText={{
                    today: 'Today',
                    month: 'Month',
                    week: 'Week',
                    day: 'Day',
                    listMonth: 'List Month',
                    listWeek: 'List Week',
                  }}
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right:
                      'dayGridMonth,timeGridWeek,timeGridDay,listWeek,listMonth',
                  }}
                  initialView='dayGridMonth'
                  editable={false}
                  height={800}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  weekends={weekendsVisible}
                  events={initialEvents} // alternatively, use the `events` setting to fetch from a feed
                  select={addNewEventAlert}
                  eventClick={handleEventClick}
                  eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                  /* you can update a remote database when these fire:*/
                  eventAdd={function (event) {
                    addEvent(event);
                  }}
                  eventChange={function (event) {
                    updateEvent(event);
                  }}
                  eventRemove={function (event) {
                    deleteEvent(event);
                  }}
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

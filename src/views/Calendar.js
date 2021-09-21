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
import { useEffect, useState } from 'react';
// react component used to create a calendar with events on it
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
// dependency plugin for react-big-calendar
import moment from 'moment';
// react component used to create alerts
import SweetAlert from 'react-bootstrap-sweetalert';
// reactstrap components
import { Card, CardBody, Row, Col } from 'reactstrap';
import { events } from 'variables/general.js';
import 'moment-recur';

const localizer = momentLocalizer(moment);
// const DnDCalendar = withDragAndDrop(BigCalendar);

const Calendar = () => {
  const [event, setEvents] = useState(events.filter((evt) => !evt.recurrent));
  const [alert, setAlert] = useState(null);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [recurringEvents, setRecurringEvents] = useState([]);

  const selectedEvent = (event) => {
    console.log(event);
    window.alert(event.title);
  };

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
      exceptions
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
      this.rInterval = moment().recur({
        start: this.start,
        end: endRecurrence,
        rules: [{ units: { [interval]: true }, measure: freq }],
        exceptions: exceptions,
      });
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
      const start = moment(this.setCurrentStart()).isoWeekday(0);
      for (
        const end = moment(this.setCurrentEnd()).add(1, 'weeks').isoWeekday(6);
        start.isBefore(end);
        start.add(1, 'day')
      ) {
        if (this.rInterval.matches(start)) {
          ar.push({
            title: this.title,
            start: new Date(start),
            end: new Date(start),
            recurrent: true,
            color: this.color,
          });
        }
      }
      return ar;
    }
  }

  useEffect(() => {
    setRecurringEvents(
      events
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
              evt.endRecurrence
            )
        )
    );
  }, [events]);

  useEffect(() => {
    const newEvents = event.filter((evt) => !evt.recurrent);
    recurringEvents.forEach((element) => {
      element.setCurrentMonth(date);
      element.getMonths().forEach((elm) => {
        newEvents.push(elm);
      });
    });
    setEvents(newEvents);
  }, [date]);

  //initial set of dates

  const addNewEventAlert = (slotInfo) => {
    setAlert(
      <SweetAlert
        input
        showCancel
        style={{ display: 'block', marginTop: '-100px' }}
        title='Input something'
        onConfirm={(e) => addNewEvent(e, slotInfo)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle='info'
        cancelBtnBsStyle='danger'
      />
    );
  };
  const addNewEvent = (e, slotInfo) => {
    var newEvents = events;
    newEvents.push({
      title: e,
      start: slotInfo.start,
      end: slotInfo.end,
      teste: 'este é um, teste',
    });
    setAlert(null);
    setEvents(newEvents);
  };
  const hideAlert = () => {
    setAlert(null);
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
    console.log(event);
    const updatedEvent = { ...event.resource };
    updatedEvent.startDate = start;
    updatedEvent.endDate = end;
    updatedEvent.isAllDay = allDay;
    // updatedEvent.eventId = event.resource.id;
    // (updatedEvent)
  };

  const handleNavigate = (event, kind, direction, teste) => {
    console.log(event, kind, direction);
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
    };
    return {
      style: style,
      // className: ['eventListenerClass', event.recurrent ? 'recurrent' : null],
    };
  };

  useEffect(() => {
    document.querySelectorAll('.eventListenerClass').forEach((element) =>
      element.addEventListener('click', function (e) {
        console.log(e);
      })
    );
  }, []);

  return (
    <>
      <div className='content'>
        {alert}
        <Row>
          <Col className='ml-auto mr-auto' md='10'>
            <Card className='card-calendar'>
              <CardBody>
                <BigCalendar
                  selectable
                  localizer={localizer}
                  events={event}
                  view={view}
                  onView={handleView}
                  scrollToTime={new Date(1970, 1, 1, 6)}
                  date={date}
                  onNavigate={handleNavigate}
                  onSelectEvent={(event) => selectedEvent(event)}
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

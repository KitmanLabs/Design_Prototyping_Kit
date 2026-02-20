import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

import {
  CALENDAR_VIEW_OPTIONS,
  EVENT_TIME_FORMAT,
  CALENDAR_VIEWS,
} from './constants';
import { calendarStyles } from './styles';
import { getEventContent, sortEvents } from './helpers.jsx';

const FullCalendarComponent = ({
  onViewDidMount,
  forwardedRef,
  handleEventDrop,
  handleEventReceive,
  handleEventResize,
  handleEventSelect,
  handleEventClick,
  userLocale = 'en',
  orgTimeZone = 'UTC',
  events,
  currentCalendarView,
  setCalendarLoading,
  onDatesRender,
  initialDate,
}) => {
  const onEventDidMount = (arg) => {
    const {
      el,
      backgroundColor,
      event: { extendedProps },
    } = arg;

    // Handle event styling for list view
    if (currentCalendarView === 'listWeek' && backgroundColor === '#FFFFFF') {
      const marker = el.querySelector('.fc-list-event-dot');
      if (marker) {
        marker.style.borderWidth = '1px';
        marker.style.padding = '4px';
      }
    }
  };

  const plugins = [
    dayGridPlugin,
    timeGridPlugin,
    listPlugin,
    interactionPlugin,
  ];

  const buttonText = {
    today: 'Today',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    list: 'List',
  };

  return (
    <div
      className="calendar"
      style={calendarStyles.calendar}
    >
      <FullCalendar
        ref={forwardedRef}
        initialView={currentCalendarView || CALENDAR_VIEW_OPTIONS.dayGridMonth}
        initialDate={initialDate}
        plugins={plugins}
        timeZone={orgTimeZone}
        locale={userLocale}
        headerToolbar={false}
        buttonText={buttonText}
        displayEventTime
        displayEventEnd
        firstDay={1} // Monday start
        height="auto"
        selectable={false}
        droppable={false}
        moreLinkClick="popover"
        fixedWeekCount={true}
        showNonCurrentDates={false}
        select={(selectionInfo) =>
          handleEventSelect && handleEventSelect(selectionInfo, orgTimeZone)
        }
        editable={false}
        eventOverlap
        events={events}
        eventOrder={[
          (firstEvent, secondEvent) => sortEvents(firstEvent, secondEvent),
          'start',
        ]}
        eventClick={handleEventClick}
        eventReceive={(eventObj) =>
          handleEventReceive && handleEventReceive(eventObj, orgTimeZone)
        }
        eventResize={(eventResizeInfo) =>
          handleEventResize && handleEventResize(eventResizeInfo, orgTimeZone)
        }
        eventDrop={(eventDropInfo) =>
          handleEventDrop && handleEventDrop(eventDropInfo, orgTimeZone)
        }
        loading={setCalendarLoading}
        eventTimeFormat={EVENT_TIME_FORMAT}
        allDaySlot={true}
        eventContent={(eventRenderArg) =>
          getEventContent(currentCalendarView, eventRenderArg)
        }
        eventDidMount={onEventDidMount}
        datesSet={onDatesRender}
        eventMinHeight={20}
        viewDidMount={onViewDidMount}
        slotDuration="00:30:00"
        defaultTimedEventDuration="00:01"
        slotLabelFormat={EVENT_TIME_FORMAT}
        snapDuration="00:15:00"
        views={CALENDAR_VIEWS}
        dayMaxEventRows={3}
        nowIndicator
        navLinks
      />
    </div>
  );
};

export default FullCalendarComponent;

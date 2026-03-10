import React, { useState, useRef, forwardRef, useEffect } from 'react';
import FullCalendarComponent from './FullCalendarComponent';
import { calendarStyles } from './styles';

const Calendar = forwardRef(({
  handleEventClick,
  onViewChange,
  selectedCalendarView,
  events = [],
  orgTimeZone = "Utc",
  userLocale = 'en',
  initialDate,
  ...restProps
}, ref) => {
  const [currentCalendarView, setCurrentCalendarView] = useState(
    selectedCalendarView || 'dayGridMonth'
  );
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);
  const internalRef = useRef(null);
  const forwardedRef = ref || internalRef;

  useEffect(() => {
    if (!selectedCalendarView) return;
    setCurrentCalendarView(selectedCalendarView);
    const el = forwardedRef?.current;
    if (!el?.getApi) return;
    const api = el.getApi();
    if (api.view?.type !== selectedCalendarView) {
      api.changeView(selectedCalendarView);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCalendarView]);

  const handleViewChange = (viewInfo) => {
    setCurrentCalendarView(viewInfo.view.type);
    if (onViewChange) {
      onViewChange(viewInfo);
    }
  };

  const handleEventClickInternal = (eventObj) => {
    if (handleEventClick) {
      handleEventClick(eventObj);
    }
  };

  const setCalendarLoading = (isLoading) => {
    // Handle loading state if needed
  };

  const onDatesRender = (datesRenderInfo) => {
    // Handle date range changes if needed
  };

  return (
    <div style={calendarStyles.pageContainer}>
      <div style={calendarStyles.calendarWrapper}>
        <FullCalendarComponent
          onViewDidMount={handleViewChange}
          forwardedRef={forwardedRef}
          handleEventClick={handleEventClickInternal}
          currentCalendarView={currentCalendarView}
          events={events}
          orgTimeZone={orgTimeZone}
          userLocale={userLocale}
          setCalendarLoading={setCalendarLoading}
          onDatesRender={onDatesRender}
          initialDate={initialDate}
          {...restProps}
        />
      </div>
    </div>
  );
});

Calendar.displayName = 'Calendar';

export default Calendar;

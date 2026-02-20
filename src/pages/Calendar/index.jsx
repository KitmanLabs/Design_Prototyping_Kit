import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box } from '@mui/material';
import FiltersSidebar from '../../components/FiltersSidebar';
import CalendarHeader from '../../components/CalendarHeader';
import Calendar from '../../components/Calendar';
import EventTooltip from '../../components/EventTooltip';
import AddEventSidebar from '../../components/AddEventSidebar';
import AddSessionDrawer from '../../components/AddSessionDrawer';
import AddGameDrawer from '../../components/AddGameDrawer';
import calendarEventsData from '../../data/calendar_events.json';
import athletesData from '../../data/athletes.json';
import staffData from '../../data/users_staff.json';
import '../../styles/calendar.css';

const CalendarPage = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddEventSidebar, setShowAddEventSidebar] = useState(false);
  const [showAddSessionDrawer, setShowAddSessionDrawer] = useState(false);
  const [showAddGameDrawer, setShowAddGameDrawer] = useState(false);
  const [tooltip, setTooltip] = useState({ show: false, event: null, position: { x: 0, y: 0 } });
  const [currentDate, setCurrentDate] = useState(new Date('2025-09-01'));
  const calendarRef = useRef(null);

  const [activeFilters, setActiveFilters] = useState({
    squads: 0,
    types: 0,
    attendees: 0,
    location: 0,
    games: 0,
  });

  const [filters, setFilters] = useState({
    squads: [],
    types: [],
    locations: [],
  });

  useEffect(() => {
    const eventsWithoutUrls = calendarEventsData.map(event => {
      const { url, ...rest } = event;
      return rest;
    });
    setAllEvents(eventsWithoutUrls);
    setEvents(eventsWithoutUrls);
  }, []);

  const availableOptions = useMemo(() => {
    const squads = new Set();
    const types = new Set();
    const locations = new Set();
    allEvents.forEach(ev => {
      const squad = ev?.extendedProps?.squad;
      if (squad) squads.add(squad);
      const type = ev?.extendedProps?.eventType;
      if (type) types.add(type);
      const location = ev?.extendedProps?.location;
      if (location) locations.add(location);
    });
    return {
      squads: Array.from(squads).sort(),
      types: Array.from(types).sort(),
      locations: Array.from(locations).sort(),
    };
  }, [allEvents]);

  useEffect(() => {
    if (availableOptions.squads.length && filters.squads.length === 0) {
      setFilters({
        squads: availableOptions.squads,
        types: availableOptions.types,
        locations: availableOptions.locations,
      });
      setActiveFilters(prev => ({
        ...prev,
        squads: availableOptions.squads.length,
        types: availableOptions.types.length,
        location: availableOptions.locations.length,
      }));
    }
  }, [availableOptions, filters.squads.length]);

  useEffect(() => {
    if (!allEvents.length) return;
    const filtered = allEvents.filter(ev => {
      const squad = ev?.extendedProps?.squad;
      const type = ev?.extendedProps?.eventType;
      const location = ev?.extendedProps?.location;
      const squadOk = !filters.squads.length || filters.squads.includes(squad);
      const typeOk = !filters.types.length || filters.types.includes(type);
      const locationOk = !filters.locations.length || filters.locations.includes(location);
      return squadOk && typeOk && locationOk;
    });
    setEvents(filtered);
  }, [allEvents, filters]);

  const calculateTooltipPosition = (eventRect, containerRect, tooltipWidth = 400, tooltipHeight = 200) => {
    const padding = 10;
    const eventLeft = eventRect.left - containerRect.left;
    const eventTop = eventRect.top - containerRect.top;
    const eventRight = eventLeft + eventRect.width;
    const eventBottom = eventTop + eventRect.height;
    const eventCenterX = eventLeft + (eventRect.width / 2);
    const eventCenterY = eventTop + (eventRect.height / 2);
    const spaceRight = containerRect.width - eventRight - padding;
    const spaceLeft = eventLeft - padding;
    const spaceBelow = containerRect.height - eventBottom - padding;
    const spaceAbove = eventTop - padding;

    let x, y;
    if (spaceRight >= tooltipWidth) {
      x = eventRight;
      y = eventCenterY - (tooltipHeight / 2);
    } else if (spaceLeft >= tooltipWidth) {
      x = eventLeft - tooltipWidth;
      y = eventCenterY - (tooltipHeight / 2);
    } else if (spaceBelow >= tooltipHeight) {
      x = eventCenterX - (tooltipWidth / 2);
      y = eventBottom;
    } else if (spaceAbove >= tooltipHeight) {
      x = eventCenterX - (tooltipWidth / 2);
      y = eventTop - tooltipHeight;
    } else {
      x = eventRight;
      y = eventCenterY - (tooltipHeight / 2);
    }
    x = Math.max(padding, Math.min(x, containerRect.width - tooltipWidth - padding));
    y = Math.max(padding, Math.min(y, containerRect.height - tooltipHeight - padding));
    return { x, y };
  };

  const handleEventClick = (eventObj) => {
    eventObj.jsEvent.preventDefault();
    eventObj.jsEvent.stopPropagation();
    const event = eventObj.event;
    const jsEvent = eventObj.jsEvent;
    setTooltip({ show: false, event: null, position: { x: 0, y: 0 } });

    setTimeout(() => {
      const eventRect = jsEvent.target.getBoundingClientRect();
      const calendarContainer = document.querySelector('.calendar');
      if (!calendarContainer) return;
      const containerRect = calendarContainer.getBoundingClientRect();
      const { x, y } = calculateTooltipPosition(eventRect, containerRect);
      setTooltip({ show: true, event: event, position: { x, y } });
    }, 0);
    return false;
  };

  const handleViewChange = (viewInfo) => {
    setCurrentView(viewInfo.view.type);
  };

  const handleAddEvent = () => setShowAddEventSidebar(true);
  const handleSaveEvent = (newEvent) => {
    setEvents(prev => [...prev, newEvent]);
    setShowAddEventSidebar(false);
  };
  const handleCloseAddEventSidebar = () => setShowAddEventSidebar(false);

  const handleAddSession = () => setShowAddSessionDrawer(true);
  const handleSaveSession = (newSession) => {
    setEvents(prev => [...prev, newSession]);
    setShowAddSessionDrawer(false);
  };
  const handleCloseAddSessionDrawer = () => setShowAddSessionDrawer(false);

  const handleAddGame = () => setShowAddGameDrawer(true);
  const handleSaveGame = (newGame) => {
    setEvents(prev => [...prev, newGame]);
    setShowAddGameDrawer(false);
  };
  const handleCloseAddGameDrawer = () => setShowAddGameDrawer(false);

  const handleEditEvent = (eventData) => {
    const title = eventData?.title ?? eventData?.event?.title;
    alert(`Edit event: ${title}`);
  };

  const handleDeleteEvent = (eventData) => {
    const ev = eventData?.event ?? eventData;
    const id = ev?.id;
    const title = ev?.title ?? 'this event';
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleMoreDetails = (eventData) => {
    const ev = eventData?.event ?? eventData;
    const title = ev?.title ?? 'Event';
    const extendedProps = ev?.extendedProps ?? {};
    alert(`More details for: ${title}\nSquad: ${extendedProps.squad}\nLocation: ${extendedProps.location}`);
  };

  const handleDuplicateEvent = () => {
    setTooltip({ show: false, event: null, position: { x: 0, y: 0 } });
  };

  const handleToggleFilters = () => setShowFilters(!showFilters);

  const handleNavigate = (direction) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      if (direction === 'prev') calendarApi.prev();
      else if (direction === 'next') calendarApi.next();
      else if (direction === 'today') calendarApi.today();
      setCurrentDate(calendarApi.getDate());
    }
  };

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(newDate);
    }
  };

  const handleCloseTooltip = () => {
    setTooltip({ show: false, event: null, position: { x: 0, y: 0 } });
  };

  const getTotalActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((total, count) => total + count, 0);
  };

  const handleFiltersChange = (updated) => {
    setFilters(updated);
    setActiveFilters(prev => ({
      ...prev,
      squads: updated.squads.length,
      types: updated.types.length,
      location: updated.locations.length,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltip.show && !event.target.closest('.event-tooltip')) {
        handleCloseTooltip();
      }
    };
    if (tooltip.show) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [tooltip.show]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#ffffff',
        position: 'relative',
      }}
    >
      <CalendarHeader
        currentView={currentView}
        onViewChange={setCurrentView}
        onAddEvent={handleAddEvent}
        onAddSession={handleAddSession}
        onAddGame={handleAddGame}
        onToggleFilters={handleToggleFilters}
        showFilters={showFilters}
        onNavigate={handleNavigate}
        currentDate={currentDate}
        onDateChange={handleDateChange}
        activeFilterCount={getTotalActiveFilterCount()}
      />

      <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {showFilters && (
          <Box sx={{ width: '340px', flexShrink: 0 }}>
            <FiltersSidebar
              onClose={() => setShowFilters(false)}
              selectedFilters={filters}
              availableOptions={availableOptions}
              onFiltersChange={handleFiltersChange}
            />
          </Box>
        )}

        <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <Box sx={{ width: '100%', height: '100%', minHeight: '600px' }}>
            <Calendar
              key={`calendar-${showFilters}`}
              ref={calendarRef}
              handleEventClick={handleEventClick}
              onViewChange={handleViewChange}
              selectedCalendarView={currentView}
              orgTimeZone="UTC"
              userLocale="en"
              events={events}
              initialDate={currentDate.toISOString().split('T')[0]}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              onMoreDetails={handleMoreDetails}
            />
          </Box>
        </Box>
      </Box>

      {tooltip.show && (
        <EventTooltip
          key={tooltip.event?.id || 'tooltip'}
          event={tooltip.event}
          position={tooltip.position}
          onClose={handleCloseTooltip}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onMoreDetails={handleMoreDetails}
          onDuplicate={handleDuplicateEvent}
        />
      )}

      <AddEventSidebar
        open={showAddEventSidebar}
        onClose={handleCloseAddEventSidebar}
        onSave={handleSaveEvent}
        athletes={athletesData}
        staff={staffData}
      />

      <AddSessionDrawer
        open={showAddSessionDrawer}
        onClose={handleCloseAddSessionDrawer}
        onSave={handleSaveSession}
        athletes={athletesData}
        staff={staffData}
      />

      <AddGameDrawer
        open={showAddGameDrawer}
        onClose={handleCloseAddGameDrawer}
        onSave={handleSaveGame}
        athletes={athletesData}
        staff={staffData}
      />
    </Box>
  );
};

export default CalendarPage;

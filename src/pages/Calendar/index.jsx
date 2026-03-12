import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box } from '@mui/material';
import FiltersSidebar from '../../components/FiltersSidebar';
import CalendarHeader from '../../components/CalendarHeader';
import Calendar from '../../components/Calendar';
import EventTooltip from '../../components/EventTooltip';
import EventDetailsDialog from '../../components/EventDetailsDialog';
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
  const [editingEvent, setEditingEvent] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, event: null, position: { x: 0, y: 0 } });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsEvent, setDetailsEvent] = useState(null);
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
    sessions: [],
    gamesCompetition: undefined,
    gamesOpposition: undefined,
    attendeesAthletes: [],
    attendeesStaff: [],
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
      const type = ev?.extendedProps?.typeCategory || ev?.extendedProps?.eventType;
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
    if (!allEvents.length) return;
    const filtered = allEvents.filter(ev => {
      const ep = ev?.extendedProps || {};
      const squad = ep.squad;
      const typeCategory = ep.typeCategory || ep.eventType;
      const location = ep.location;
      const sessionType = ep.sessionType;
      const competition = ep.competition;
      const opposition = ep.opposition;
      const attendeeIds = ep.attendeeIds || [];
      const staffIds = ep.staffIds || [];

      const squadOk = !filters.squads?.length || filters.squads.includes(squad);
      const typeOk = !filters.types?.length || filters.types.includes(typeCategory);
      const locationOk = !filters.locations?.length || filters.locations.includes(location);
      const sessionsOk = !filters.sessions?.length || (sessionType && filters.sessions.includes(sessionType));
      const competitionOk = !filters.gamesCompetition || competition === filters.gamesCompetition;
      const oppositionOk = !filters.gamesOpposition || opposition === filters.gamesOpposition;
      const athletesOk = !filters.attendeesAthletes?.length || filters.attendeesAthletes.some(id => attendeeIds.includes(id));
      const staffOk = !filters.attendeesStaff?.length || filters.attendeesStaff.some(id => staffIds.includes(id));

      return squadOk && typeOk && locationOk && sessionsOk && competitionOk && oppositionOk && athletesOk && staffOk;
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
    setAllEvents(prev => [...prev, newEvent]);
    setEvents(prev => [...prev, newEvent]);
    setShowAddEventSidebar(false);
    setEditingEvent(null);
  };
  const handleCloseAddEventSidebar = () => {
    setShowAddEventSidebar(false);
    setEditingEvent(null);
  };

  const handleAddSession = () => setShowAddSessionDrawer(true);
  const handleSaveSession = (newSession) => {
    setAllEvents(prev => [...prev, newSession]);
    setEvents(prev => [...prev, newSession]);
    setShowAddSessionDrawer(false);
    setEditingEvent(null);
  };
  const handleCloseAddSessionDrawer = () => {
    setShowAddSessionDrawer(false);
    setEditingEvent(null);
  };

  const handleAddGame = () => setShowAddGameDrawer(true);
  const handleSaveGame = (newGame) => {
    setAllEvents(prev => [...prev, newGame]);
    setEvents(prev => [...prev, newGame]);
    setShowAddGameDrawer(false);
    setEditingEvent(null);
  };
  const handleCloseAddGameDrawer = () => {
    setShowAddGameDrawer(false);
    setEditingEvent(null);
  };

  const handleEditEvent = (eventData) => {
    const ev = eventData?.event ?? eventData;
    const eventType = ev?.extendedProps?.eventType;
    
    // Close tooltip
    setTooltip({ show: false, event: null, position: { x: 0, y: 0 } });
    
    // Set the event being edited
    setEditingEvent(ev);
    
    // Open appropriate panel based on event type
    if (eventType === 'TRAINING_SESSION' || eventType === 'TEST_SESSION') {
      setShowAddSessionDrawer(true);
    } else if (eventType === "Game" || eventType === "Match") {
      setShowAddGameDrawer(true);
    } else {
      // Default to event sidebar for other types
      setShowAddEventSidebar(true);
    }
  };

  const handleDeleteEvent = (eventData) => {
    const ev = eventData?.event ?? eventData;
    const id = ev?.id;
    const title = ev?.title ?? 'this event';
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setAllEvents(prev => prev.filter(e => e.id !== id));
      setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleMoreDetails = (eventData) => {
    const ev = eventData?.event ?? eventData;
      // close tooltip and open details dialog with same header style as tooltip
      setTooltip({ show: false, event: null, position: { x: 0, y: 0 } });
      setDetailsEvent(ev);
      setDetailsOpen(true);
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
      squads: updated.squads?.length || 0,
      types: updated.types?.length || 0,
      location: updated.locations?.length || 0,
      sessions: updated.sessions?.length || 0,
      games: (updated.gamesCompetition ? 1 : 0) + (updated.gamesOpposition ? 1 : 0),
      attendees: (updated.attendeesAthletes?.length || 0) + (updated.attendeesStaff?.length || 0),
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
        minWidth: 0,
        backgroundColor: 'var(--color-background-primary)',
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
              athletes={athletesData}
              staff={staffData}
            />
          </Box>
        )}

        <Box sx={{ flex: 1, minHeight: 0, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ flex: 1, minHeight: 0, minWidth: 0, display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Calendar
              key={`calendar-${showFilters}`}
              ref={calendarRef}
              handleEventClick={handleEventClick}
              onViewChange={handleViewChange}
              selectedCalendarView={currentView}
              orgTimeZone="Utc"
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
        editingEvent={editingEvent}
      />

      <AddSessionDrawer
        open={showAddSessionDrawer}
        onClose={handleCloseAddSessionDrawer}
        onSave={handleSaveSession}
        athletes={athletesData}
        staff={staffData}
        editingEvent={editingEvent}
      />

      <AddGameDrawer
        open={showAddGameDrawer}
        onClose={handleCloseAddGameDrawer}
        onSave={handleSaveGame}
        athletes={athletesData}
        staff={staffData}
        editingEvent={editingEvent}
      />
      <EventDetailsDialog
        open={detailsOpen}
        event={detailsEvent}
        onClose={() => {
          setDetailsOpen(false);
          setDetailsEvent(null);
        }}
        onEdit={(ev) => {
          // open edit panel for this event
          handleEditEvent(ev);
          setDetailsOpen(false);
          setDetailsEvent(null);
        }}
        athletes={athletesData}
        staff={staffData}
      />
    </Box>
  );
};

export default CalendarPage;

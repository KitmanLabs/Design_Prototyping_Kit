import React, { useState, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import moment from 'moment';
import FiltersSidebar from '../../components/FiltersSidebar';
import CalendarHeader from '../../components/CalendarHeader';
import SchedulerCalendar from '../../components/Calendar/SchedulerCalendar';
import { VIEW_STEP } from '../../components/Calendar/schedulerModel';
import { ConfirmationModal } from '../../playbook-components';
import { CALENDAR_EVENT_TYPES } from '../../data/calendarEventOptions';
import EventTooltip from '../../components/EventTooltip';
import EventDetailsDialog from '../../components/EventDetailsDialog';
import AddEventSidebar from '../../components/AddEventSidebar';
import AddSessionDrawer from '../../components/AddSessionDrawer';
import AddGameDrawer from '../../components/AddGameDrawer';
import calendarEventsData from '../../data/calendar_events.json';
import athletesData from '../../data/athletes.json';
import staffData from '../../data/users_staff.json';
import { PageHeader } from '../../floorplans';

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
  const [eventToDelete, setEventToDelete] = useState(null);

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

  // Called by SchedulerCalendar with the original event and an element to position against.
  const handleEventClick = (event, anchor) => {
    setTooltip({ show: false, event: null, position: { x: 0, y: 0 } });

    // Deferred so the click that opened the tooltip doesn't reach the outside-click listener.
    setTimeout(() => {
      const calendarContainer = document.querySelector('.calendar');
      if (!anchor || !calendarContainer) return;
      const eventRect = anchor.getBoundingClientRect();
      const containerRect = calendarContainer.getBoundingClientRect();
      const { x, y } = calculateTooltipPosition(eventRect, containerRect);
      setTooltip({ show: true, event, position: { x, y } });
    }, 0);
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
    
    // Open the panel for the event's type; custom events use the event panel
    if (eventType === CALENDAR_EVENT_TYPES.TRAINING_SESSION) {
      setShowAddSessionDrawer(true);
    } else if (eventType === CALENDAR_EVENT_TYPES.GAME) {
      setShowAddGameDrawer(true);
    } else {
      setShowAddEventSidebar(true);
    }
  };

  // Asks for confirmation in a Playbook ConfirmationModal before deleting
  const handleDeleteEvent = (eventData) => {
    setTooltip({ show: false, event: null, position: { x: 0, y: 0 } });
    setEventToDelete(eventData?.event ?? eventData);
  };

  const handleConfirmDelete = () => {
    const id = eventToDelete?.id;
    setAllEvents(prev => prev.filter(e => e.id !== id));
    setEvents(prev => prev.filter(e => e.id !== id));
    setEventToDelete(null);
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
    if (direction === 'today') {
      setCurrentDate(new Date());
      return;
    }
    const step = VIEW_STEP[currentView] || 'month';
    setCurrentDate((date) => moment(date).add(direction === 'next' ? 1 : -1, step).toDate());
  };

  const handleDateChange = (newDate) => setCurrentDate(newDate);

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
      {/* Workspace: the title only; the calendar's own toolbar below holds the tools and Add */}
      <PageHeader title="Calendar" />
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
            <SchedulerCalendar
              events={events}
              view={currentView}
              date={currentDate}
              onViewChange={setCurrentView}
              onDateChange={setCurrentDate}
              onEventClick={handleEventClick}
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
      <ConfirmationModal
        isModalOpen={Boolean(eventToDelete)}
        isDeleteAction
        onClose={() => setEventToDelete(null)}
        onCancel={() => setEventToDelete(null)}
        onConfirm={handleConfirmDelete}
        dialogContent={`"${eventToDelete?.title ?? 'This event'}" will be removed from the calendar.`}
        translatedText={{
          title: 'Delete event?',
          actions: { cancelButton: 'Cancel', ctaButton: 'Delete' },
        }}
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

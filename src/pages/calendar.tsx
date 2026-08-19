import { CalendarBlock } from "@/components/pouf/blocks/calendar";
import EventDetailsModal from "./components/event-details-modal";
import { useEventsStore } from "@/data/stores/useEventsStore";
import { useState } from "react";
import CreateEventModal from "./components/create-event-modal";
import { eventsListModel } from "@/data/models/eventList.model";
import type { Event } from "@/types";

function useCalendarPage() {
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const events = useEventsStore((state) => state.events);

  const eventsByDate = eventsListModel.get.byDate(events, selectedDate);

  return {
    selectedDate,
    showAddEventModal,
    setShowAddEventModal,
    events: eventsByDate,
    goToday: () => setSelectedDate(new Date()),
    nextDay: () =>
      setSelectedDate((prev) => new Date(prev.getTime() + 24 * 60 * 60 * 1000)),
    prevDay: () =>
      setSelectedDate((prev) => new Date(prev.getTime() - 24 * 60 * 60 * 1000)),
  };
}

export function CalendarPage() {
  const {
    selectedDate,
    events,
    nextDay,
    prevDay,
    goToday,
    showAddEventModal,
    setShowAddEventModal,
  } = useCalendarPage();

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const deleteEvent = useEventsStore((state) => state.deleteEvent);

  return (
    <>
      <CalendarBlock
        selectedDate={selectedDate}
        events={events}
        nextDay={nextDay}
        goToday={goToday}
        prevDay={prevDay}
        onAddEventPressed={() => setShowAddEventModal(true)}
        onEventPressed={(event) => setSelectedEvent(event)}
      />
      <CreateEventModal
        selectedDate={selectedDate}
        showAddEventModal={showAddEventModal}
        setShowAddEventModal={setShowAddEventModal}
      />
      <EventDetailsModal
        event={selectedEvent}
        open={Boolean(selectedEvent)}
        onOpenChange={(open) => {
          if (!open) setSelectedEvent(null);
        }}
        onDelete={(event) => {
          deleteEvent(event);
          setSelectedEvent(null);
        }}
      />
    </>
  );
}

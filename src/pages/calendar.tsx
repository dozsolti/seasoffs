import { CalendarBlock } from "@/components/pouf/blocks/calendar";
import { useEventsStore } from "@/data/stores/useEventsStore";
import { useState } from "react";
import CreateEventModal from "./components/create-event-modal";
import { eventsListModel } from "@/data/models/eventList.model";

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

  return (
    <>
      <CalendarBlock
        selectedDate={selectedDate}
        events={events}
        nextDay={nextDay}
        goToday={goToday}
        prevDay={prevDay}
        onAddEventPressed={() => setShowAddEventModal(true)}
      />
      <CreateEventModal
        selectedDate={selectedDate}
        showAddEventModal={showAddEventModal}
        setShowAddEventModal={setShowAddEventModal}
      />
    </>
  );
}

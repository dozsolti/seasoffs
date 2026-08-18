import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Event } from "../../types";
import { eventsListModel } from "../models/eventList.model";

interface EventsState {
  events: Event[];

  addEvent: (event: Event) => void;

  clearAll: () => void;
}

export const useEventsStore = create<EventsState>()(
  immer((set) => ({
    events: eventsListModel.templates.example,

    addEvent: (event) =>
      set((state) => {
        state.events.push(event);
      }),

    clearAll: () =>
      set((state) => {
        state.events = [];
      }),
  })),
);

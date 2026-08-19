import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import type { Event } from "@/types";
import { eventsListModel } from "@/data/models/eventList.model";

interface EventsState {
  events: Event[];

  addEvent: (event: Event) => void;
  deleteEvent: (event: Event) => void;

  clearAll: () => void;
}

export const useEventsStore = create<EventsState>()(
  persist(
    immer((set) => ({
      events: [],

      addEvent: (event) =>
        set((state) => {
          state.events.push(event);
        }),

      deleteEvent: (event) =>
        set((state) => {
          state.events = state.events.filter(
            (item) => item.date !== event.date,
          );
        }),

      clearAll: () =>
        set((state) => {
          state.events = [];
        }),
    })),
    {
      name: "events-storage",
      partialize: (state) => ({ events: state.events }),
      version: 0,
      storage: {
        getItem: (key: string) => {
          const json = localStorage.getItem(key);
          if (!json) {
            return {
              state: { events: [] },
            };
          }

          const state = eventsListModel.parse.localStorage.from(json);
          return {
            state: { events: state },
          };
        },
        setItem: (key: string, storage) => {
          localStorage.setItem(
            key,
            eventsListModel.parse.localStorage.to(storage.state.events),
          );
        },
        removeItem: (key: string) => {
          console.log("removing item from localStorage", key);
          localStorage.removeItem(key);
        },
      },
    },
  ),
);

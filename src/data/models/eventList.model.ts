import { manageModel } from "@/lib/manage-model";
import type { Event } from "@/types";

export const eventsListModel = manageModel<Event[]>()(
  {
    templates: {
      example: [
        {
          date: new Date("2023-07-18T09:00:00"),
          duration: 115,
          title: "Standup",
          color: "blue",
        },
        {
          date: new Date("2026-08-18T10:30:00"),
          duration: 30,
          title: "Design review — cushions",
          color: "purple",
        },
        {
          date: new Date("2026-08-18T12:00:00"),
          duration: 45,
          title: "Lunch & learn",

          color: "yellow",
        },
        {
          date: new Date("2026-08-18T14:00:00"),
          duration: 30,
          title: "1:1 with Alan",

          color: "mint",
        },
        {
          date: new Date("2026-08-18T16:00:00"),
          duration: 45,
          title: "Ship review",
          color: "pink",
        },
      ],
    },
  },
  {
    get: {
      byDate: (events, date: Date) =>
        events.filter(
          (e) =>
            e.date.toISOString().split("T")[0] ===
            date.toISOString().split("T")[0],
        ),
    },
  },
);

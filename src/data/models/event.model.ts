import { manageModel } from "@/lib/manage-model";
import type { Event } from "@/types";

export const eventModel = manageModel<Event>()(
  {
    templates: {
      basic: {
        title: "New event",
        description: "",
        color: "purple",
        date: new Date(),
        duration: 60,
      },
    },
  },
  {
    sort: {
      ascByDate: (a, b) => a.date.getTime() - b.date.getTime(),
    },
  },
);

import { Card } from "../surface";
import { Stack, Row, Spacer } from "../layout";
import { Heading, Text, Eyebrow, Highlight } from "../text";
import { Button } from "../Button";
import { Empty as EmptyState } from "../feedback";
import { Icon } from "../Icon";
import type { Event } from "@/types";
import { fromMinutes, getNowMinutes, formatDuration } from "@/lib/date";
import { eventModel } from "@/data/models/event.model";

// Bounds for the visible day and the point "now" sits at — wall-clock so the demo always renders the same free slots and now-line.
const DAY_START = 0 * 60;
const DAY_END = 24 * 60;
const FREE_THRESHOLD = 10;

type TimelineItem =
  | { kind: "event"; start: number; event: Event }
  | { kind: "free"; start: number; end: number }
  | { kind: "now" };

/* Turns a day's sparse event list into a full timeline: gaps of at least
 * FREE_THRESHOLD become "free" rows, and — only for the day that is actually
 * "today" — a now-line is spliced in wherever NOW_MINUTES falls. */
function buildTimeline(
  events: Event[],
  showNow: boolean,
  nowMinutes: number,
): TimelineItem[] {
  if (events.length === 0)
    return [{ kind: "free", start: DAY_START, end: DAY_END }];

  const sortedEvents = [...events].sort(eventModel.sort.ascByDate);
  const items: TimelineItem[] = [];
  let cursor = DAY_START;
  let nowPlaced = !showNow;

  function placeNowBefore(start: number) {
    if (!nowPlaced && start > nowMinutes) {
      items.push({ kind: "now" });
      nowPlaced = true;
    }
  }

  for (const event of sortedEvents) {
    const start = event.date.getHours() * 60 + event.date.getMinutes();
    if (start - cursor >= FREE_THRESHOLD) {
      placeNowBefore(start);
      items.push({ kind: "free", start: cursor, end: start });
    }
    placeNowBefore(start);
    items.push({ kind: "event", start, event });
    cursor = Math.max(cursor, start + event.duration);
  }
  if (DAY_END - cursor >= FREE_THRESHOLD) {
    placeNowBefore(DAY_END);
    items.push({ kind: "free", start: cursor, end: DAY_END });
  }
  if (!nowPlaced) items.push({ kind: "now" });

  return items;
}

function EventRow({ event }: { event: Event }) {
  return (
    <Row gap={3} wrap={false} align="top">
      <div style={{ width: 42, flex: "none", paddingTop: 4 }}>
        <Text size="sm" muted num>
          {event.date.getHours().toString().padStart(2, "0")}:
          {event.date.getMinutes().toString().padStart(2, "0")}
        </Text>
        <Text size="xs" muted truncate>
          {formatDuration(event.duration)}
        </Text>
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          borderRadius: 18,
          padding: "14px 16px",
          background: `var(--${event.color})`,
          color: "var(--on-accent)",
          boxShadow: "var(--pouf-control)",
        }}
      >
        <Row justify="between" wrap={false}>
          <Stack gap={1}>
            <Text>{event.title}</Text>
            <Text size="sm">{"who"}</Text>
          </Stack>
          <Spacer />
          <Icon name="calendar" size="sm" />
        </Row>
      </div>
    </Row>
  );
}

function FreeRow({
  start,
  end,
  isEdge,
}: {
  start: number;
  end: number;
  isEdge: boolean;
}) {
  const duration = end - start;
  return (
    <Row gap={3} wrap={false} align="center">
      <div style={{ width: 52, flex: "none" }}>
        <Text size="sm" muted num>
          {fromMinutes(start)}
        </Text>
      </div>
      <Row gap={2} wrap={false} align="center">
        <Icon name={isEdge ? "cloud" : "clock"} size="sm" />
        <Text size="sm" muted>
          {isEdge ? "Sleep" : "Free for"} {fromMinutes(duration)}
        </Text>
      </Row>
    </Row>
  );
}

function NowLine() {
  return (
    <Row gap={3} wrap={false} align="center">
      <div style={{ width: 52, flex: "none" }}>
        <Text size="sm" num>
          {fromMinutes(getNowMinutes())}
        </Text>
      </div>
      <div
        style={{
          flex: 1,
          height: 3,
          borderRadius: 999,
          background: "var(--yellow)",
        }}
      />
    </Row>
  );
}

/** An example day agenda: a day picker across the week, timed events, a
 *  now-line pinned to the current moment on today's timeline, and the free
 *  slots between events. */
export function CalendarBlock({
  selectedDate,
  events,
  goToday,
  nextDay,
  prevDay,
  onAddEventPressed,
}: {
  selectedDate: Date;
  events: Event[];
  goToday: () => void;
  nextDay: () => void;
  prevDay: () => void;
  onAddEventPressed: () => void;
}) {
  const date = selectedDate.toISOString().split("T")[0];
  const dateName = selectedDate.toLocaleDateString(undefined, {
    weekday: "long",
  });
  const dateDay = selectedDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  const isToday = date === new Date().toISOString().split("T")[0];
  const timeline = buildTimeline(events, isToday, getNowMinutes());

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "12px 18px" }}>
      <Card variant="tight">
        <Stack gap={2}>
          <Row justify="between" align="center" wrap={false}>
            <span style={{ flex: 1 }}>
              <Eyebrow>
                {isToday ? `Today, ${dateName}` : dateName}

                <Text muted size="sm" truncate>
                  {events.length} {events.length === 1 ? "event" : "events"}
                </Text>
              </Eyebrow>
            </span>
            <span style={{ flex: 2, textAlign: "right" }}>
              <span onClick={onAddEventPressed} style={{ cursor: "pointer" }}>
                <Highlight>
                  <Row gap={1} wrap={false} align="center">
                    <Icon name="calendar" size="sm" />
                    <Heading level={2}>{dateDay}</Heading>
                  </Row>
                </Highlight>
              </span>
            </span>
          </Row>

          <Stack gap={2}>
            {events.length > 0 &&
              timeline.map((item, idx) => {
                if (item.kind === "now") return <NowLine key="now" />;
                if (item.kind === "free")
                  return (
                    <FreeRow
                      key={`free-${idx}`}
                      start={item.start}
                      isEdge={idx === 0 || idx === timeline.length - 1}
                      end={item.end}
                    />
                  );
                return (
                  <EventRow
                    key={item.event.date.toISOString()}
                    event={item.event}
                  />
                );
              })}
            {events.length === 0 && (
              <EmptyState icon="ok" title="Nothing scheduled">
                Enjoy the quiet.
              </EmptyState>
            )}
          </Stack>

          <Row justify="between">
            <Button
              size="sm"
              variant="quiet"
              label="Previous day"
              onClick={prevDay}
            >
              <Icon name="prev" size="sm" />
            </Button>
            <Button
              size="sm"
              variant="quiet"
              disabled={isToday}
              onClick={goToday}
            >
              Today
            </Button>
            <Button
              size="sm"
              variant="quiet"
              label="Next day"
              onClick={nextDay}
            >
              <Icon name="next" size="sm" />
            </Button>
          </Row>
        </Stack>
      </Card>
    </div>
  );
}

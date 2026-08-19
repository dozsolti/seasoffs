import { Confirm } from "@/components/pouf/controls";
import { Highlight } from "@/components/pouf/text";
import { Sheet } from "@/components/pouf/sheet";
import { Stack, Row } from "@/components/pouf/layout";
import { Text } from "@/components/pouf/text";
import { formatDuration } from "@/lib/date";
import type { Event } from "@/types";

export default function EventDetailsModal({
  event,
  open,
  onOpenChange,
  onDelete,
}: {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (event: Event) => void;
}) {
  if (!event) return null;

  const start = event.date.toLocaleString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const end = new Date(event.date.getTime() + event.duration * 60 * 1000);

  return (
    <Sheet
      title={<Highlight tone={event.color}>{event.title}</Highlight>}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Stack gap={4}>
        <div>
          <div>
            <Text size="sm" muted>
              Time{" "}
            </Text>
            <Text size="md">
              {start}
              {" - "}
              {end.toLocaleString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </Text>
          </div>
          <div>
            <Text size="sm" muted>
              Duration{" "}
            </Text>
            <Text size="md">{formatDuration(event.duration)}</Text>
          </div>
        </div>

        {event.description ? (
          <div className="bg-bg px-4 py-3 rounded-control">
            <Text size="sm" muted>
              Notes
            </Text>
            <br />
            <Text size="md">{event.description}</Text>
          </div>
        ) : null}

        <Row justify="end">
          <Confirm
            title="Delete event?"
            body={`This removes “${event.title}” from the calendar.`}
            cancelLabel="Keep"
            confirmLabel="Delete"
            onConfirm={() => {
              onDelete(event);
            }}
            tone="orange"
            details={
              <div className="bg-bg px-4 py-3 rounded-control">
                <Text size="sm" muted>
                  {start} • {formatDuration(event.duration)}
                </Text>
              </div>
            }
          >
            <Text>Delete</Text>
          </Confirm>
        </Row>
      </Stack>
    </Sheet>
  );
}

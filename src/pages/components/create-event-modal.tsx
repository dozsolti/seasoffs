import { Button } from "@/components/pouf/Button";
import { Field, Input, Textarea } from "@/components/pouf/Input";
import { NumberInput } from "@/components/pouf/NumberInput";

import { Sheet } from "@/components/pouf/sheet";
import { useEventsStore } from "@/data/stores/useEventsStore";

import type { Tone } from "@/types";
import { useState } from "react";

export default function CreateEventModal({
  selectedDate,
  showAddEventModal,
  setShowAddEventModal,
}: {
  selectedDate: Date;
  showAddEventModal: boolean;
  setShowAddEventModal: (open: boolean) => void;
}) {
  const addEvent = useEventsStore((state) => state.addEvent);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(selectedDate.toISOString().slice(0, 10));
  const [duration, setDuration] = useState("60");
  const [color, setColor] = useState<Tone>("purple");
  const [error, setError] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate(selectedDate.toISOString().slice(0, 10));
    setDuration("60");
    setColor("purple");
    setError("");
  };

  const submitEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      setError("Enter an event title.");
      return;
    }

    addEvent({
      title: title.trim(),
      description: description.trim() || undefined,
      color,
      date: new Date(`${date}`),
      duration: Math.max(1, Number(duration) || 60),
    });
    resetForm();
    setShowAddEventModal(false);
  };

  return (
    <Sheet
      title="Add Event"
      open={showAddEventModal}
      onOpenChange={(open) => {
        setShowAddEventModal(open);
        if (!open) resetForm();
      }}
    >
      <form className="flex flex-col gap-5" onSubmit={submitEvent}>
        <Field label="Title" error={error}>
          {(id, describedBy) => (
            <Input
              id={id}
              value={title}
              onChange={(value) => {
                setTitle(value);
                if (error) setError("");
              }}
              describedBy={describedBy}
              placeholder="Event title"
              autoFocus
              required
            />
          )}
        </Field>
        <Field label="Date">
          {(id, describedBy) => (
            <Input
              id={id}
              type="datetime-local"
              value={date}
              onChange={setDate}
              describedBy={describedBy}
              required
            />
          )}
        </Field>
        <div className="gap-4 grid grid-cols-2">
          <Field label="Duration (minutes)">
            {(id, describedBy) => (
              <NumberInput
                id={id}
                min={0}
                value={duration}
                onChange={setDuration}
                describedBy={describedBy}
                step={1}
                max={24 * 60}
              />
            )}
          </Field>
          <Field label="Color">
            {(id, describedBy) => (
              <select
                id={id}
                value={color}
                onChange={(event) => setColor(event.target.value as Tone)}
                aria-describedby={describedBy}
                className="bg-bg px-5 py-4 rounded-control w-full font-bold text-ink pouf-input cushion-field"
              >
                {(["purple", "pink", "blue", "mint", "yellow"] as Tone[]).map(
                  (tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ),
                )}
              </select>
            )}
          </Field>
        </div>
        <Field label="Description">
          {(id, describedBy) => (
            <Textarea
              id={id}
              value={description}
              onChange={setDescription}
              describedBy={describedBy}
              placeholder="Optional notes"
              rows={3}
            />
          )}
        </Field>
        <Button type="submit">Create event</Button>
      </form>
    </Sheet>
  );
}

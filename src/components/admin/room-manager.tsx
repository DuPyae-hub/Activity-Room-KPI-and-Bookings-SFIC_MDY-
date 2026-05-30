"use client";

import { RoomStatus, RoomType } from "@prisma/client";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { deleteRoomAction, upsertRoomAction } from "@/actions/rooms";
import { RoomTypeBadge } from "@/components/layout/space-switcher";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { BOOKING_HOURS_LABEL } from "@/lib/booking-hours";
import { ROOM_TYPE_LABELS } from "@/lib/room-types";
import type { RoomWithAmenities } from "@/lib/types";

const emptyForm = {
  id: undefined as string | undefined,
  name: "",
  capacity: 20,
  amenities: "",
  status: RoomStatus.AVAILABLE as RoomStatus,
  roomType: RoomType.ACTIVITY_ROOM as RoomType,
};

export function RoomManager({ rooms }: { rooms: RoomWithAmenities[] }) {
  const [form, setForm] = useState(emptyForm);
  const [filterType, setFilterType] = useState<RoomType | "ALL">("ALL");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredRooms = useMemo(
    () =>
      filterType === "ALL" ? rooms : rooms.filter((r) => r.roomType === filterType),
    [rooms, filterType],
  );

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const result = await upsertRoomAction({
        id: form.id,
        name: form.name,
        capacity: form.capacity,
        amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean),
        status: form.status,
        roomType: form.roomType,
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setForm(emptyForm);
    });
  };

  const remove = (roomId: string) => {
    startTransition(async () => {
      const result = await deleteRoomAction(roomId);
      if (!result.success) setError(result.error);
    });
  };

  const startCreate = (roomType: RoomType) => {
    setForm({ ...emptyForm, roomType });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(["ALL", RoomType.ACTIVITY_ROOM, RoomType.CLASSROOM] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilterType(type)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              filterType === type
                ? "bg-brand-red/15 text-brand-red ring-1 ring-brand-red/30"
                : "text-foreground-muted hover:bg-stone-100"
            }`}
          >
            {type === "ALL" ? "All spaces" : ROOM_TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <GlassCard gradient className="p-6">
          <h3 className="mb-1 text-lg font-semibold">
            {form.id ? "Edit space" : "Add space"}
          </h3>
          <p className="mb-4 text-sm text-foreground-muted">
            Activity rooms: 2 or 3 hours. Classrooms: 2, 3, 5, or custom hours ({BOOKING_HOURS_LABEL}{" "}
            MMT).
          </p>
          <div className="space-y-3">
            <div>
              <label className="field-label">Space type</label>
              <select
                value={form.roomType}
                onChange={(e) =>
                  setForm({ ...form, roomType: e.target.value as RoomType })
                }
                className="field-input mt-1"
              >
                <option value={RoomType.ACTIVITY_ROOM}>{ROOM_TYPE_LABELS.ACTIVITY_ROOM}</option>
                <option value={RoomType.CLASSROOM}>{ROOM_TYPE_LABELS.CLASSROOM}</option>
              </select>
            </div>
            <input
              placeholder={form.roomType === RoomType.CLASSROOM ? "e.g. Classroom B203" : "Room name"}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="field-input"
            />
            <input
              type="number"
              placeholder="Capacity"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
              className="field-input"
            />
            <input
              placeholder="Amenities (comma-separated)"
              value={form.amenities}
              onChange={(e) => setForm({ ...form, amenities: e.target.value })}
              className="field-input"
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as RoomStatus })}
              className="field-input"
            >
              <option value={RoomStatus.AVAILABLE}>AVAILABLE</option>
              <option value={RoomStatus.MAINTENANCE}>MAINTENANCE</option>
            </select>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex flex-wrap gap-2">
              <Button variant="gold" disabled={isPending} onClick={submit}>
                <Plus className="h-4 w-4" />
                {form.id ? "Update" : "Create"}
              </Button>
              {form.id && (
                <Button variant="secondary" onClick={() => setForm(emptyForm)}>
                  Cancel
                </Button>
              )}
              {!form.id && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => startCreate(RoomType.CLASSROOM)}
                  >
                    New classroom
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => startCreate(RoomType.ACTIVITY_ROOM)}
                  >
                    New activity room
                  </Button>
                </>
              )}
            </div>
          </div>
        </GlassCard>

        <div className="space-y-3">
          {filteredRooms.length === 0 && (
            <GlassCard className="p-6 text-center text-sm text-foreground-muted">
              No {filterType === "ALL" ? "spaces" : ROOM_TYPE_LABELS[filterType].toLowerCase()} yet.
              Create one using the form.
            </GlassCard>
          )}
          {filteredRooms.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="flex items-start justify-between gap-4 p-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{room.name}</p>
                    <RoomTypeBadge roomType={room.roomType} />
                    <StatusBadge status={room.status} type="room" />
                  </div>
                  <p className="text-sm text-foreground-muted">Capacity {room.capacity}</p>
                  <p className="mt-1 text-xs text-brand-red/80">
                    {room.amenities.join(" · ") || "No amenities listed"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      setForm({
                        id: room.id,
                        name: room.name,
                        capacity: room.capacity,
                        amenities: room.amenities.join(", "),
                        status: room.status,
                        roomType: room.roomType,
                      })
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={isPending}
                    onClick={() => remove(room.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

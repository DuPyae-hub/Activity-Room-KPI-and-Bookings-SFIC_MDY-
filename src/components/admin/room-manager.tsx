"use client";

import { RoomStatus } from "@prisma/client";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteRoomAction, upsertRoomAction } from "@/actions/rooms";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import type { RoomWithAmenities } from "@/lib/types";

const emptyForm = {
  id: undefined as string | undefined,
  name: "",
  capacity: 20,
  amenities: "",
  status: RoomStatus.AVAILABLE as RoomStatus,
};

export function RoomManager({ rooms }: { rooms: RoomWithAmenities[] }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const result = await upsertRoomAction({
        id: form.id,
        name: form.name,
        capacity: form.capacity,
        amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean),
        status: form.status,
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

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <GlassCard gradient className="p-6">
        <h3 className="mb-4 text-lg font-semibold">
          {form.id ? "Edit Room" : "Add Room"}
        </h3>
        <div className="space-y-3">
          <input
            placeholder="Room name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-border bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
          />
          <input
            type="number"
            placeholder="Capacity"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
            className="w-full rounded-xl border border-border bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
          />
          <input
            placeholder="Amenities (comma-separated)"
            value={form.amenities}
            onChange={(e) => setForm({ ...form, amenities: e.target.value })}
            className="w-full rounded-xl border border-border bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-brand-red/40"
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as RoomStatus })}
            className="w-full rounded-xl border border-border bg-stone-50 px-4 py-2.5 text-sm outline-none"
          >
            <option value={RoomStatus.AVAILABLE}>AVAILABLE</option>
            <option value={RoomStatus.MAINTENANCE}>MAINTENANCE</option>
          </select>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-2">
            <Button variant="gold" disabled={isPending} onClick={submit}>
              <Plus className="h-4 w-4" />
              {form.id ? "Update" : "Create"}
            </Button>
            {form.id && (
              <Button variant="secondary" onClick={() => setForm(emptyForm)}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </GlassCard>

      <div className="space-y-3">
        {rooms.map((room, i) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className="flex items-start justify-between gap-4 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{room.name}</p>
                  <StatusBadge status={room.status} type="room" />
                </div>
                <p className="text-sm text-foreground-muted">Capacity {room.capacity}</p>
                <p className="mt-1 text-xs text-brand-red/80">
                  {room.amenities.join(" · ")}
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
  );
}

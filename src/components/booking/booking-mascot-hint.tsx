"use client";

import { MascotSpot } from "@/components/animated/mascot-spot";
import { GlassCard } from "@/components/ui/glass-card";
import { RoomType } from "@prisma/client";
import { getRoomSpaceOption, type RoomSpaceParam } from "@/lib/room-types";

export function BookingMascotHint({ space }: { space: RoomSpaceParam }) {
  const meta = getRoomSpaceOption(
    space === "classroom" ? RoomType.CLASSROOM : RoomType.ACTIVITY_ROOM,
  );
  const isClassroom = space === "classroom";

  return (
    <GlassCard className="mb-6 border-border bg-surface-elevated/60 p-5 sm:p-6">
      <MascotSpot
        layout="inline"
        size="md"
        captionLabel="Booking"
        caption={
          isClassroom
            ? "Select a classroom card below to choose your time slot."
            : "Select an activity room card below to choose your time slot."
        }
        title={`How ${meta.label.toLowerCase()} booking works`}
        description={
          isClassroom
            ? "Pick 2, 3, or 5 hours — or enter a custom length — between 8 AM and 10 PM (Myanmar Time). Admin approves before it appears on Room KPI."
            : "Pick a 2 or 3 hour slot between 8 AM and 10 PM (Myanmar Time). Admin approves before it appears on Room KPI."
        }
      />
    </GlassCard>
  );
}

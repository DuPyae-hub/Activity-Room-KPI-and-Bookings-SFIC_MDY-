import { RoomType } from "@prisma/client";

export function validateBookingParty(
  roomType: RoomType,
  data: {
    clubId?: string;
    className?: string;
    purpose?: string;
  },
): { ok: true; purpose: string; clubId: string | null; className: string | null } | { ok: false; error: string } {
  if (roomType === RoomType.CLASSROOM) {
    const className = data.className?.trim() ?? "";
    if (className.length < 2) {
      return { ok: false, error: "Class name is required for classroom bookings." };
    }
    const notes = data.purpose?.trim() ?? "";
    return {
      ok: true,
      clubId: null,
      className,
      purpose: notes || `Class: ${className}`,
    };
  }

  const clubId = data.clubId?.trim() ?? "";
  if (!clubId) {
    return { ok: false, error: "Please select a club for activity room bookings." };
  }
  const purpose = data.purpose?.trim() ?? "";
  if (purpose.length < 3) {
    return { ok: false, error: "Please describe the purpose of your booking (at least 3 characters)." };
  }
  return {
    ok: true,
    clubId,
    className: null,
    purpose,
  };
}

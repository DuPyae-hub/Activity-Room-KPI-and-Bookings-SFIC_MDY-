import { RoomType } from "@prisma/client";

export type RoomSpaceParam = "activity" | "classroom";

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  ACTIVITY_ROOM: "Activity room",
  CLASSROOM: "Classroom",
};

export const ROOM_SPACE_OPTIONS: {
  param: RoomSpaceParam;
  roomType: RoomType;
  label: string;
  shortLabel: string;
  description: string;
}[] = [
  {
    param: "activity",
    roomType: RoomType.ACTIVITY_ROOM,
    label: "Activity rooms",
    shortLabel: "Activity",
    description: "Studios, labs, and club activity spaces",
  },
  {
    param: "classroom",
    roomType: RoomType.CLASSROOM,
    label: "Classrooms",
    shortLabel: "Classroom",
    description: "Teaching and lecture rooms",
  },
];

export function parseRoomSpaceParam(value?: string): RoomType {
  if (value === "classroom") return RoomType.CLASSROOM;
  return RoomType.ACTIVITY_ROOM;
}

export function roomTypeToSpaceParam(roomType: RoomType): RoomSpaceParam {
  return roomType === RoomType.CLASSROOM ? "classroom" : "activity";
}

export function getRoomSpaceOption(roomType: RoomType) {
  return ROOM_SPACE_OPTIONS.find((o) => o.roomType === roomType) ?? ROOM_SPACE_OPTIONS[0]!;
}

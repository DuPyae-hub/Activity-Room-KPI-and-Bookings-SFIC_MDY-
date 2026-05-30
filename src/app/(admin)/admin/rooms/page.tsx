import { RoomManager } from "@/components/admin/room-manager";
import { getRooms } from "@/data/queries";

export default async function AdminRoomsPage() {
  const rooms = await getRooms();

  const activityCount = rooms.filter((r) => r.roomType === "ACTIVITY_ROOM").length;
  const classroomCount = rooms.filter((r) => r.roomType === "CLASSROOM").length;

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm text-brand-red">Infrastructure</p>
        <h1 className="text-3xl font-bold">Spaces & classrooms</h1>
        <p className="mt-1 text-foreground-muted">
          Add or edit activity rooms and classrooms. Students book each type from the public site
          (Activity / Classroom tabs).{" "}
          <span className="text-foreground">
            {activityCount} activity · {classroomCount} classroom
          </span>
        </p>
      </header>
      <RoomManager rooms={rooms} />
    </div>
  );
}

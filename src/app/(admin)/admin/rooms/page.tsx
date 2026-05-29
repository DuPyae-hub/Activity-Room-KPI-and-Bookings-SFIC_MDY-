import { RoomManager } from "@/components/admin/room-manager";
import { getRooms } from "@/data/queries";

export default async function AdminRoomsPage() {
  const rooms = await getRooms();

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm text-brand-red">Infrastructure</p>
        <h1 className="text-3xl font-bold">Room & Slot Manager</h1>
        <p className="mt-1 text-white/50">
          CRUD for activity rooms and amenity tags (stored as JSON arrays).
        </p>
      </header>
      <RoomManager rooms={rooms} />
    </div>
  );
}

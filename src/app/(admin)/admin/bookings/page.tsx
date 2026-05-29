import { BookingManager } from "@/components/admin/booking-manager";
import { getAllBookingsForAdmin, getClubs, getRooms } from "@/data/queries";

export default async function AdminBookingsPage() {
  const [bookings, rooms, clubs] = await Promise.all([
    getAllBookingsForAdmin(),
    getRooms(),
    getClubs(),
  ]);

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm text-brand-red">Management console</p>
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="mt-1 text-white/50">
          View, edit, approve, reject, or permanently delete any booking — including approved sessions.
        </p>
      </header>
      <BookingManager
        bookings={bookings}
        rooms={rooms.map((r) => ({ id: r.id, name: r.name }))}
        clubs={clubs}
      />
    </div>
  );
}

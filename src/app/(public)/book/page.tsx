import { format } from "date-fns";
import { BookRoomClient } from "@/components/booking/book-room-client";
import { getClubs, getOccupiedHoursByDate, getRooms } from "@/data/queries";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const date = params.date ?? format(new Date(), "yyyy-MM-dd");

  const [rooms, clubs] = await Promise.all([getRooms(), getClubs()]);
  const occupiedByRoom = await getOccupiedHoursByDate(
    date,
    rooms.map((r) => r.id),
  );
  const allAmenities = Array.from(
    new Set(rooms.flatMap((r) => r.amenities)),
  ).sort();

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm text-brand-red">Smart booking</p>
        <h1 className="text-3xl font-bold">Book an Activity Room</h1>
        <p className="mt-1 text-white/50">
          No account needed — enter your details when you submit a request.
        </p>
      </header>
      <BookRoomClient
        rooms={rooms}
        clubs={clubs}
        allAmenities={allAmenities}
        date={date}
        occupiedByRoom={occupiedByRoom}
      />
    </div>
  );
}

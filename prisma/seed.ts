import { PrismaClient, Role, RoomStatus } from "@prisma/client";
import { SFIC_MANDALAY_CLUBS } from "../src/lib/sfic-clubs";

const prisma = new PrismaClient();

async function main() {
  const clubs = await Promise.all(
    SFIC_MANDALAY_CLUBS.map((club) =>
      prisma.club.upsert({
        where: { name: club.name },
        update: {
          logo: club.logo,
          description: club.description,
        },
        create: {
          name: club.name,
          logo: club.logo,
          description: club.description,
        },
      }),
    ),
  );

  const itClub = clubs[0];

  await prisma.user.upsert({
    where: { email: "admin@sfic.edu" },
    update: { clubId: itClub.id },
    create: {
      name: "SFIC Admin",
      email: "admin@sfic.edu",
      role: Role.ADMIN,
      clubId: itClub.id,
    },
  });

  const rooms = [
    {
      name: "Studio Alpha",
      capacity: 30,
      amenities: ["Sound System", "Stage Lighting", "Microphones"],
      status: RoomStatus.AVAILABLE,
    },
    {
      name: "LAN Arena",
      capacity: 24,
      amenities: ["High-Speed LAN", "Gaming PCs", "Streaming Setup"],
      status: RoomStatus.AVAILABLE,
    },
    {
      name: "Forum Hall",
      capacity: 80,
      amenities: ["Projector", "PA System", "Podium"],
      status: RoomStatus.AVAILABLE,
    },
    {
      name: "Creative Lab",
      capacity: 20,
      amenities: ["Green Screen", "Softbox Lighting", "Editing Stations"],
      status: RoomStatus.AVAILABLE,
    },
    {
      name: "Workshop Beta",
      capacity: 40,
      amenities: ["Whiteboards", "Flexible Seating", "Wi-Fi"],
      status: RoomStatus.MAINTENANCE,
    },
  ];

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { name: room.name },
      update: { amenities: room.amenities, capacity: room.capacity, status: room.status },
      create: room,
    });
  }

  console.log(`Seed completed: ${clubs.length} clubs, admin user, and rooms ready.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

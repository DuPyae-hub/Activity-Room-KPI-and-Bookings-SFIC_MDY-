import { PrismaClient, Role, RoomStatus } from "@prisma/client";
import { SFIC_MANDALAY_CLUBS } from "../src/lib/sfic-clubs";

const prisma = new PrismaClient();

const OFFICIAL_CLUB_NAMES = new Set<string>(
  SFIC_MANDALAY_CLUBS.map((c) => c.name as string),
);

async function removeLegacyClubs(keepClubId: string) {
  const allClubs = await prisma.club.findMany();

  for (const club of allClubs) {
    if (OFFICIAL_CLUB_NAMES.has(club.name)) continue;

    const bookingCount = await prisma.booking.count({ where: { clubId: club.id } });
    if (bookingCount > 0) {
      console.warn(`Skipping legacy club "${club.name}" — has ${bookingCount} booking(s).`);
      continue;
    }

    const users = await prisma.user.findMany({ where: { clubId: club.id } });
    for (const user of users) {
      if (user.role === Role.ADMIN) {
        await prisma.user.update({
          where: { id: user.id },
          data: { clubId: keepClubId },
        });
      } else {
        await prisma.user.delete({ where: { id: user.id } });
      }
    }

    await prisma.club.delete({ where: { id: club.id } });
    console.log(`Removed legacy demo club: ${club.name}`);
  }
}

async function main() {
  const clubs = [];
  for (const club of SFIC_MANDALAY_CLUBS) {
    clubs.push(
      await prisma.club.upsert({
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
    );
  }

  const itClub = clubs[0]!;
  await removeLegacyClubs(itClub.id);

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

  const totalClubs = await prisma.club.count();
  console.log(`Seed completed: ${totalClubs} clubs in database (official SFIC MDY list).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

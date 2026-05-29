import { PrismaClient, Role, RoomStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const clubs = await Promise.all([
    prisma.club.upsert({
      where: { name: "Music Club" },
      update: {},
      create: {
        name: "Music Club",
        description: "Rehearsals, jam sessions, and live performances",
        logo: "🎵",
      },
    }),
    prisma.club.upsert({
      where: { name: "Esports Club" },
      update: {},
      create: {
        name: "Esports Club",
        description: "Competitive gaming and LAN tournaments",
        logo: "🎮",
      },
    }),
    prisma.club.upsert({
      where: { name: "Debate Society" },
      update: {},
      create: {
        name: "Debate Society",
        description: "Public speaking and parliamentary debate",
        logo: "🎤",
      },
    }),
    prisma.club.upsert({
      where: { name: "Photography Club" },
      update: {},
      create: {
        name: "Photography Club",
        description: "Studio shoots and portfolio reviews",
        logo: "📷",
      },
    }),
  ]);

  const [music, esports, debate, photo] = clubs;

  await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@sfic.edu" },
      update: {},
      create: {
        name: "SFIC Admin",
        email: "admin@sfic.edu",
        role: Role.ADMIN,
        clubId: music.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "leader@musicclub.edu" },
      update: {},
      create: {
        name: "Aria Chen",
        email: "leader@musicclub.edu",
        role: Role.USER,
        clubId: music.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "captain@esports.edu" },
      update: {},
      create: {
        name: "Marcus Lee",
        email: "captain@esports.edu",
        role: Role.USER,
        clubId: esports.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "president@debate.edu" },
      update: {},
      create: {
        name: "Priya Nair",
        email: "president@debate.edu",
        role: Role.USER,
        clubId: debate.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "lead@photo.edu" },
      update: {},
      create: {
        name: "Jordan Kim",
        email: "lead@photo.edu",
        role: Role.USER,
        clubId: photo.id,
      },
    }),
  ]);

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

  console.log("Seed completed: clubs, users, and rooms ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

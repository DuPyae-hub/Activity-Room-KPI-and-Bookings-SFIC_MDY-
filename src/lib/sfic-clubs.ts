/** Official Strategy First MDY clubs — seeded and shown on /clubs */
export const SFIC_MANDALAY_CLUBS = [
  { name: "Strategy First IT Club - MDY", logo: "💻", description: "Technology, coding, and digital innovation" },
  { name: "Strategy First Art Club - MDY", logo: "🎨", description: "Visual arts, design, and creative expression" },
  { name: "Strategy First Music Club - MDY", logo: "🎵", description: "Rehearsals, performances, and music workshops" },
  { name: "Strategy First Esports Club-MDY", logo: "🎮", description: "Competitive gaming and LAN events" },
  { name: "Strategy First Chess Club-MDY", logo: "♟️", description: "Strategy games and tournament play" },
  { name: "Strategy First Book Club-MDY", logo: "📚", description: "Reading circles and literary discussion" },
  { name: "Strategy First English Club-MDY", logo: "🗣️", description: "English practice and public speaking" },
  { name: "Strategy First Basketball Club-MDY", logo: "🏀", description: "Training, scrimmages, and tournaments" },
  { name: "Strategy First Football Club-MDY", logo: "⚽", description: "Football practice and friendly matches" },
  { name: "Strategy First Myanmar Culture Club-MDY", logo: "🇲🇲", description: "Myanmar heritage and cultural activities" },
  { name: "Strategy First Buddhist Society-MDY", logo: "☸️", description: "Mindfulness, dhamma study, and community" },
  { name: "Strategy First Community Service Club-MDY", logo: "🤝", description: "Volunteering and outreach projects" },
  { name: "Strategy First Dance Club-MDY", logo: "💃", description: "Dance practice and performances" },
  { name: "Strategy First Media Club-MDY", logo: "📸", description: "Photo, video, and campus media" },
  { name: "Strategy First Badminton Club-MDY", logo: "🏸", description: "Badminton training and competitions" },
] as const;

export const BOOKING_DURATION_OPTIONS = [2, 3] as const;
export type BookingDurationHours = (typeof BOOKING_DURATION_OPTIONS)[number];

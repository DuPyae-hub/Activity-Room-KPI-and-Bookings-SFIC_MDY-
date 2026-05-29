import { ClubManager } from "@/components/admin/club-manager";
import { getClubs } from "@/data/queries";

export default async function AdminClubsPage() {
  const clubs = await getClubs();

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm text-brand-red">Infrastructure</p>
        <h1 className="text-3xl font-bold">Clubs</h1>
        <p className="mt-1 text-foreground-muted">
          Manage Strategy First MDY clubs shown on the public clubs page and booking form.
        </p>
      </header>
      <ClubManager clubs={clubs} />
    </div>
  );
}
